const { MongoClient } = require('mongodb');
const Location = require('../models/Location');
const Comment = require('../models/Comment');
const Slot = require('../models/Slot');
const { findClosestBarbers } = require('../tools');


describe('findClosestBarbers', () => {
  let connection;
  let db;
  const barbers = Array.from({ length: 15 }, (_, index) => {
    const name = `John Doe ${index + 1}`;
    return {
        name: name,
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        profilePicture: 'path/to/profile_picture.jpg',
        phone_number: '123456789',
        pay_barber_cash: true,
        pay_barber_credit_card: true,
        clients: [], 
        aboutUs: '609c9d97883b166036f38626',
        messaging_token: ['token1', 'token2'],
        language: 'en',
    };
  });
  const coordinates = [
    [48.8566, 2.3522],         // Paris
    [40.7128, -74.0060],       // New York City
    [51.5074, -0.1278],        // London
    [34.0522, -118.2437],      // Los Angeles
    [41.9028, 12.4964],        // Rome
    [52.5200, 13.4050],        // Berlin
    [40.4168, -3.7038],        // Madrid
    [39.9042, 116.4074],       // Beijing
    [41.0082, 28.9784],        // Istanbul
    [19.0760, 72.8777],        // Mumbai
    [35.6895, 139.6917],       // Tokyo
    [37.7749, -122.4194],      // San Francisco
    [-33.8651, 151.2099],      // Sydney
    [-22.9068, -43.1729],      // Rio de Janeiro
    [-34.6037, -58.3816]       // Buenos Aires
  ];
  
  const locations = Array.from({ length: 15 }, (_, index) => {
    const name = `Example Location ${index + 1}`;
    return {
        name: name,
        address: '123 Street',
        city: 'City',
        country: 'Country',
        coordinates: {
        type: 'Point',
        coordinates: coordinates[index]
        },
        barber: barbers[index]
    };
  });
  const slots = Array.from({ length: 15 }, (_, index) => {
    return {
        barber: barbers[index]._id,
        start_time: new Date(),
        end_time: new Date(),
        location: locations[index]._id,
    };
  });
  const comments = Array.from({ length: 15 }, (_, index) => {
    const text = `vary good ${index + 1}`;
    return {
            barber: barbers[index]._id,
            rating: 5,
            client: index,
            date: new Date(),
            text: text,
    };
  });
  
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    // Insert the mock locations into the collection
    await db.collection('location').insertMany(locations);
    // Insert the mock comments into the collection
    await db.collection('comment').insertMany(comments);
    // Insert the mock slots into the collection
    await db.collection('slot').insertMany(slots);
    // Insert the mock slots into the collection
    await db.collection('barber').insertMany(barbers);
  });

  afterAll(async () => {
    await db.collection('location').deleteMany({});
    await db.collection('comment').deleteMany({});
    await db.collection('slot').deleteMany({});
    await db.collection('barber').deleteMany({});
    await connection.close();
  });

  it('should find the 10 closest barbers with their information', async () => {
    const expectedClosestBarbers = [
        barbers[14]._id,      // Rio de Janeiro
        barbers[13]._id,      // Buenos Aires
        barbers[6]._id,        // Madrid
        barbers[4]._id,       // Beijing
        barbers[8]._id,        // Istanbul
        barbers[0]._id,         // Paris
        barbers[9]._id,       // Tokyo
        barbers[2]._id,        // London
        barbers[5]._id,      // Los Angeles
        barbers[1]._id,        // New York City
      ];
      Location.find = jest.fn(() => ({
        populate: jest.fn().mockResolvedValue(locations), // Resolve with expectedAppointments
      }));
      Comment.find = jest.fn().mockReturnValue(comments);
      Slot.find = jest.fn().mockReturnValue(slots);
      
    // Call the findClosestBarbers function
    const result = await findClosestBarbers('City', 'Country', { latitude: 0, longitude: 0 });
    // Extract the barber property from each result
    const resultBarbers = result.map(results => results.barber._id);
    // Check if the resultBarbers contain the expectedClosestBarbers
    expect(resultBarbers).toEqual(expect.arrayContaining(expectedClosestBarbers));
    // Assert the result length
    expect(result).toHaveLength(expectedClosestBarbers.length); 
  });
});
