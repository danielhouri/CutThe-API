const { getNumberOfCancelledAppointments } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNumberOfCancelledAppointments', () => {
  it('should return the number of cancelled appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 5;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 7)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 7;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 9)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 9;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 11)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 11;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 13)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 13;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 15)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 15;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of cancelled appointments for a specific barber on the current day (mockAppointmentCount = 0)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockAppointmentCount = 0;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCancelledAppointments(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
});
