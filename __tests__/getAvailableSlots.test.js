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


    const mockSlots = [
      {
        start_time: moment().startOf('day').toDate(),
        end_time: moment().endOf('day').toDate(),
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue([]);

    const result = await getAvailableSlots();

    expect(result).toEqual([
      {
        start_time: mockSlots[0].start_time,
        end_time: mockSlots[0].end_time,
        type: 'available4',
      },
    ]);
  });
  it('should return available time slots when there are appointments', async () => {
    // Set the date string
    const dateString = '10/05/2023';
    // Create a Moment.js object using the specified format

    const mockSlots = [
      {
        start_time: '2023-07-31T21:00:00.000+00:00',
        end_time: '2023-07-31T23:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T23:00:00.000+00:00',
        end_time: '2023-08-01T20:59:00.000+00:00',
      },
    ];


    const mockAppointments = [
      {
        start_time: '2023-07-31T22:00:00.000+00:00',
        end_time: '2023-07-31T22:10:00.000+00:00',
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

    const result = await getAvailableSlots('a', 'b');
    expect(result).toEqual([
      {
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
        type: 'available8',
      },
      {
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[0].end_time,
        type: 'available3',
      },
      {
        start_time: mockSlots[1].start_time,
        end_time: mockSlots[1].end_time,
        type: 'available4',
      },
    ]);
  });

  it('should return available time slots when there are appointments', async () => {
    const mockSlots = [
      {
        start_time: '2023-07-31T21:00:00.000+00:00',
        end_time: '2023-07-31T23:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T23:00:00.000+00:00',
        end_time: '2023-08-01T20:59:00.000+00:00',
      },
    ];

    const mockAppointments = [
      {
        start_time: '2023-07-31T22:00:00.000+00:00',
        end_time: '2023-07-31T22:10:00.000+00:00',
      },
      {
        start_time: '2023-08-01T00:00:00.000+00:00',
        end_time: '2023-08-01T01:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T10:00:00.000+00:00',
        end_time: '2023-08-01T11:00:00.000+00:00',
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

    const result = await getAvailableSlots('a', 'b');

    const expected = [
      expect.objectContaining({
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[0].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[1].start_time,
        end_time: mockAppointments[1].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[1].end_time,
        end_time: mockAppointments[2].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[2].end_time,
        end_time: mockSlots[1].end_time,
      }),
    ];

    expect(result).toEqual(expected);
    expect(result.length).toBe(expected.length);
  });

  it('should return available time slots when there are appointments (multiple slots and appointments)', async () => {
    const mockSlots = [
      {
        start_time: '2023-07-31T10:00:00.000+00:00',
        end_time: '2023-07-31T12:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T14:00:00.000+00:00',
        end_time: '2023-07-31T16:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T18:00:00.000+00:00',
        end_time: '2023-07-31T20:00:00.000+00:00',
      },
    ];

    const mockAppointments = [
      {
        start_time: '2023-07-31T11:00:00.000+00:00',
        end_time: '2023-07-31T11:30:00.000+00:00',
      },
      {
        start_time: '2023-07-31T15:00:00.000+00:00',
        end_time: '2023-07-31T15:30:00.000+00:00',
      },
      {
        start_time: '2023-07-31T19:00:00.000+00:00',
        end_time: '2023-07-31T19:30:00.000+00:00',
      },
      {
        start_time: '2023-07-31T19:30:00.000+00:00',
        end_time: '2023-07-31T20:00:00.000+00:00',
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

    const result = await getAvailableSlots('a', 'b');

    const expected = [
      expect.objectContaining({
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[0].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[1].start_time,
        end_time: mockAppointments[1].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[1].end_time,
        end_time: mockSlots[1].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[2].start_time,
        end_time: mockAppointments[2].start_time,
      }),
    ];
    expect(result).toEqual(expected);
    expect(result.length).toBe(expected.length);
  });

  it('should return available time slots when there are appointments', async () => {
    const mockSlots = [
      {
        start_time: '2023-07-31T21:00:00.000+00:00',
        end_time: '2023-07-31T23:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T23:00:00.000+00:00',
        end_time: '2023-08-01T20:59:00.000+00:00',
      },
      {
        start_time: '2023-08-02T10:00:00.000+00:00',
        end_time: '2023-08-02T11:00:00.000+00:00',
      },
    ];

    const mockAppointments = [
      {
        start_time: '2023-07-31T22:00:00.000+00:00',
        end_time: '2023-07-31T22:10:00.000+00:00',
      },
      {
        start_time: '2023-08-01T00:00:00.000+00:00',
        end_time: '2023-08-01T01:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T10:00:00.000+00:00',
        end_time: '2023-08-01T11:00:00.000+00:00',
      },
      {
        start_time: '2023-08-02T09:00:00.000+00:00',
        end_time: '2023-08-02T09:30:00.000+00:00',
      },
      {
        start_time: '2023-08-02T12:00:00.000+00:00',
        end_time: '2023-08-02T13:00:00.000+00:00',
      },
    ];

    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

    const result = await getAvailableSlots('a', 'b');

    const expected = [
      expect.objectContaining({
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[0].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[1].start_time,
        end_time: mockAppointments[1].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[1].end_time,
        end_time: mockAppointments[2].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[2].end_time,
        end_time: mockSlots[1].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[2].start_time,
        end_time: mockSlots[2].end_time,
      }),
    ];
    expect(result).toEqual(expected);
    expect(result.length).toBe(expected.length);
  });

  it('should return available time slots when there are appointments', async () => {
    const mockSlots = [
      {
        start_time: '2023-07-31T21:00:00.000+00:00',
        end_time: '2023-07-31T22:00:00.000+00:00',
      },
      {
        start_time: '2023-07-31T22:00:00.000+00:00',
        end_time: '2023-07-31T23:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T09:00:00.000+00:00',
        end_time: '2023-08-01T10:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T10:00:00.000+00:00',
        end_time: '2023-08-01T11:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T14:00:00.000+00:00',
        end_time: '2023-08-01T15:00:00.000+00:00',
      },
      {
        start_time: '2023-08-01T16:00:00.000+00:00',
        end_time: '2023-08-01T17:00:00.000+00:00',
      },
    ];
  
    const mockAppointments = [
      {
        start_time: '2023-07-31T21:30:00.000+00:00',
        end_time: '2023-07-31T21:45:00.000+00:00',
      },
      {
        start_time: '2023-07-31T22:30:00.000+00:00',
        end_time: '2023-07-31T22:45:00.000+00:00',
      },
      {
        start_time: '2023-08-01T09:30:00.000+00:00',
        end_time: '2023-08-01T09:45:00.000+00:00',
      },
      {
        start_time: '2023-08-01T10:30:00.000+00:00',
        end_time: '2023-08-01T10:45:00.000+00:00',
      },
      {
        start_time: '2023-08-01T14:30:00.000+00:00',
        end_time: '2023-08-01T14:45:00.000+00:00',
      },
    ];
  
    Slot.find = jest.fn().mockResolvedValue(mockSlots);
    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);
  
    const result = await getAvailableSlots('a', 'b');
  
    const expected = [
      expect.objectContaining({
        start_time: mockSlots[0].start_time,
        end_time: mockAppointments[0].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[0].end_time,
        end_time: mockSlots[0].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[1].start_time,
        end_time: mockAppointments[1].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[1].end_time,
        end_time: mockSlots[1].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[2].start_time,
        end_time: mockAppointments[2].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[2].end_time,
        end_time: mockSlots[2].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[3].start_time,
        end_time: mockAppointments[3].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[3].end_time,
        end_time: mockSlots[3].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[4].start_time,
        end_time: mockAppointments[4].start_time,
      }),
      expect.objectContaining({
        start_time: mockAppointments[4].end_time,
        end_time: mockSlots[4].end_time,
      }),
      expect.objectContaining({
        start_time: mockSlots[5].start_time,
        end_time: mockSlots[5].end_time,
      }),
    ];
  
    expect(result).toEqual(expected);
    expect(result.length).toBe(expected.length);
  });

  it('should return available time slots when there are appointments', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-01T10:00:00.000+00:00',
      end_time: '2023-10-01T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T13:00:00.000+00:00',
      end_time: '2023-10-02T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:00:00.000+00:00',
      end_time: '2023-10-03T10:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T15:00:00.000+00:00',
      end_time: '2023-10-03T16:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T11:00:00.000+00:00',
      end_time: '2023-10-04T12:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T08:45:00.000+00:00',
    },
    {
      start_time: '2023-10-01T10:30:00.000+00:00',
      end_time: '2023-10-01T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-02T13:30:00.000+00:00',
      end_time: '2023-10-02T13:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:30:00.000+00:00',
      end_time: '2023-10-03T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T15:30:00.000+00:00',
      end_time: '2023-10-03T15:45:00.000+00:00',
    },
    {
      start_time: '2023-10-04T11:30:00.000+00:00',
      end_time: '2023-10-04T11:45:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');

  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[0].end_time,
      end_time: mockSlots[0].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[4].end_time,
      end_time: mockSlots[4].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[5].start_time,
      end_time: mockAppointments[5].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[5].end_time,
      end_time: mockSlots[5].end_time,
    }),
  ];

  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-01T10:00:00.000+00:00',
      end_time: '2023-10-01T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T13:00:00.000+00:00',
      end_time: '2023-10-02T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:00:00.000+00:00',
      end_time: '2023-10-03T10:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T15:00:00.000+00:00',
      end_time: '2023-10-03T16:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T11:00:00.000+00:00',
      end_time: '2023-10-04T12:00:00.000+00:00',
    },
    {
      start_time: '2023-10-05T14:00:00.000+00:00',
      end_time: '2023-10-05T15:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T08:45:00.000+00:00',
    },
    {
      start_time: '2023-10-01T10:30:00.000+00:00',
      end_time: '2023-10-01T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-02T13:30:00.000+00:00',
      end_time: '2023-10-02T13:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:30:00.000+00:00',
      end_time: '2023-10-03T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T15:30:00.000+00:00',
      end_time: '2023-10-03T15:45:00.000+00:00',
    },
    {
      start_time: '2023-10-04T11:30:00.000+00:00',
      end_time: '2023-10-04T11:45:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');

  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[0].end_time,
      end_time: mockSlots[0].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[4].end_time,
      end_time: mockSlots[4].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[5].start_time,
      end_time: mockAppointments[5].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[5].end_time,
      end_time: mockSlots[5].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[6].start_time,
      end_time: mockSlots[6].end_time,
    }),
  ];

  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:00:00.000+00:00',
      end_time: '2023-10-02T15:15:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:00:00.000+00:00',
      end_time: '2023-10-03T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T13:00:00.000+00:00',
      end_time: '2023-10-04T14:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T09:00:00.000+00:00',
      end_time: '2023-10-05T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-06T10:00:00.000+00:00',
      end_time: '2023-10-06T12:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T11:15:00.000+00:00',
      end_time: '2023-10-02T11:30:00.000+00:00',
    },
    {
      start_time: '2023-10-02T14:00:00.000+00:00',
      end_time: '2023-10-02T15:15:00.000+00:00',
    },
    {
      start_time: '2023-10-03T09:00:00.000+00:00',
      end_time: '2023-10-03T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T13:00:00.000+00:00',
      end_time: '2023-10-04T14:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T09:00:00.000+00:00',
      end_time: '2023-10-05T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-06T10:30:00.000+00:00',
      end_time: '2023-10-06T11:30:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[5].start_time,
      end_time: mockAppointments[6].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[6].end_time,
      end_time: mockSlots[5].end_time,
    }),
  ];
  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T12:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:00:00.000+00:00',
      end_time: '2023-10-03T15:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:00:00.000+00:00',
      end_time: '2023-10-04T10:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T11:00:00.000+00:00',
      end_time: '2023-10-05T12:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T14:00:00.000+00:00',
      end_time: '2023-10-05T15:15:00.000+00:00',
    },
    {
      start_time: '2023-10-05T16:00:00.000+00:00',
      end_time: '2023-10-05T17:30:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T11:00:00.000+00:00',
      end_time: '2023-10-02T11:30:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:30:00.000+00:00',
      end_time: '2023-10-03T14:45:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:15:00.000+00:00',
      end_time: '2023-10-04T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-05T11:30:00.000+00:00',
      end_time: '2023-10-05T12:00:00.000+00:00',
    },
    {
      start_time: '2023-10-05T14:30:00.000+00:00',
      end_time: '2023-10-05T15:00:00.000+00:00',
    },
    {
      start_time: '2023-10-05T16:15:00.000+00:00',
      end_time: '2023-10-05T17:15:00.000+00:00',
    },
  ];
  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[4].end_time,
      end_time: mockSlots[4].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[5].start_time,
      end_time: mockAppointments[5].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[5].end_time,
      end_time: mockSlots[5].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[6].start_time,
      end_time: mockAppointments[6].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[6].end_time,
      end_time: mockSlots[6].end_time,
    }),
  ];
  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:30:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:00:00.000+00:00',
      end_time: '2023-10-02T11:15:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:30:00.000+00:00',
      end_time: '2023-10-03T14:30:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:00:00.000+00:00',
      end_time: '2023-10-04T10:00:00.000+00:00',
    },
    {
      start_time: '2023-10-05T11:30:00.000+00:00',
      end_time: '2023-10-05T12:45:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:15:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:45:00.000+00:00',
      end_time: '2023-10-03T14:15:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:15:00.000+00:00',
      end_time: '2023-10-04T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-05T12:00:00.000+00:00',
      end_time: '2023-10-05T12:30:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[0].end_time,
      end_time: mockSlots[0].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[4].end_time,
      end_time: mockSlots[4].end_time,
    }),
  ];

  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:30:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:00:00.000+00:00',
      end_time: '2023-10-02T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:00:00.000+00:00',
      end_time: '2023-10-03T14:15:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:30:00.000+00:00',
      end_time: '2023-10-04T10:30:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:30:00.000+00:00',
      end_time: '2023-10-03T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:45:00.000+00:00',
      end_time: '2023-10-04T10:15:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[0].end_time,
      end_time: mockSlots[0].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
  ];

  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:30:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:00:00.000+00:00',
      end_time: '2023-10-02T11:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:00:00.000+00:00',
      end_time: '2023-10-03T14:15:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:30:00.000+00:00',
      end_time: '2023-10-04T10:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T11:00:00.000+00:00',
      end_time: '2023-10-05T12:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T10:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:30:00.000+00:00',
      end_time: '2023-10-03T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:45:00.000+00:00',
      end_time: '2023-10-04T10:15:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[0].end_time,
      end_time: mockSlots[0].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockSlots[4].end_time,
    }),
  ];

  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T11:30:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:00:00.000+00:00',
      end_time: '2023-10-03T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:00:00.000+00:00',
      end_time: '2023-10-04T10:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:45:00.000+00:00',
      end_time: '2023-10-02T11:15:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:15:00.000+00:00',
      end_time: '2023-10-03T13:45:00.000+00:00',
    },
    {
      start_time: '2023-10-03T14:15:00.000+00:00',
      end_time: '2023-10-03T14:45:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:30:00.000+00:00',
      end_time: '2023-10-04T09:45:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[4].end_time,
      end_time: mockSlots[3].end_time,
    }),
  ];
  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-01T08:00:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-02T10:30:00.000+00:00',
      end_time: '2023-10-02T11:30:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:00:00.000+00:00',
      end_time: '2023-10-03T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:00:00.000+00:00',
      end_time: '2023-10-04T10:00:00.000+00:00',
    },
    {
      start_time: '2023-10-05T14:30:00.000+00:00',
      end_time: '2023-10-05T15:30:00.000+00:00',
    },
    {
      start_time: '2023-10-05T16:00:00.000+00:00',
      end_time: '2023-10-05T17:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-01T08:30:00.000+00:00',
      end_time: '2023-10-01T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-03T13:15:00.000+00:00',
      end_time: '2023-10-03T13:45:00.000+00:00',
    },
    {
      start_time: '2023-10-04T09:30:00.000+00:00',
      end_time: '2023-10-04T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-05T14:45:00.000+00:00',
      end_time: '2023-10-05T15:15:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[2].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[2].end_time,
      end_time: mockSlots[3].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[4].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[4].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[5].start_time,
      end_time: mockSlots[5].end_time,
    }),
  ];
  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

it('should return available time slots when there are appointments (with different hours and durations)', async () => {
  const mockSlots = [
    {
      start_time: '2023-10-07T08:00:00.000+00:00',
      end_time: '2023-10-07T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-08T10:30:00.000+00:00',
      end_time: '2023-10-08T11:30:00.000+00:00',
    },
    {
      start_time: '2023-10-09T13:00:00.000+00:00',
      end_time: '2023-10-09T14:00:00.000+00:00',
    },
    {
      start_time: '2023-10-10T09:00:00.000+00:00',
      end_time: '2023-10-10T10:00:00.000+00:00',
    },
  ];

  const mockAppointments = [
    {
      start_time: '2023-10-07T08:30:00.000+00:00',
      end_time: '2023-10-07T09:00:00.000+00:00',
    },
    {
      start_time: '2023-10-08T10:45:00.000+00:00',
      end_time: '2023-10-08T11:15:00.000+00:00',
    },
    {
      start_time: '2023-10-08T11:30:00.000+00:00',
      end_time: '2023-10-08T12:00:00.000+00:00',
    },
    {
      start_time: '2023-10-09T13:15:00.000+00:00',
      end_time: '2023-10-09T13:45:00.000+00:00',
    },
    {
      start_time: '2023-10-10T09:30:00.000+00:00',
      end_time: '2023-10-10T09:45:00.000+00:00',
    },
    {
      start_time: '2023-10-10T09:45:00.000+00:00',
      end_time: '2023-10-10T10:15:00.000+00:00',
    },
  ];

  Slot.find = jest.fn().mockResolvedValue(mockSlots);
  Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

  const result = await getAvailableSlots('a', 'b');
  const expected = [
    expect.objectContaining({
      start_time: mockSlots[0].start_time,
      end_time: mockAppointments[0].start_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[1].start_time,
      end_time: mockAppointments[1].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[1].end_time,
      end_time: mockSlots[1].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[2].start_time,
      end_time: mockAppointments[3].start_time,
    }),
    expect.objectContaining({
      start_time: mockAppointments[3].end_time,
      end_time: mockSlots[2].end_time,
    }),
    expect.objectContaining({
      start_time: mockSlots[3].start_time,
      end_time: mockAppointments[4].start_time,
    }),
    
  ];
  expect(result).toEqual(expected);
  expect(result.length).toBe(expected.length);
});

  it('should return empty array when there are no slots', async () => {

    Slot.find = jest.fn().mockResolvedValue([]);
    Appointment.find = jest.fn().mockResolvedValue([]);

    const result = await getAvailableSlots();

    expect(result).toEqual([]);
  });
});
