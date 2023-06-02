const { getNumberOfAppointmentsPastWeek } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNumberOfAppointmentsPastWeek', () => {
  it('should return the number of appointments for a specific barber in the past week', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const mockAppointmentCount = 5;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfAppointmentsPastWeek(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
 
  it('should return the number of appointments for a specific barber in the past week', async () => {
    const barberId = '987654321'; // Replace with the actual barber ID
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const mockAppointmentCount = 3;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfAppointmentsPastWeek(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
  
  it('should return the number of appointments for a specific barber in the past week', async () => {
    const barberId = '555555555'; // Replace with the actual barber ID

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const mockAppointmentCount = 8;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfAppointmentsPastWeek(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
});

  it('should return the number of appointments for a specific barber in the past week', async () => {
    const barberId = '987654321'; // Replace with the actual barber ID

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(weekAgo);
    endOfDay.setHours(23, 59, 59, 999);

    const mockAppointmentCount = 7;

    jest.spyOn(Appointment, 'countDocuments')
      .mockResolvedValueOnce(mockAppointmentCount);

    const result = await getNumberOfAppointmentsPastWeek(barberId);
    expect(result).toEqual(mockAppointmentCount);

    // Restore the original implementation after the test
    Appointment.countDocuments.mockRestore();
  });
    it('should return the number of appointments for a specific barber in the past week', async () => {
      const barberId = '987654321'; // Replace with the actual barber ID
  
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      const endOfDay = new Date(weekAgo);
      endOfDay.setHours(23, 59, 59, 999);
  
      const mockAppointmentCount = 9;
  
      jest.spyOn(Appointment, 'countDocuments')
        .mockResolvedValueOnce(mockAppointmentCount);
  
      const result = await getNumberOfAppointmentsPastWeek(barberId);
      expect(result).toEqual(mockAppointmentCount);
  
      // Restore the original implementation after the test
      Appointment.countDocuments.mockRestore();
    });
      it('should return the number of appointments for a specific barber in the past week', async () => {
        const barberId = '987654321'; // Replace with the actual barber ID
    
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        const endOfDay = new Date(weekAgo);
        endOfDay.setHours(23, 59, 59, 999);
    
        const mockAppointmentCount = 11;
    
        jest.spyOn(Appointment, 'countDocuments')
          .mockResolvedValueOnce(mockAppointmentCount);
    
        const result = await getNumberOfAppointmentsPastWeek(barberId);
        expect(result).toEqual(mockAppointmentCount);
    
        // Restore the original implementation after the test
        Appointment.countDocuments.mockRestore();
      });    
});
