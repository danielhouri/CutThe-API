const { OAuth2Client } = require('google-auth-library');
const { tokenValidation } = require('../tools'); // Adjust the path to the tokenValidation function

jest.mock('google-auth-library');

describe('tokenValidation', () => {
  test('should validate token and return user data', async () => {
    const mockedPayload = {
      name: 'John Doe',
      given_name: 'John',
      family_name: 'Doe',
      email: 'johndoe@example.com',
      picture: 'https://example.com/profile.jpg',
    };

    // Mock the verifyIdToken function to return the mocked payload
    const verifyIdTokenMock = jest.fn().mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(mockedPayload),
    });

    OAuth2Client.prototype.verifyIdToken = verifyIdTokenMock;

    // Mocked token for testing
    const token = 'mockedToken';

    // Call the function being tested
    const result = await tokenValidation(token);

    // Assert the expected result
    expect(result).toEqual(mockedPayload);

    // Verify that the verifyIdToken function was called
    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    expect(verifyIdTokenMock).toHaveBeenCalledTimes(1);
  });
  test('should return null for an invalid token', async () => {
    // Mock the verifyIdToken function to throw an error
    const verifyIdTokenMock = jest.fn().mockRejectedValue(new Error('Invalid token'));

    OAuth2Client.prototype.verifyIdToken = verifyIdTokenMock;

    // Mocked token for testing
    const token = 'invalidToken';

    // Call the function being tested
    const result = await tokenValidation(token);

    // Assert the expected result (null)
    expect(result).toBeNull();

    // Verify that the verifyIdToken function was called
    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    expect(verifyIdTokenMock).toHaveBeenCalledTimes(1);
  });
});
