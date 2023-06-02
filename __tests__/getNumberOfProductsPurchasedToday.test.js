const { getNumberOfProductsPurchasedToday } = require('../tools');
const Appointment = require('../models/Appointment');

describe('getNumberOfProductsPurchasedToday', () => {
  it('should return the number of products purchased by clients for a specific barber on the current day', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 10,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });
  it('should return the number of products purchased by clients for a specific barber on the current day (mockProductsCount = 7)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 7,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });

  it('should return the number of products purchased by clients for a specific barber on the current day (mockProductsCount = 9)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 9,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });

  it('should return the number of products purchased by clients for a specific barber on the current day (mockProductsCount = 11)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 11,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });
  it('should return the number of products purchased by clients for a specific barber on the current day (count = 15)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 15,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });

  it('should return the number of products purchased by clients for a specific barber on the current day (count = 17)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 17,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });

  it('should return the number of products purchased by clients for a specific barber on the current day (count = 21)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = [
      {
        _id: null,
        count: 21,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(mockProductsCount[0].count);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });

  it('should return 0 when no products are purchased by clients for a specific barber on the current day (count = 0)', async () => {
    const barberId = '123456789'; // Replace with the actual barber ID

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mockProductsCount = []; // Empty array indicates no products purchased

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockProductsCount);

    const result = await getNumberOfProductsPurchasedToday(barberId);
    expect(result).toEqual(0);

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });
});