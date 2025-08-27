const userAuthController = require('../controller/userAuthController');
const userschema = require('../schema/userschema');
const nodemailer = require('nodemailer');

jest.mock('../schema/userschema', () => ({
  findOne: jest.fn().mockReturnThis(), // Mocking the findOne function
  exec: jest.fn(), // Mocking the exec function
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('userAuthController', () => {
  describe('login', () => {
    it('should successfully log in a user', async () => {
      const userData = { email: 'test@example.com' };
      const user = { _id: 'user_id', name: 'Test User', user_type: 'user', email: 'test@example.com' };
      userschema.exec.mockResolvedValue(user);

      const callback = jest.fn();

      await userAuthController.login(userData, callback);

      expect(callback).toHaveBeenCalledWith({
        success: true,
        statuscode: 200,
        message: 'Logged in successfully !!!', // Update the expected message
        response: {
          email: user.email,
          token: expect.any(String),
          _id: user._id,
        },
      });
    });
  });

});

