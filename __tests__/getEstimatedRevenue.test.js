const { getEstimatedRevenue } = require('../tools');
const Appointment = require('../models/Appointment');
describe('getEstimatedRevenue', () => {
  it('should return the estimated revenue for a specific barber', async () => {
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

    const mockRevenueToday = [
      {
        _id: null,
        revenue: 150,
      },
    ];

    const mockRevenuePastWeek = [
      {
        _id: null,
        revenue: 800,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockRevenueToday)
      .mockResolvedValueOnce(mockRevenuePastWeek);

    const result = await getEstimatedRevenue(barberId);    
    expect(result).toEqual({
      today: 150,
      pastWeek: 800,
    });

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });


  it('should return the estimated revenue for a specific barber', async () => {
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

    const mockRevenueToday = [
      {
        _id: null,
        revenue: 200,
      },
    ];

    const mockRevenuePastWeek = [
      {
        _id: null,
        revenue: 1200,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockRevenueToday)
      .mockResolvedValueOnce(mockRevenuePastWeek);

    const result = await getEstimatedRevenue(barberId);
    expect(result).toEqual({
      today: 200,
      pastWeek: 1200,
    });

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });
  it('should return the estimated revenue for a specific barber', async () => {
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

    const mockRevenueToday = [
      {
        _id: null,
        revenue: 250,
      },
    ];

    const mockRevenuePastWeek = [
      {
        _id: null,
        revenue: 900,
      },
    ];

    jest.spyOn(Appointment, 'aggregate')
      .mockResolvedValueOnce(mockRevenueToday)
      .mockResolvedValueOnce(mockRevenuePastWeek);

    const result = await getEstimatedRevenue(barberId);
    expect(result).toEqual({
      today: 250,
      pastWeek: 900,
    });

    // Restore the original implementation after the test
    Appointment.aggregate.mockRestore();
  });
  
    it('should return the estimated revenue for a specific barber', async () => {
      const barberId = '789123456'; // Replace with the actual barber ID
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
  
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      const endOfLastDay = new Date(weekAgo);
      endOfLastDay.setHours(23, 59, 59, 999);
  
      const mockRevenueToday = [
        {
          _id: null,
          revenue: 300,
        },
      ];
  
      const mockRevenuePastWeek = [
        {
          _id: null,
          revenue: 1200,
        },
      ];
  
      jest.spyOn(Appointment, 'aggregate')
        .mockResolvedValueOnce(mockRevenueToday)
        .mockResolvedValueOnce(mockRevenuePastWeek);
  
      const result = await getEstimatedRevenue(barberId);
      expect(result).toEqual({
        today: 300,
        pastWeek: 1200,
      });
  
      // Restore the original implementation after the test
      Appointment.aggregate.mockRestore();
    });
      it('should return the estimated revenue for a specific barber', async () => {
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
    
        const mockRevenueToday = [
          {
            _id: null,
            revenue: 500,
          },
        ];
    
        const mockRevenuePastWeek = [
          {
            _id: null,
            revenue: 2000,
          },
        ];
    
        jest.spyOn(Appointment, 'aggregate')
          .mockResolvedValueOnce(mockRevenueToday)
          .mockResolvedValueOnce(mockRevenuePastWeek);
    
        const result = await getEstimatedRevenue(barberId);
        expect(result).toEqual({
          today: 500,
          pastWeek: 2000,
        });
    
        // Restore the original implementation after the test
        Appointment.aggregate.mockRestore();
      });
});
