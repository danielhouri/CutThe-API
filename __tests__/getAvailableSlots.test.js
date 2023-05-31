const { getAvailableSlots } = require('../tools');
const mongoose = require('mongoose');
const moment = require('moment/moment');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

describe('getAvailableSlots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return available time slots when there are no appointments', async () => {
    const barberId = mongoose.Schema.Types.ObjectId;
    const locationId = mongoose.Schema.Types.ObjectId;

    const mockSlots = [
      {
        _id: mongoose.Schema.Types.ObjectId,
        barber: barberId,
        location: locationId,
        start_time: moment().startOf('day').toDate(),
        end_time: moment().endOf('day').toDate(),
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue([]);

    const result = await getAvailableSlots(barberId, locationId);

    expect(result).toEqual([
      {
        start_time: mockSlots[0].start_time,
        end_time: mockSlots[0].end_time,
        type: 'available4',
      },
    ]);
  });
  it('should return available time slots when there are appointments', async () => {
    const barberId = mongoose.Schema.Types.ObjectId;
    const locationId = mongoose.Schema.Types.ObjectId;
  
    const mockSlots = [
        {
          _id: mongoose.Schema.Types.ObjectId,
          barber: barberId,
          location: locationId,
          start_time: moment().startOf('day').toDate(),
          end_time: moment().startOf('day').add(2, 'hours').toDate(),
        },
        {
          _id: mongoose.Schema.Types.ObjectId,
          barber: barberId,
          location: locationId,
          start_time: moment().startOf('day').add(2, 'hours').toDate(),
          end_time: moment().endOf('day').seconds(0).milliseconds(0).toDate(),
        },
      ];
      
  
    const mockAppointments = [
      {
        _id: mongoose.Schema.Types.ObjectId,
        barber: barberId,
        location: locationId,
        start_time: moment().startOf('day').add(1, 'hour').toDate(),
        end_time: moment().startOf('day').add(2, 'hours').toDate(),
      },
    ];
  
    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);
  
    const result = await getAvailableSlots(barberId, locationId);
    console.log('Result:', result);
    console.log('Expected:', [
      {
        end_time: mockSlots[0].end_time,
        start_time: mockSlots[0].start_time,
        type: 'available2',
      },
      {
        end_time: mockSlots[1].end_time,
        start_time: mockSlots[1].start_time,
        type: 'available3',
      },
    ]);
    expect(result).toEqual([
      {
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
        type: 'available2',
      },
      {
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[1].end_time,
        type: 'available3',
      },
    ]);
  });
  
  

  it('should return empty array when there are no slots', async () => {
    const barberId = mongoose.Schema.Types.ObjectId;
    const locationId = mongoose.Schema.Types.ObjectId;

    Slot.find = jest.fn().mockResolvedValue([]);
    Appointment.find = jest.fn().mockResolvedValue([]);

    const result = await getAvailableSlots(barberId, locationId);

    expect(result).toEqual([]);
  });
});
