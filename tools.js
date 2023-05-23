const { OAuth2Client } = require('google-auth-library');
require("dotenv").config({ path: "./tools.env" });

const Slot = require("./models/Slot");
const Appointment = require("./models/Appointment");
const Location = require('./models/Location');
const Comment = require('./models/Comment');
const geolib = require('geolib');
const moment = require('moment/moment');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var admin = require('firebase-admin');
var serviceAccount = require("./cutthe-493de-firebase-adminsdk-dv32s-bce11149b4.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const tokenValidation = async (token) => {
    try {
        // verify token using Google API
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const { name, given_name, family_name, email, picture } = ticket.getPayload();

        return ({ name, given_name, family_name, email, picture });
    } catch (err) {
        console.log(err);
        return null;
    }
};

async function getAvailableSlots(barberId, locationId) {
    // Find all slots for the given barber, location, and date
    const slots_unfiltered = await Slot.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: moment().startOf('day') },
    });

    // Filter slots to only include those occurring after the current time and round the start time
    const slots = []
    slots_unfiltered.forEach(slot => {
        if (moment(slot.start_time).isBefore(moment()) && moment().isBefore(moment(slot.end_time))) {
            const now = moment();
            const roundedNow = moment({
                year: now.year(),
                month: now.month(),
                date: now.date(),
                hour: now.hour(),
                minute: Math.round(now.minute() / 10) * 10,
                second: 0,
                millisecond: 0,
            });

            slot.start_time = roundedNow
            slots.push(slot)
        }
        else if (moment().isBefore(slot.start_time)) {
            slots.push(slot)
        }
    })

    // Find all appointments for the given barber, location, and date
    const appointments = await Appointment.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: moment().startOf('day') },
        status: false
    });

    // Sort the time blocks by start time
    slots.sort((a, b) => a.start_time - b.start_time);
    appointments.sort((a, b) => a.start_time - b.start_time);

    // Calculate the gaps between time blocks
    const availableTimeSlots = [];
    lastAppointmentIndex = 0
    lastAppointmentInSlot = null

    for (let i = 0; i < slots.length; i++) {
        const currentSlot = slots[i];

        // loop through appointments to find according slots
        while (lastAppointmentIndex < appointments.length) {
            currentAppointment = appointments[lastAppointmentIndex];
            lastAppointment = appointments[lastAppointmentIndex - 1]

            // check if there is an available slot at the end of the day
            if (currentSlot.end_time < currentAppointment.start_time) {
                if (lastAppointmentIndex != 0) {
                    lastAppointmentInSlot = appointments[lastAppointmentIndex - 1];
                }
                else {
                    lastAppointmentInSlot = appointments[lastAppointmentIndex];
                    const availableSlot = {
                        start_time: currentSlot.start_time,
                        end_time: currentSlot.end_time,
                        type: "available0",
                    };
                    availableTimeSlots.push(availableSlot);
                }
                break;
            }

            // check if the appointment falls within the slot
            if (lastAppointment &&
                (currentSlot.start_time <= lastAppointment.start_time) &&
                (lastAppointment.end_time <= currentSlot.end_time) &&
                (lastAppointment.end_time < currentAppointment.start_time)) {
                const availableSlot = {
                    start_time: lastAppointment.end_time,
                    end_time: currentAppointment.start_time,
                    type: "available1",
                };
                availableTimeSlots.push(availableSlot);
            }

            // check if the appointment overlaps with the slot
            else if ((lastAppointment &&
                !((currentSlot.start_time <= lastAppointment.start_time) && (lastAppointment.end_time <= currentSlot.end_time)))
                && (currentSlot.start_time < currentAppointment.start_time)) {
                const availableSlot = {
                    start_time: currentSlot.start_time,
                    end_time: currentAppointment.start_time,
                    type: "available2",
                };
                availableTimeSlots.push(availableSlot);
            }

            // check if the appointment is the first one in the day
            else if (!lastAppointment && (currentSlot.start_time < currentAppointment.start_time)) {
                const availableSlot = {
                    start_time: currentSlot.start_time,
                    end_time: currentAppointment.start_time,
                    type: "available8",
                };
                availableTimeSlots.push(availableSlot);
            }

            lastAppointmentInSlot = appointments[lastAppointmentIndex];
            lastAppointmentIndex++;
        }

        // check if there is an available slot at the end of an appointment
        if (lastAppointmentInSlot && (currentSlot.start_time <= lastAppointmentInSlot.start_time) && (lastAppointmentInSlot.end_time < currentSlot.end_time)) {
            const availableSlot = {
                start_time: lastAppointmentInSlot.end_time,
                end_time: currentSlot.end_time,
                type: "available3",
            };
            availableTimeSlots.push(availableSlot);
        }

        // check if there is an available slot at the beginning of an appointment
        else if (!lastAppointmentInSlot || (lastAppointmentInSlot.end_time < currentSlot.start_time)) {
            const availableSlot = {
                start_time: currentSlot.start_time,
                end_time: currentSlot.end_time,
                type: "available4",
            };
            availableTimeSlots.push(availableSlot);
        }
    }

    //console.log(availableTimeSlots)
    return availableTimeSlots;
}

async function findClosestBarbers(city, country, coordinates) {
    // Find all locations in the same city and country
    const locations = await Location.find({ city, country }).populate('barber slots');

    // Calculate the distance between the current location and each location
    const distances = locations.map((location) => {
        const distance = geolib.getDistance(
            { latitude: coordinates.latitude, longitude: coordinates.longitude },
            { latitude: location.coordinates.coordinates[0], longitude: location.coordinates.coordinates[1] }
        );
        return { location, distance };
    });

    // Sort the distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Get the current day slot
    const startToday = moment().utc().startOf('day');
    const endToday = moment().utc().endOf('day');

    // Return the 10 closest barbers
    const closestBarbers = distances.slice(0, 10).map(async (distance) => {
        const barber = distance.location.barber;
        const comments = await Comment.find({ barber: barber._id });
        const avgRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;

        // Get the slots for today
        const slots = await Slot.find({
            barber: barber._id,
            start_time: { $gte: startToday.toDate() },
            end_time: { $lte: endToday.toDate() }
        });

        return {
            barber,
            avgRating,
            numComments: comments.length,
            distance: distance.distance / 1000,
            slots
        };
    });

    const results = await Promise.all(closestBarbers);
    return results;
}

async function searchBarber(city, country, lat, lon, store, home, cash, credit) {
    const locations = await Location.find({ city, country }).select('name address city barber coordinates').populate({
        path: 'barber',
        select: 'name profilePicture pay_barber_cash pay_barber_credit_card aboutUs',
        populate: {
            path: 'aboutUs',
            select: 'pictures'
        }
    });
    console.log(locations)
    const filteredBarbers = locations.filter((location) => {
        let isMatch = true;
        // if (store === "true" && !barber.store) {
        //     isMatch = false;
        // }

        // if (home === "true" && !barber.home) {
        //     isMatch = false;
        // }

        if (cash === "true" && !location.barber.pay_barber_cash) {
            isMatch = false;
        }

        if (credit === "true" && !location.barber.pay_barber_credit_card) {
            isMatch = false;
        }

        return isMatch;
    });


    const barbersWithDistanceAndRating = filteredBarbers.map(async (location) => {
        const barber = location.barber;
        const comments = await Comment.find({ barber: barber._id });
        const avgRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;

        const distanceInMeters = geolib.getDistance(
            { latitude: lat, longitude: lon },
            { latitude: location.coordinates.coordinates[0], longitude: location.coordinates.coordinates[1] }
        );

        if (barber.aboutUs.pictures.length > 0) {
            return {
                location: {
                    name: location.name,
                    address: location.address,
                    city: location.city
                },
                barber: {
                    ...barber.toObject(),
                    aboutUs: {
                        pictures: barber.aboutUs.pictures[0]
                    }
                },
                distance: distanceInMeters / 1000,
                avgRating,
            };
        }
        return {
            location: {
                name: location.name,
                address: location.address,
                city: location.city
            },
            barber,
            distance: distanceInMeters / 1000,
            avgRating,
        };
    });

    const results = await Promise.all(barbersWithDistanceAndRating);
    return results;
}

async function sendNotification(token) {
    const message = {
        token: token,
        notification: {
            body: 'hello everybody i will not be available in the dates of 15/10/23-22/10/23 please book in the advence due to pressure',
            title: 'shlomi choen',
        },
    };
    admin.messaging()
        .send(message)
        .then(response => {
            console.log('Successfully sent message:', response);
        })
        .catch(error => {
            console.log('Error sending message:', error);
        });
}


module.exports = { tokenValidation, getAvailableSlots, findClosestBarbers, searchBarber, sendNotification };