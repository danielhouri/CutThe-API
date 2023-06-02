const { getNumberOfCompletedAppointmentsToday } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNumberOfCompletedAppointmentsToday', () => {
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 5;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });



  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 6;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 7;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 8;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 11;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 13;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 15;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of completed appointments for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockAppointmentCount = 0;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfCompletedAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
});