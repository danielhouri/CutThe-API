const { updateClient, getClientInfo, removeStylePicture, getStylePictures, addStylePicture, getClientById, authClient, getClientAppointments, updateClientProfilePicture, updateClientPreferredBarber } = require("./controllers/Client");
const { getInfoForBarber, updateBarber, setPreferredLocation, updatePaymentMethod, AddClientToBarber, removeClientFromBarber, getBarberClients, getBarberById, authBarber, getClosestBarber, getBarberBySearch } = require("./controllers/Barber");
const { createLocation, getAllLocations, updateLocation, deleteLocation, getBarberLocations } = require("./controllers/Location");
const { getServicesByToken, createService, getServiceById, updateService, deleteService, getServicesByBarberId } = require("./controllers/Service");
const { createSlot, getAllSlots, getSlotById, updateSlot, deleteSlot, getSlotsByBarberAndLocation } = require("./controllers/Slot");
const { updateAppointmentTime, createAppointmentByBarber, getBarberAppointmentsByMonth, createAppointmentByClient, getAppointmentById, updateAppointment, deleteAppointment, cancelAppointment } = require("./controllers/Appointment");
const { deleteAboutUsImage, updateAboutUsText, updateAboutUsImageList, createAboutUs, getAboutUsById, updateAboutUsById, getAboutUsByBarberId } = require("./controllers/AboutUs");
const { createComment, getAllComments, getCommentById, updateCommentById, deleteCommentById, getCommentsByBarberId, createCommentByClient } = require("./controllers/Comment");
const { getProductsByToken, createProduct, getProductById, updateProduct, deleteProduct, getProductsByBarberId } = require("./controllers/Product");
const { createWaitlistByClient } = require("./controllers/WaitList");
const { BarberSendNotification, createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require("./controllers/Notification");

const router = require("express").Router();

// Auth routes
router.post("/clients/auth", authClient);
router.post("/barbers/auth", authBarber);

// Client routes
router.get("/clients", getClientById);
router.put("/clients", updateClient);
router.get("/clients/appointments", getClientAppointments);
router.post("/clients/ProfilePicture", updateClientProfilePicture);
router.post("/clients/PreferredBarber", updateClientPreferredBarber);
router.post("/clients/StylePicture", addStylePicture);
router.get("/clients/StylePicture", getStylePictures);
router.post("/clients/StylePicture/delete", removeStylePicture);
router.get("/clients/info/:id", getClientInfo);

// Barber routes
router.get("/barbers/:id", getBarberById);
router.put("/barbers", updateBarber);
router.get("/barbers/closest/:city/:country/:lat/:lon", getClosestBarber);
router.get("/barbers/search/:city/:country/:lat/:lon/:store/:home/:cash/:credit", getBarberBySearch);
router.get("/barbers/clients/get", getBarberClients);
router.delete("/barbers/clients/:id", removeClientFromBarber);
router.post("/barbers/clients/new", AddClientToBarber);
router.put("/barbers/PaymentMethod/:type", updatePaymentMethod);
router.put("/barbers/PreferredLocation/:locationId", setPreferredLocation);
router.get("/barbers", getInfoForBarber);

// Location routes
router.get("/locations", getAllLocations);
router.post("/locations", createLocation);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);
router.get("/locations/baber/:id", getBarberLocations);

// Service routes
router.get("/services", getServicesByToken);
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
router.get("/appointments/:id", getAppointmentById);
router.post("/appointments/clients", createAppointmentByClient);
router.post("/appointments/cancel/:id", cancelAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
router.get("/appointments/barbers/:date", getBarberAppointmentsByMonth);
router.post("/appointments/barber/create", createAppointmentByBarber);
router.post("/appointments/barber/update/time", updateAppointmentTime);

// About Us routes
router.get("/aboutus", getAboutUsById);
router.post("/aboutus", createAboutUs);
router.put("/aboutus/:id", updateAboutUsById);
router.get("/aboutus/barber/:id", getAboutUsByBarberId);
router.post("/aboutus/AddPicture", updateAboutUsImageList);
router.post("/aboutus/UpdateText", updateAboutUsText);
router.delete("/aboutus/:id", deleteAboutUsImage);

// Comment routes
router.get("/comments", getAllComments);
router.get("/comments/:id", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:id", updateCommentById);
router.delete("/comments/:id", deleteCommentById);
router.get("/barbers/:id/comments", getCommentsByBarberId);
router.post("/comments/clients", createCommentByClient);

// Product routes
router.get("/products", getProductsByToken);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get('/products/barber/:barberId', getProductsByBarberId);

// WatchList routes
router.post("/Watchlist", createWaitlistByClient);

// Notification routes
router.post('/notifications', createNotification);
router.get('/notifications', getAllNotifications);
router.get('/notifications/:id', getNotificationById);
router.put('/notifications/:id', updateNotification);
router.delete('/notifications/:id', deleteNotification);
router.put('/notifications', BarberSendNotification);


module.exports = router;
