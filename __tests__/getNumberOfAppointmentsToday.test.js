const { getNumberOfAppointmentsToday } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNumberOfAppointmentsToday', () => {
  it('should return the number of appointments scheduled for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const mockAppointmentCount = 5; // Replace with the desired mock appointment count

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 7)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 7;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 9)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 9;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  // Repeat the pattern for the other 8 test cases with different mock appointment counts

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 10)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 10;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 11)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 11;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 13)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 13;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 14)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 14;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 15)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 15;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 17)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 17;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 21)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 21;

    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));

    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);

    Appointment.countDocuments.mockRestore();
  });

  it('should return the number of appointments scheduled for a specific barber on the current day (mockAppointmentCount = 0)', async () => {
    const barberId = '123456789';
    const mockAppointmentCount = 0;
    jest.spyOn(Appointment, 'countDocuments')
      .mockImplementation(() => Promise.resolve(mockAppointmentCount));
    const result = await getNumberOfAppointmentsToday(barberId);
    expect(result).toEqual(mockAppointmentCount);
    Appointment.countDocuments.mockRestore();
  });
});