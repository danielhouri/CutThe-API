const { MongoClient } = require('mongodb');
const Location = require('../models/Location');
const Comment = require('../models/Comment');
const { searchBarber } = require('../tools');


describe('searchBarber', () => {
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
        aboutUs: {
            pictures: [],
        },
        messaging_token: ['token1', 'token2'],
        language: 'en',
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
  
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    // Insert the mock locations into the collection
    await db.collection('location').insertMany(locations);
    // Insert the mock slots into the collection
    await db.collection('barber').insertMany(barbers);
    // Insert the mock comments into the collection
    await db.collection('comment').insertMany(comments);
  });

  afterAll(async () => {
    await db.collection('location').deleteMany({});
    await db.collection('barber').deleteMany({});
    await db.collection('comment').deleteMany({});
    await connection.close();
  });
  

  it('should find the 10 closest barbers with their information', async () => {
    const expectedClosestBarbers = Array.from({ length: 15 }, (_, index) => {
        return barbers[index]._id.toString();
    });
    
      Location.find = jest.fn(() => ({
        select: jest.fn(() => ({
        populate: jest.fn().mockResolvedValue(locations)
        }))
      }));
      Comment.find = jest.fn().mockReturnValue(comments);
    // Call the findClosestBarbers function
    const result = await searchBarber('City', 'Country', { latitude: 0, longitude: 0 },'true','true');
    // Extract the barber property from each result
    const resultBarbers = result.map(results => results.barber._id.toString());

    // Check if the resultBarbers contain the expectedClosestBarbers
    expect(resultBarbers).toEqual(expectedClosestBarbers);
    // Assert the result length
    expect(result).toHaveLength(expectedClosestBarbers.length); 
  });
});
