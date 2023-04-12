const { OAuth2Client } = require('google-auth-library')
require("dotenv").config({ path: "./tools.env" });

const Slot = require("./models/Slot");
const Appointment = require("./models/Appointment");
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

        return ({ name, given_name, family_name, email, picture }); // return client data and token

    } catch (err) {
        console.log(err);
        return null;
    }
};

async function getAvailableSlots(barberId, locationId, date) {
    const slots = await Slot.find({
        barber: barberId,
        location: locationId,
        start_time: { $gte: new Date(date) },
        end_time: { $lte: new Date(date).setHours(23, 59, 59, 999) },
    });

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

    lastAppointnemtIndex = 0

    for (let i = 0; i < slots.length; i++) {
        const currentSlot = slots[i];

        for (j = lastAppointnemtIndex; j < appointments.length; j++) {
            currentAppointment = appointments[j];
            lastFreeTimeSlots = availableTimeSlots[availableTimeSlots.length - 1]

            if (currentSlot.end_time < currentAppointment.start_time) {
                lastAppointnemtIndex = j;
                break;
            }

            if (lastFreeTimeSlots &&
                currentSlot.start_time < lastFreeTimeSlots.start_time &&
                lastFreeTimeSlots.end_time < currentAppointment.start_time) {
                const availableSlot = {
                    start_time: lastFreeTimeSlots.end_time,
                    end_time: currentAppointment.start_time,
                    type: "available",
                };
                availableTimeSlots.push(availableSlot);
            }

            else if (currentSlot.start_time < currentAppointment.start_time) {
                const availableSlot = {
                    start_time: currentSlot.start_time,
                    end_time: currentAppointment.start_time,
                    type: "available",
                };
                availableTimeSlots.push(availableSlot);
            }
        }
        lastAppointmentInSlot = appointments[lastAppointnemtIndex];

        if (currentSlot.start_time <= lastAppointmentInSlot.start_time && lastAppointmentInSlot.end_time < currentSlot.end_time) {
            const availableSlot = {
                start_time: lastAppointmentInSlot.end_time,
                end_time: currentSlot.end_time,
                type: "available",
            };
            availableTimeSlots.push(availableSlot);
        }
        else {
            const availableSlot = {
                start_time: currentSlot.start_time,
                end_time: currentSlot.end_time,
                type: "available",
            };
            availableTimeSlots.push(availableSlot);
        }
    }


    console.log(availableTimeSlots)
    return availableTimeSlots;
}


getAvailableSlots('6433a0ff281cd4be80616fd9', '6433a16a281cd4be80616fdb', '2023-04-11')

module.exports = { tokenValidation };
