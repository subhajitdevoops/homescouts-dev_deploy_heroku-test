const adminAuthController = require('../controller/adminAuthController');
const { messages } = require('../helper/constant-messages');

// Mock the userschema module
jest.mock('../schema/userschema', () => ({
  findOne: jest.fn(),
  updateOne: jest.fn(),
}));

// Mock the bcryptjs module
jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
}));

// Mock the jwt module
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// Mock the nodemailer module (assuming it's being used in otpsend)
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('Admin Authentication Controller', () => {
  describe('login', () => {
    it('should generate a token and return success response', async () => {
      // Mock data and expected response
      const data = { email: 'test@example.com' };
      const user = {
        _id: '123456789',
        name: 'Test User',
        user_type: 'admin',
      };
      const token = 'mockedToken';

      // Mocking the findOne function
      require('../schema/userschema').findOne.mockReturnValue(user);

      // Mocking the exec function
      user.exec = jest.fn().mockReturnValue(Promise.resolve(user));

      // Mocking the sign function
      require('jsonwebtoken').sign.mockReturnValue(token);

      // Mocking the callback function
      const callback = jest.fn();

      // Call the function
      await adminAuthController.login(data, callback);

      // Check if the callback was called with the correct response
      expect(callback).toHaveBeenCalledWith({
        success: true,
        statuscode: 200,
        message: messages.loggedIn,
        response: {
          email: data.email,
          token,
          _id: user._id,
        },
      });
    });
  });
});