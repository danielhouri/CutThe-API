const { getTotalBookedHours } = require('../tools');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

jest.mock('../models/Slot');
jest.mock('../models/Appointment');

describe('getTotalBookedHours', () => {
  

  it('should return the total booked and slot hours for a specific barber', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfLastDay = new Date(weekAgo);
    endOfLastDay.setHours(23, 59, 59, 999);

    const mockAppointmentsToday = [
      {
        _id: null,
        bookedHours: 2,
      },
    ];

    const mockAppointmentsPastWeek = [
      {
        _id: null,
        bookedHours: 10,
      },
    ];

    const mockSlotsToday = [
      {
        _id: null,
        slotHours: 8,
      },
    ];

    const mockSlotsPastWeek = [
      {
        _id: null,
        slotHours: 40,
      },
    ];

    Appointment.aggregate.mockResolvedValueOnce(mockAppointmentsToday).mockResolvedValueOnce(mockAppointmentsPastWeek);
    Slot.aggregate.mockResolvedValueOnce(mockSlotsToday).mockResolvedValueOnce(mockSlotsPastWeek);

    const result = await getTotalBookedHours(barberId);    
    expect(result).toEqual({
      bookedHoursToday: 2,
      bookedHoursPastWeek: 10,
      slotHoursToday: 8,
      slotHoursPastWeek: 40,
    });
  });
  it('should return the total booked and slot hours for another specific barber', async () => {
    const barberId = '987654321'; // Replace with the actual barber ID
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
  
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfLastDay = new Date(weekAgo);
    endOfLastDay.setHours(23, 59, 59, 999);
  
    const mockAppointmentsToday = [
      {
        _id: null,
        bookedHours: 5,
      },
    ];
  
    const mockAppointmentsPastWeek = [
      {
        _id: null,
        bookedHours: 20,
      },
    ];
  
    const mockSlotsToday = [
      {
        _id: null,
        slotHours: 12,
      },
    ];
  
    const mockSlotsPastWeek = [
      {
        _id: null,
        slotHours: 35,
      },
    ];
  
    Appointment.aggregate.mockResolvedValueOnce(mockAppointmentsToday).mockResolvedValueOnce(mockAppointmentsPastWeek);
    Slot.aggregate.mockResolvedValueOnce(mockSlotsToday).mockResolvedValueOnce(mockSlotsPastWeek);
  
    const result = await getTotalBookedHours(barberId);    
    expect(result).toEqual({
      bookedHoursToday: 5,
      bookedHoursPastWeek: 20,
      slotHoursToday: 12,
      slotHoursPastWeek: 35,
    });
  });
  it('should return the total booked and slot hours for a third specific barber', async () => {
    const barberId = '555555555'; // Replace with the actual barber ID
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
  
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfLastDay = new Date(weekAgo);
    endOfLastDay.setHours(23, 59, 59, 999);
  
    const mockAppointmentsToday = [
      {
        _id: null,
        bookedHours: 3,
      },
    ];
  
    const mockAppointmentsPastWeek = [
      {
        _id: null,
        bookedHours: 15,
      },
    ];
  
    const mockSlotsToday = [
      {
        _id: null,
        slotHours: 10,
      },
    ];
  
    const mockSlotsPastWeek = [
      {
        _id: null,
        slotHours: 30,
      },
    ];
  
    Appointment.aggregate.mockResolvedValueOnce(mockAppointmentsToday).mockResolvedValueOnce(mockAppointmentsPastWeek);
    Slot.aggregate.mockResolvedValueOnce(mockSlotsToday).mockResolvedValueOnce(mockSlotsPastWeek);
  
    const result = await getTotalBookedHours(barberId);    
    expect(result).toEqual({
      bookedHoursToday: 3,
      bookedHoursPastWeek: 15,
      slotHoursToday: 10,
      slotHoursPastWeek: 30,
    });
  });
  it('should return the total booked and slot hours for a fourth specific barber', async () => {
    const barberId = '999999999'; // Replace with the actual barber ID
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
  
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfLastDay = new Date(weekAgo);
    endOfLastDay.setHours(23, 59, 59, 999);
  
    const mockAppointmentsToday = [
      {
        _id: null,
        bookedHours: 1,
      },
    ];
  
    const mockAppointmentsPastWeek = [
      {
        _id: null,
        bookedHours: 8,
      },
    ];
  
    const mockSlotsToday = [
      {
        _id: null,
        slotHours: 5,
      },
    ];
  
    const mockSlotsPastWeek = [
      {
        _id: null,
        slotHours: 20,
      },
    ];
  
    Appointment.aggregate.mockResolvedValueOnce(mockAppointmentsToday).mockResolvedValueOnce(mockAppointmentsPastWeek);
    Slot.aggregate.mockResolvedValueOnce(mockSlotsToday).mockResolvedValueOnce(mockSlotsPastWeek);
  
    const result = await getTotalBookedHours(barberId);    
    expect(result).toEqual({
      bookedHoursToday: 1,
      bookedHoursPastWeek: 8,
      slotHoursToday: 5,
      slotHoursPastWeek: 20,
    });
  });
  
});
