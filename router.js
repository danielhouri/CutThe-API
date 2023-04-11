const { createClient, getClientById, updateClient, deleteClient, authClient, getClientAppointments } = require("./controllers/Client");
const { createBarber, getAllBarbers, getBarberById, updateBarber, deleteBarber, authBarber } = require("./controllers/Barber");
const { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } = require("./controllers/Location");
const { createService, getAllServices, getServiceById, updateService, deleteService } = require("./controllers/Service");
const { createSlot, getAllSlots, getSlotById, updateSlot, deleteSlot } = require("./controllers/Slot");
const { createAppointment, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment, cancelAppointment } = require("./controllers/Appointment");
const { createAboutUs, getAllAboutUs, getAboutUsById, updateAboutUsById, deleteAboutUsById } = require("./controllers/AboutUs");
const { createComment, getAllComments, getCommentById, updateCommentById, deleteCommentById } = require("./controllers/Comment");


const router = require("express").Router();


// Auth routes
router.post("/clients/auth", authClient);
router.post("/barbers/auth", authBarber);

// Client routes
router.get("/clients", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);
router.get("/clients/appointments", getClientAppointments);

// Barber routes
router.get("/barbers", getAllBarbers);
router.get("/barbers/:id", getBarberById);
router.post("/barbers", createBarber);
router.put("/barbers/:id", updateBarber);
router.delete("/barbers/:id", deleteBarber);

// Location routes
router.get("/locations", getAllLocations);
router.get("/locations/:id", getLocationById);
router.post("/locations", createLocation);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);

// Service routes
router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Slot routes
router.get("/slots", getAllSlots);
router.get("/slots/:id", getSlotById);
router.post("/slots", createSlot);
router.put("/slots/:id", updateSlot);
router.delete("/slots/:id", deleteSlot);

// Appointment routes
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointmentById);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

router.post("/appointments/cancel/:id", cancelAppointment);

// About Us routes
router.get("/aboutus", getAllAboutUs);
router.get("/aboutus/:id", getAboutUsById);
router.post("/aboutus", createAboutUs);
router.put("/aboutus/:id", updateAboutUsById);
router.delete("/aboutus/:id", deleteAboutUsById);

// Comment routes
router.get("/comments", getAllComments);
router.get("/comments/:id", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:id", updateCommentById);
router.delete("/comments/:id", deleteCommentById);


module.exports = router;
