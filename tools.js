const { OAuth2Client } = require('google-auth-library');
require("dotenv").config({ path: "./tools.env" });

const Slot = require("./models/Slot");
const Appointment = require("./models/Appointment");
const Location = require('./models/Location');
const Barber = require('./models/Barber');
const Comment = require('./models/Comment');

const geolib = require('geolib');
const moment = require('moment/moment');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
    const slots = await Slot.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: moment.utc().startOf('day') },
    });

    // Find all appointments for the given barber, location, and date
    const appointments = await Appointment.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: moment.utc().startOf('day') },
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

        while (lastAppointmentIndex < appointments.length) {
            currentAppointment = appointments[lastAppointmentIndex];
            lastAppointment = appointments[lastAppointmentIndex - 1]

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

        if (lastAppointmentInSlot && (currentSlot.start_time <= lastAppointmentInSlot.start_time) && (lastAppointmentInSlot.end_time < currentSlot.end_time)) {
            const availableSlot = {
                start_time: lastAppointmentInSlot.end_time,
                end_time: currentSlot.end_time,
                type: "available3",
            };
            availableTimeSlots.push(availableSlot);
        }
        else if (!lastAppointmentInSlot || (lastAppointmentInSlot.end_time < currentSlot.start_time)) {
            const availableSlot = {
                start_time: currentSlot.start_time,
                end_time: currentSlot.end_time,
                type: "available4",
            };
            availableTimeSlots.push(availableSlot);
        }

    }

    console.log(availableTimeSlots)
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

module.exports = { tokenValidation, getAvailableSlots, findClosestBarbers, searchBarber };