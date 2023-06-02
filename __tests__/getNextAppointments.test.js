const { getNextAppointments } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNextAppointments', () => {
  it('should retrieve the next 10 upcoming appointments for a specific barber', async () => {
    const barberId = '123456789';

    const today = new Date();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const mockAppointments = [
        { 
          _id: 'appointment1', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location1', name: 'Barber Shop 1' }
        },
        { 
          _id: 'appointment2', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location2', name: 'Barber Shop 2' }
        },
        { 
          _id: 'appointment3', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location3', name: 'Barber Shop 3' }
        },
        { 
          _id: 'appointment4', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location4', name: 'Barber Shop 4' }
        },
        { 
          _id: 'appointment5', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location5', name: 'Barber Shop 5' }
        },
        { 
          _id: 'appointment6', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location6', name: 'Barber Shop 6' }
        },
        { 
          _id: 'appointment7', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location7', name: 'Barber Shop 7' }
        },
        { 
          _id: 'appointment8', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location8', name: 'Barber Shop 8' }
        },
        { 
          _id: 'appointment9', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location9', name: 'Barber Shop 9' }
        },
        { 
          _id: 'appointment10', 
          start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0, 0),
          barber: { _id: 'barber1', name: 'John Doe', profilePicture: 'profile1.jpg' },
          location: { _id: 'location10', name: 'Barber Shop 10' }
        },
      ];
      

      jest.spyOn(Appointment, 'find')
      .mockResolvedValueOnce(mockAppointments);

    const result = await getNextAppointments(barberId);

    expect(Appointment.find).toHaveBeenCalledWith({
      barber: barberId,
      start_time: { $gte: today, $lte: endOfDay },
    });

    expect(result).toEqual(mockAppointments);

    Appointment.find.mockRestore();
  });
});
