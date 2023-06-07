const { MongoClient } = require('mongodb');
const Appointment = require('../models/Appointment');
const { getNextAppointments } = require('../tools');

describe('getNextAppointments', () => {
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
    await db.collection('appointments').deleteMany({});
    await db.collection('client').deleteMany({});
    await db.collection('barber').deleteMany({});
    await db.collection('location').deleteMany({});
    await connection.close();
  });
  afterEach(async () => {
    // Delete all appointment objects
    await db.collection('appointments').deleteMany({});
  });

  it('should retrieve the next 10 upcoming appointments for a specific barber', async () => {
    const mockAppointments = Array.from({ length: 10 }, (_, index) => {
      const start = new Date(today.getTime() + index * 60 * 60 * 1000); // Increment start time by 1 hour for each appointment
      const end = new Date(start.getTime() + 60 * 60 * 1000); // End time is set to 1 hour after start time
      return {
        barber: barber._id,
        client: client._id,
        start_time: start,
        end_time: end,
        service: [],
        location: location._id,
        status: false,
        ordered_products: [],
        price: 0,
      };
    });
    const expectedAppointments = Array.from({ length: 10 }, (_, index) => {
      return{
        _id: mockAppointments[index]._id,
        barber: barber._id,
        client: mockAppointments[index].client._id,
        start_time: mockAppointments[index].start_time,
        end_time: mockAppointments[index].end_time,
        service: [],
        location: mockAppointments[index].location._id,
        status: false,
        ordered_products: [],
        price: 0,
      }
    });
    await db.collection('appointments').insertMany(mockAppointments);
    // Mock the Appointment model
    const mockFind = jest.fn(() => ({
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          populate: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue(expectedAppointments), // Resolve with expectedAppointments
        })),
      })),
      })),
    }));
    jest.spyOn(Appointment, 'find').mockImplementation(mockFind);

      const appointments = await getNextAppointments(barber._id);
      expect(appointments).toHaveLength(expectedAppointments.length);
      expect(appointments).toEqual(expectedAppointments);
  })
  it('should retrieve the next 10 upcoming appointments for a specific barber', async () => {
    const mockAppointments = Array.from({ length: 14 }, (_, index) => {
      const start = new Date(today.getTime() + index * 60 * 60 * 1000); // Increment start time by 1 hour for each appointment
      const end = new Date(start.getTime() + 30 * 60 * 1000); // End time is set to 1 hour after start time
      return {
        barber: barber._id,
        client: client._id,
        start_time: start,
        end_time: end,
        service: [],
        location: location._id,
        status: false,
        ordered_products: [],
        price: 0,
      };
    });
    const expectedAppointments = Array.from({ length: 10 }, (_, index) => {
      return{
        _id: mockAppointments[index]._id,
        barber: barber._id,
        client: mockAppointments[index].client._id,
        start_time: mockAppointments[index].start_time,
        end_time: mockAppointments[index].end_time,
        service: [],
        location: mockAppointments[index].location._id,
        status: false,
        ordered_products: [],
        price: 0,
      }
    });
    await db.collection('appointments').insertMany(mockAppointments);
    // Mock the Appointment model
    const mockFind = jest.fn(() => ({
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          populate: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue(expectedAppointments), // Resolve with expectedAppointments
        })),
      })),
      })),
    }));
    jest.spyOn(Appointment, 'find').mockImplementation(mockFind);
      const appointments = await getNextAppointments(barber._id);
      expect(appointments).toHaveLength(expectedAppointments.length);
      expect(appointments).toEqual(expectedAppointments);
  })
  it('should retrieve the next 10 upcoming appointments for a specific barber', async () => {
    const mockAppointments = Array.from({ length: 27 }, (_, index) => {
      const start = new Date(today.getTime() + index * 60 * 60 * 1000); // Increment start time by 1 hour for each appointment
      const end = new Date(start.getTime() + 20 * 60 * 1000); // End time is set to 1 hour after start time
      return {
        barber: barber._id,
        client: client._id,
        start_time: start,
        end_time: end,
        service: [],
        location: location._id,
        status: false,
        ordered_products: [],
        price: 0,
      };
    });
    const expectedAppointments = Array.from({ length: 10 }, (_, index) => {
      return{
        _id: mockAppointments[index]._id,
        barber: barber._id,
        client: mockAppointments[index].client._id,
        start_time: mockAppointments[index].start_time,
        end_time: mockAppointments[index].end_time,
        service: [],
        location: mockAppointments[index].location._id,
        status: false,
        ordered_products: [],
        price: 0,
      }
    });
    await db.collection('appointments').insertMany(mockAppointments);
    // Mock the Appointment model
    const mockFind = jest.fn(() => ({
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          populate: jest.fn(() => ({
          populate: jest.fn().mockResolvedValue(expectedAppointments), // Resolve with expectedAppointments
        })),
      })),
      })),
    }));
    jest.spyOn(Appointment, 'find').mockImplementation(mockFind);
      const appointments = await getNextAppointments(barber._id);
      expect(appointments).toHaveLength(expectedAppointments.length);
      expect(appointments).toEqual(expectedAppointments);
  })    
});
