const { OAuth2Client } = require('google-auth-library');
require("dotenv").config({ path: "./tools.env" });

const Slot = require("./models/Slot");
const Appointment = require("./models/Appointment");
const Location = require('./models/Location');
const Comment = require('./models/Comment');
const WaitList = require("./models/WaitList");
const Notification = require("./models/Notification");
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

    // console.log(availableTimeSlots)
    return availableTimeSlots;
}

async function findClosestBarbers(city, country, coordinates) {
    /**
     * This function finds the closest barbers to a given location by calculating the 
     * distance between the current location and each barber's location.
     * It returns information about the closest barbers, including their average rating, 
     * number of comments, and available slots for the current day.
     */
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

async function searchBarber(city, country, lat, lon, cash, credit) {
    /**
     * This function searches for barbers in a specific city and country. 
     * It filters the results based on payment options (cash or credit). 
     * It also retrieves additional information such as barber profile pictures and aboutUs pictures.
     */
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

async function sendNotification(token, name, payload, clientId, barberId) {
    /**
     * This function sends a push notification to a specific user identified by their messaging token. 
     * It uses the Firebase Cloud Messaging service to send the notification and also saves
     * the notification details in a database.
     */
    const message = {
        token: token,
        notification: {
            body: payload,
            title: name,
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

    const notification = new Notification({
        client: clientId,
        barber: barberId,
        message: payload,
        title: name,
        createdAt: new Date()
    });

    const savedNotification = await notification.save();
    console.log('New notification created:', savedNotification);
}

async function findWaitListAppointment(barberId, name, locationId, date) {
    /**
     * This function finds clients on the waiting list for a canceled appointment 
     * and sends notifications to them. It retrieves the waiting list clients for a 
     * specific barber, location, and date. It then sends notifications to these clients and removes them from the waiting list.
     */
    const time = moment(date).format('HH:mm')
    let isMorning = time <= '12:00';
    let isAfternoon = time >= '12:00' && time < '18:00';
    let isEvening = time >= '18:00';

    // Find waiting list clients for the canceled appointment
    const waitingListClients = await WaitList.find({
        barber: barberId,
        location: locationId,
        date: {
            $gte: moment(date).startOf('day'),
            $lte: moment(date).endOf('day'),
        },
        $or: [
            { morning: isMorning },
            { afternoon: isAfternoon },
            { evening: isEvening },
        ]
    }).populate("client", "messaging_token name");

    // Send notifications to all waiting list clients
    const dateT = moment(date).format('DD/MM/YYYY')
    for (const waitingListClient of waitingListClients) {
        const { client } = waitingListClient;
        const notification = messageTranslate(2, name, { date: dateT, time: time }, 'en');
        sendToManyNotification(client.messaging_token, notification, client._id, barberId);

        // Remove the waiting list client
        await WaitList.deleteOne({ _id: waitingListClient._id });
    }
}

const getNumberOfAppointmentsToday = async (barberId) => {
    /**
     * This function counts the number of appointments for a specific barber 
     * that are scheduled for the current day.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Appointment.countDocuments({
        barber: barberId,
        start_time: { $gte: today },
        end_time: { $lte: endOfDay },
        status: false
    });

    return count;
};


const getNumberOfProductsPurchasedToday = async (barberId) => {
    /**
     * This function calculates the total number of products 
     * purchased by clients for a specific barber on the current day.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Appointment.aggregate([
        { $match: { barber: barberId, start_time: { $gte: today, $lte: endOfDay } } },
        { $unwind: "$ordered_products" },
        { $group: { _id: null, count: { $sum: "$ordered_products.quantity" } } }
    ]);

    return count.length > 0 ? count[0].count : 0;
};

const getNumberOfCancelledAppointments = async (barberId) => {
    /**
     * This function counts the number of canceled appointments for a
     * specific barber on the current day.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await Appointment.countDocuments({
        barber: barberId,
        status: true,
        start_time: { $gte: today, $lt: tomorrow }
    });

    return count;
};


const getNextAppointments = async (barberId) => {
    /**
     * This function retrieves the next 10 upcoming appointments 
     * for a specific barber.
     */
    const today = new Date();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const appointments = await Appointment.find({
        barber: barberId,
        start_time: { $gte: today, $lte: endOfDay }
    })
        .sort({ start_time: 1 })
        .limit(10)
        .populate("barber", "name profilePicture")
        .populate("location", "name");

    return appointments;
};


const getNumberOfCompletedAppointmentsToday = async (barberId) => {
    /**
     * This function counts the number of completed appointments 
     * for a specific barber on the current day.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Appointment.countDocuments({
        barber: barberId,
        start_time: { $gte: today },
        end_time: { $lte: new Date() },
        status: false
    });

    return count;
};

const getNumberOfAppointmentsPastWeek = async (barberId) => {
    /**
     * This function counts the number of appointments for a specific
     * barber in the past week.
     */
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Appointment.countDocuments({
        barber: barberId,
        start_time: { $gte: weekAgo, $lte: endOfDay }
    });

    return count;
};

const getEstimatedRevenue = async (barberId) => {
    /**
     * This function calculates the estimated revenue for a specific barber,
     * both for the current day and the past week.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const revenueToday = await Appointment.aggregate([
        { $match: { barber: barberId, start_time: { $gte: today, $lte: endOfDay } } },
        { $group: { _id: null, revenue: { $sum: "$price" } } }
    ]);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    const endOfLastDay = new Date(weekAgo); // Create a new date object for the weekAgo day
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day

    const revenuePastWeek = await Appointment.aggregate([
        { $match: { barber: barberId, start_time: { $gte: weekAgo, $lte: endOfLastDay } } },
        { $group: { _id: null, revenue: { $sum: "$price" } } }
    ]);

    return {
        today: revenueToday.length > 0 ? revenueToday[0].revenue : 0,
        pastWeek: revenuePastWeek.length > 0 ? revenuePastWeek[0].revenue : 0
    };
};


const getTotalBookedHours = async (barberId) => {
    /**
     * This function calculates the total number of booked hours and slot hours for a specific barber,
     * both for the current day and the past week.
     */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedHoursToday = await Appointment.aggregate([
        { $match: { barber: barberId, start_time: { $gte: today }, end_time: { $lte: endOfDay } } },
        {
            $group: {
                _id: null,
                bookedHours: {
                    $sum: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60 * 60] }
                }
            }
        }
    ]);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfLastDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedHoursPastWeek = await Appointment.aggregate([
        { $match: { barber: barberId, start_time: { $gte: weekAgo, $lte: endOfLastDay } } },
        {
            $group: {
                _id: null,
                bookedHours: {
                    $sum: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60 * 60] }
                }
            }
        }
    ]);

    const slotHoursToday = await Slot.aggregate([
        { $match: { barber: barberId, start_time: { $gte: today }, end_time: { $lte: endOfDay } } },
        {
            $group: {
                _id: null,
                slotHours: {
                    $sum: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60 * 60] }
                }
            }
        }
    ]);

    const slotHoursPastWeek = await Slot.aggregate([
        { $match: { barber: barberId, start_time: { $gte: weekAgo, $lte: endOfLastDay } } },
        {
            $group: {
                _id: null,
                slotHours: {
                    $sum: { $divide: [{ $subtract: ["$end_time", "$start_time"] }, 1000 * 60 * 60] }
                }
            }
        }
    ]);

    return {
        bookedHoursToday: bookedHoursToday.length > 0 ? bookedHoursToday[0].bookedHours : 0,
        bookedHoursPastWeek: bookedHoursPastWeek.length > 0 ? bookedHoursPastWeek[0].bookedHours : 0,
        slotHoursToday: slotHoursToday.length > 0 ? slotHoursToday[0].slotHours : 0,
        slotHoursPastWeek: slotHoursPastWeek.length > 0 ? slotHoursPastWeek[0].slotHours : 0
    };
};

const messageTranslate = (code, name, payload, language) => {
    /**
     * This function translates a given message code and payload into a specific language.
     * It returns a translated notification object with a title and body.
     */

    let notification = { title: '', body: '' };
    try {
        // Hebrew
        if (language == 'he') {
            // Cancel appointment
            if (code == 0) {
                const { date, time } = payload;
                notification.title = "ביטול תור"
                notification.body = 'התור שנקבע עם ' + name + ' בתאריך ' + date + ' בשעה ' + time + ' בוטל.';
            }
            // Edit appoinement
            else if (code == 1) {
                const { date, time } = payload;
                notification.title = "עדכון תור"
                notification.body = 'עודכן התור שנקבע לך עם ' + name + ' בתאריך ' + date + ' לשעה ' + time + '.';
            }
            // Free Slot
            else if (code == 2) {
                const { date } = payload;
                notification.title = "תור פנוי"
                notification.body = 'ביקשת שנזכיר לך אם מתפנה תור לתאריך ' + date + ' עם ' + name + ', מוזמן להיכנס לאפליקציה לקבוע תור מחדש.';
            }
            // New Appointment
            else if (code == 4) {
                const { date, time } = payload;
                notification.title = "תור חדש"
                notification.body = 'נקבע תור חדש עם ' + name + ' בתאריך ' + date + ' בשעה ' + time + '.';
            }
            // Appointment Remeinder
            else if (code == 5) {
                const { date, time } = payload;
                notification.title = "תזכורת לתור"
                notification.body = 'זוהי תזכורת עבור תור שנקבע עבורך עם ' + name + 'בתאריך ' + date + ' ובשעה ' + time + '.';
            }
        }
        // English
        else {
            // Cancel appointment
            if (code == 0) {
                const { date, time } = payload;
                notification.title = "Appointment Cancellation";
                notification.body = `The appointment scheduled with ${name} on ${date} at ${time} has been canceled.`;
            }
            // Edit appoinement
            else if (code == 1) {
                const { date, time } = payload;
                notification.title = "Appointment Update";
                notification.body = `Your appointment with ${name} on ${date} at ${time} has been updated.`;
            }
            // Free Slot
            else if (code == 2) {
                const { date } = payload;
                notification.title = "Available Slot";
                notification.body = `You requested to be notified if a slot becomes available on ${date} with ${name}. Feel free to log in to the application to reschedule your appointment.`;
            }
            // New Appointment
            else if (code == 4) {
                const { date, time } = payload;
                notification.title = "New Appointment";
                notification.body = `A new appointment has been scheduled with ${name} on ${date} at ${time}.`;
            }
            // Appointment Remeinder
            else if (code == 5) {
                const { date, time } = payload;
                notification.title = "Appointment Reminder"
                notification.body = `This is a reminder for your appointment scheduled with ${name} on ${date} at ${time}.`
            }
        }

        return notification;
    }
    catch (err) {
        console.log(err);
    }
}

const sendToManyNotification = async (tokens, notification, clientId, barberId) => {
    for (let token of tokens) {
        sendNotification(token, notification.title, notification.body, clientId, barberId);
    }
}

module.exports = { sendToManyNotification, messageTranslate, getTotalBookedHours, getEstimatedRevenue, getNumberOfAppointmentsPastWeek, getNumberOfCompletedAppointmentsToday, getNextAppointments, getNumberOfCancelledAppointments, getNumberOfProductsPurchasedToday, getNumberOfAppointmentsToday, findWaitListAppointment, tokenValidation, getAvailableSlots, findClosestBarbers, searchBarber, sendNotification };