const { messageTranslate } = require('../tools');

describe('messageTranslate', () => {
    it('should translate message code and payload into a specific language (Hebrew)', () => {
      const code = 4;
      const name = 'John Doe';
      const payload = {
        date: '2023-10-10',
        time: '10:30',
      };
      const language = 'he';
  
      const expected = {
        title: 'תור חדש',
        body: 'נקבע תור חדש עם John Doe בתאריך 2023-10-10 בשעה 10:30.',
      };
  
      const result = messageTranslate(code, name, payload, language);
  
      expect(result).toEqual(expected);
    });
  
    it('should translate message code and payload into a specific language (English)', () => {
      const code = 0;
      const name = 'Jane Smith';
      const payload = {
        date: '2023-10-07',
        time: '14:00',
      };
      const language = 'en';
  
      const expected = {
        title: 'Appointment Cancellation',
        body: 'The appointment scheduled with Jane Smith on 2023-10-07 at 14:00 has been canceled.',
      };
  
      const result = messageTranslate(code, name, payload, language);
  
      expect(result).toEqual(expected);
    });
  it('should return the correct translation for code 1 (Edit appointment)', () => {
    const code = 1;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'en';
    const expected = {
      title: 'Appointment Update',
      body: 'Your appointment with John Doe on 2023-10-01 at 10:00 AM has been updated.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });

  it('should return the correct translation for code 2 (Free Slot)', () => {
    const code = 2;
    const name = 'John Doe';
    const payload = { date: '2023-10-01' };
    const language = 'en';
    const expected = {
      title: 'Available Slot',
      body: 'You requested to be notified if a slot becomes available on 2023-10-01 with John Doe. Feel free to log in to the application to reschedule your appointment.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });

  it('should return the correct translation for code 5 (Appointment Reminder)', () => {
    const code = 5;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'en';
    const expected = {
      title: 'Appointment Reminder',
      body: 'This is a reminder for your appointment scheduled with John Doe on 2023-10-01 at 10:00 AM.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });
  it('should return the correct translation for code 1 (Edit appointment) in Hebrew', () => {
    const code = 1;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'he';
    const expected = {
      title: 'עדכון תור',
      body: 'עודכן התור שנקבע לך עם John Doe בתאריך 2023-10-01 לשעה 10:00 AM.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });

  it('should return the correct translation for code 2 (Free Slot) in Hebrew', () => {
    const code = 2;
    const name = 'John Doe';
    const payload = { date: '2023-10-01' };
    const language = 'he';
    const expected = {
      title: 'תור פנוי',
      body: 'ביקשת שנזכיר לך אם מתפנה תור לתאריך 2023-10-01 עם John Doe, מוזמן להיכנס לאפליקציה לקבוע תור מחדש.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });

  it('should return the correct translation for code 5 (Appointment Reminder) in Hebrew', () => {
    const code = 5;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'he';
    const expected = {
      title: 'תזכורת לתור',
      body: 'זוהי תזכורת עבור תור שנקבע עבורך עם John Doe בתאריך 2023-10-01 ובשעה 10:00 AM.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });
  it('should return the correct translation for code 4 (New Appointment) in English', () => {
    const code = 4;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'en';
    const expected = {
      title: 'New Appointment',
      body: 'A new appointment has been scheduled with John Doe on 2023-10-01 at 10:00 AM.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });
  it('should return the correct translation for code 0 (Cancel appointment) in Hebrew', () => {
    const code = 0;
    const name = 'John Doe';
    const payload = { date: '2023-10-01', time: '10:00 AM' };
    const language = 'he';
    const expected = {
      title: 'ביטול תור',
      body: 'התור שנקבע עם John Doe בתאריך 2023-10-01 בשעה 10:00 AM בוטל.'
    };

    const result = messageTranslate(code, name, payload, language);
    expect(result).toEqual(expected);
  });
});