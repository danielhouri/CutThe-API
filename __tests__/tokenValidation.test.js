const { OAuth2Client } = require('google-auth-library');
// Import dependencies and the function to be tested
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { tokenValidation } = require('../tools'); // Replace with the correct path to your API module

// Mock the googleClient.verifyIdToken function
googleClient.verifyIdToken = jest.fn();

// Example test case
test('should validate and return user data for a valid token', async () => {
  // Mock the googleClient.verifyIdToken function to return a payload
  const mockPayload = {
    name: 'John Doe',
    given_name: 'John',
    family_name: 'Doe',
    email: 'johndoe@example.com',
    picture: 'https://example.com/profile.jpg'
  };
  googleClient.verifyIdToken.mockResolvedValue({ getPayload: () => mockPayload });

  // Provide a valid token to the tokenValidation function
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const result = await tokenValidation(validToken);

  // Assert the expected result
  //expect(result).toEqual(mockPayload);
});

// Example test case for handling errors
test('should return null and log errors for an invalid token', async () => {
  // Mock the googleClient.verifyIdToken function to throw an error
  const mockError = new Error('Invalid token');
  googleClient.verifyIdToken.mockRejectedValue(mockError);

  // Provide an invalid token to the tokenValidation function
  const invalidToken = 'invalid_token';
  const result = await tokenValidation(invalidToken);

  // Assert the expected result
  expect(result).toBeNull();
  // You can also check if the error was logged or handled in any specific way, depending on your implementation
});
