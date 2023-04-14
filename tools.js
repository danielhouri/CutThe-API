const { OAuth2Client } = require('google-auth-library');
require("dotenv").config({ path: "./tools.env" });

const Slot = require("./models/Slot");
const Appointment = require("./models/Appointment");
const Location = require('./models/Location');
const Barber = require('./models/Barber');
const geolib = require('geolib');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const tokenValidation = async (token) => {
    try {
        // verify token using Google API
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const { name, given_name, family_name, email, picture } = ticket.getPayload();

        return ({ name, given_name, family_name, email, picture }); // return client data and token

    } catch (err) {
        console.log(err);
        return null;
    }
};

async function getAvailableSlots(barberId, locationId, date) {
    // Find all slots for the given barber, location, and date
    const slots = await Slot.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: new Date(date) },
        end_time: { $lte: new Date(date).setHours(23, 59, 59, 999) },
    });

    // Find all appointments for the given barber, location, and date
    const appointments = await Appointment.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: new Date(date) },
        end_time: { $lte: new Date(date).setHours(23, 59, 59, 999) },
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
                lastAppointmentInSlot = appointments[lastAppointmentIndex - 1];
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

            else if (!lastAppointment || (lastAppointment && !((currentSlot.start_time <= lastAppointment.start_time) && (lastAppointment.end_time <= currentSlot.end_time)))
                && (currentSlot.start_time < currentAppointment.start_time)) {
                const availableSlot = {
                    start_time: currentSlot.start_time,
                    end_time: currentAppointment.start_time,
                    type: "available2",
                };
                availableTimeSlots.push(availableSlot);
            }

            lastAppointmentInSlot = appointments[lastAppointmentIndex];
            lastAppointmentIndex++;
        }

        if ((currentSlot.start_time <= lastAppointmentInSlot.start_time) && (lastAppointmentInSlot.end_time < currentSlot.end_time)) {
            const availableSlot = {
                start_time: lastAppointmentInSlot.end_time,
                end_time: currentSlot.end_time,
                type: "available3",
            };
            availableTimeSlots.push(availableSlot);
        }
        else if (lastAppointmentInSlot.end_time < currentSlot.start_time) {
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

// getAvailableSlots('6433a0ff281cd4be80616fd9', '6433a16a281cd4be80616fdb', '2023-04-11')

async function findClosestBarber(city, country, coordinates) {
    // Find all locations in the same city and country
    const locations = await Location.find({ city, country }).populate('barber slots');

    // Calculate the distance between the current location and each location
    const distances = locations.map((location) => {
        console.log(location.coordinates)
        const distance = geolib.getDistance(
            { latitude: coordinates.latitude, longitude: coordinates.longitude },
            { latitude: location.coordinates.coordinates[0], longitude: location.coordinates.coordinates[1] }
        );
        return { location, distance };
    });

    // Sort the distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Return the barber for the closest location
    const closestBarber = distances[0].location.barber;
    const closestLocation = distances[0].location;


    console.log(distances)

    return { closestBarber, closestLocation };
}

module.exports = { tokenValidation, getAvailableSlots };