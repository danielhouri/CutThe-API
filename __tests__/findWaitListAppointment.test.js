const { MongoClient } = require('mongodb');
const WaitList = require('../models/WaitList');
const { findWaitListAppointment } = require('../tools');

// Mock the messageTranslate function
var mockMessageTranslate = jest.fn().mockReturnValue('Notification message');

// Mock the sendToManyNotification function
var mockSendToManyNotification = jest.fn().mockImplementation(() => { });




describe('findWaitListAppointment', () => {

  let connection;
  let db;
  const today = new Date();
  today.setMinutes(today.getMinutes() + 2); // Adding 2 minutes to avoid any time conflicts
  const client = {
    name: 'Jane Doe',
    given_name: 'Jane',
    family_name: 'Doe',
    email: 'jane@example.com',
    profilePicture: 'path/to/profile_picture.jpg',
    preferred_barber: '647e2654b00b5f7ecd0c254e',
    appointments: [],
    stylePictures: ['path/to/style_picture1.jpg', 'path/to/style_picture2.jpg'],
    phone_number: '987654321',
    messaging_token: ['token3', 'token4'],
    language: 'en',
  };
  const barber = {
    name: 'John Doe',
    email: 'john@example.com',
    given_name: 'John',
    family_name: 'Doe',
    profilePicture: 'path/to/profile_picture.jpg',
    phone_number: '123456789',
    pay_barber_cash: true,
    pay_barber_credit_card: true,
    clients: [client._id],
    aboutUs: '609c9d97883b166036f38626',
    messaging_token: ['token1', 'token2'],
    language: 'en',
  };
  const location = {
    name: 'Example Location',
    address: '123 Street',
    city: 'City',
    country: 'Country',
    coordinates: {
      type: 'Point',
      coordinates: [0, 0]
    },
    barber: barber._id
  }
  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
    await db.collection('client').insertOne(client);
    await db.collection('barber').insertOne(barber);
    await db.collection('location').insertOne(location);
  });

  afterAll(async () => {
    await db.collection('waitlists').deleteMany({});
    await db.collection('client').deleteMany({});
    await db.collection('barber').deleteMany({});
    await db.collection('location').deleteMany({});
    await connection.close();
  });
  beforeEach(() => {
    jest.resetModules(); // Reset the module cache before each test
  });
  afterEach(async () => {
    // Delete all appointment objects
    await db.collection('waitlists').deleteMany({});
  });
  it('should find waiting list clients and send notifications', async () => {
    const mockWaitList = Array.from({ length: 10 }, (_, index) => {
      const start = new Date(today.getTime() + index * 5 * 60 * 1000); // Increment start time by 5 minutes for each appointment
      const duration = Math.floor(Math.random() * 11 + 20) * 60 * 1000; // Random duration between 20 and 30 minutes
      return {
        barber: barber._id,
        location: location._id,
        client: client._id,
        date: start,
        duration: duration,
        morning: true,
        afternoon: false,
        night: false,
      };
    });
    await db.collection('waitlist').insertMany(mockWaitList);
    const mockFind = jest.fn(() => ({
      populate: jest.fn().mockResolvedValue(mockWaitList), // Resolve with expectedAppointments
    }));

    jest.spyOn(WaitList, 'find').mockImplementation(mockFind);

    const mockDeleteOne = jest.fn(async (waitingListClient) => ({
      deleteOne: await db.collection('waitlist').deleteOne({ _id: waitingListClient._id }), // Resolve with expectedAppointments
    }));
    jest.spyOn(WaitList, 'deleteOne').mockImplementation(mockDeleteOne);


    await findWaitListAppointment(barber._id, 'John Doe', location._id, today, mockMessageTranslate, mockSendToManyNotification);
    expect(mockMessageTranslate).toHaveBeenCalledTimes(mockWaitList.length);
    expect(mockSendToManyNotification).toHaveBeenCalledTimes(mockWaitList.length);
    expect(WaitList.deleteOne).toHaveBeenCalledTimes(mockWaitList.length);

  })
  it('should find waiting list clients and send notifications', async () => {
    const mockWaitList = Array.from({ length: 15 }, (_, index) => {
      const start = new Date(today.getTime() + index * 5 * 60 * 1000); // Increment start time by 5 minutes for each appointment
      const duration = Math.floor(Math.random() * 11 + 20) * 60 * 1000; // Random duration between 20 and 30 minutes
      return {
        barber: barber._id,
        location: location._id,
        client: client._id,
        date: start,
        duration: duration,
        morning: true,
        afternoon: false,
        night: false,
      };
    });
    await db.collection('waitlist').insertMany(mockWaitList);
    const mockFind = jest.fn(() => ({
      populate: jest.fn().mockResolvedValue(mockWaitList), // Resolve with expectedAppointments
    }));

    jest.spyOn(WaitList, 'find').mockImplementation(mockFind);

    const mockDeleteOne = jest.fn(async (waitingListClient) => ({
      deleteOne: await db.collection('waitlist').deleteOne({ _id: waitingListClient._id }), // Resolve with expectedAppointments
    }));
    jest.spyOn(WaitList, 'deleteOne').mockImplementation(mockDeleteOne);


    await findWaitListAppointment(barber._id, 'John Doe', location._id, today, mockMessageTranslate, mockSendToManyNotification);
    expect(mockMessageTranslate).toHaveBeenCalledTimes(mockWaitList.length);
    expect(mockSendToManyNotification).toHaveBeenCalledTimes(mockWaitList.length);
    expect(WaitList.deleteOne).toHaveBeenCalledTimes(mockWaitList.length);

  })
  it('should find waiting list clients and send notifications', async () => {
    const mockWaitList = Array.from({ length: 20 }, (_, index) => {
      const start = new Date(today.getTime() + index * 5 * 60 * 1000); // Increment start time by 5 minutes for each appointment
      const duration = Math.floor(Math.random() * 11 + 20) * 60 * 1000; // Random duration between 20 and 30 minutes
      return {
        barber: barber._id,
        location: location._id,
        client: client._id,
        date: start,
        duration: duration,
        morning: true,
        afternoon: false,
        night: false,
      };
    });
    await db.collection('waitlist').insertMany(mockWaitList);
    const mockFind = jest.fn(() => ({
      populate: jest.fn().mockResolvedValue(mockWaitList), // Resolve with expectedAppointments
    }));

    jest.spyOn(WaitList, 'find').mockImplementation(mockFind);

    const mockDeleteOne = jest.fn(async (waitingListClient) => ({
      deleteOne: await db.collection('waitlist').deleteOne({ _id: waitingListClient._id }), // Resolve with expectedAppointments
    }));
    jest.spyOn(WaitList, 'deleteOne').mockImplementation(mockDeleteOne);


    await findWaitListAppointment(barber._id, 'John Doe', location._id, today, mockMessageTranslate, mockSendToManyNotification);
    expect(mockMessageTranslate).toHaveBeenCalledTimes(mockWaitList.length);
    expect(mockSendToManyNotification).toHaveBeenCalledTimes(mockWaitList.length);
    expect(WaitList.deleteOne).toHaveBeenCalledTimes(mockWaitList.length);

  })
  it('should find waiting list clients and send notifications', async () => {
    const mockWaitList = Array.from({ length: 30 }, (_, index) => {
      const start = new Date(today.getTime() + index * 5 * 60 * 1000); // Increment start time by 5 minutes for each appointment
      const duration = Math.floor(Math.random() * 11 + 20) * 60 * 1000; // Random duration between 20 and 30 minutes
      return {
        barber: barber._id,
        location: location._id,
        client: client._id,
        date: start,
        duration: duration,
        morning: true,
        afternoon: false,
        night: false,
      };
    });
    await db.collection('waitlist').insertMany(mockWaitList);
    const mockFind = jest.fn(() => ({
      populate: jest.fn().mockResolvedValue(mockWaitList), // Resolve with expectedAppointments
    }));

    jest.spyOn(WaitList, 'find').mockImplementation(mockFind);

    const mockDeleteOne = jest.fn(async (waitingListClient) => ({
      deleteOne: await db.collection('waitlist').deleteOne({ _id: waitingListClient._id }), // Resolve with expectedAppointments
    }));
    jest.spyOn(WaitList, 'deleteOne').mockImplementation(mockDeleteOne);


    await findWaitListAppointment(barber._id, 'John Doe', location._id, today, mockMessageTranslate, mockSendToManyNotification);
    expect(mockMessageTranslate).toHaveBeenCalledTimes(mockWaitList.length);
    expect(mockSendToManyNotification).toHaveBeenCalledTimes(mockWaitList.length);
    expect(WaitList.deleteOne).toHaveBeenCalledTimes(mockWaitList.length);

  })
});
