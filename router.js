const { createClient, getClientById, updateClient, deleteClient, authClient, getClientAppointments } = require("./controllers/Client");
const { createBarber, getAllBarbers, getBarberById, updateBarber, deleteBarber, authBarber, getClosestBarber, getBarberBySearch } = require("./controllers/Barber");
const { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation, getBarberLocations } = require("./controllers/Location");
const { createService, getAllServices, getServiceById, updateService, deleteService, getServicesByBarberId } = require("./controllers/Service");
const { createSlot, getAllSlots, getSlotById, updateSlot, deleteSlot, getSlotsByBarberAndLocation } = require("./controllers/Slot");
const { createAppointmentByClient, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment, cancelAppointment } = require("./controllers/Appointment");
const { createAboutUs, getAllAboutUs, getAboutUsById, updateAboutUsById, deleteAboutUsById, getAboutUsByBarberId } = require("./controllers/AboutUs");
const { createComment, getAllComments, getCommentById, updateCommentById, deleteCommentById, getCommentsByBarberId, createCommentByClient } = require("./controllers/Comment");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByBarberId } = require("./controllers/Product");

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
router.get("/barbers/closest/:city/:country/:lat/:lon", getClosestBarber);
router.get("/barbers/search/:city/:country/:lat/:lon/:store/:home/:cash/:credit", getBarberBySearch);

// Location routes
router.get("/locations", getAllLocations);
router.get("/locations/:id", getLocationById);
router.post("/locations", createLocation);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);
router.get("/locations/baber/:id", getBarberLocations);

// Service routes
router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);
router.get("/services/barber/:id", getServicesByBarberId);

// Slot routes
router.get("/slots", getAllSlots);
router.get("/slots/:id", getSlotById);
router.post("/slots", createSlot);
router.put("/slots/:id", updateSlot);
router.delete("/slots/:id", deleteSlot);
router.get("/slots/:barberId/:locationId", getSlotsByBarberAndLocation);

// Appointment routes
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointmentById);
router.post("/appointments/clients", createAppointmentByClient);
router.post("/appointments/cancel/:id", cancelAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

// About Us routes
router.get("/aboutus", getAllAboutUs);
router.get("/aboutus/:id", getAboutUsById);
router.post("/aboutus", createAboutUs);
router.put("/aboutus/:id", updateAboutUsById);
router.delete("/aboutus/:id", deleteAboutUsById);
router.get("/aboutus/barber/:id", getAboutUsByBarberId);

// Comment routes
router.get("/comments", getAllComments);
router.get("/comments/:id", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:id", updateCommentById);
router.delete("/comments/:id", deleteCommentById);
router.get("/barbers/:id/comments", getCommentsByBarberId);
router.post("/comments/clients", createCommentByClient);

// Product routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get('/products/barber/:barberId', getProductsByBarberId);

module.exports = router;
