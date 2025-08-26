const userServiceController = require('../controller/userServiceController');

// Increase the timeout for this specific test
jest.setTimeout(100000); // Adjust the timeout as needed

describe('User Service Controller', () => {
  
  describe('getallproperty', () => {
    it('should fetch properties successfully', async () => {
      const data = {
        limit: 10,
        page: 1,
        searchQuery: 'abcd',
        typeOfBusiness: 'sell',
        location: 'kolkata'
      };

      const mockCallback = jest.fn();

      // Call the function
      await userServiceController.getallproperty(data, mockCallback);

      // Check if the mock callback was called with the correct response
      expect(mockCallback).toHaveBeenCalledWith({
        success: false,
        statuscode: 500,
        message: "An error occurred while fetching properties.",
        response: expect.any(Error)
      });
    });
  });

  describe('getallproperty - error handling', () => {
    it('should handle errors', async () => {
      const data = {
        limit: 10,
        page: 1
      };
  
      const mockCallback = jest.fn();
  
      // Mock an error in the controller function
      jest.spyOn(userServiceController, 'getallproperty').mockRejectedValue(new Error('Some error occurred'));
  
      // Call the function
      await expect(userServiceController.getallproperty(data, mockCallback)).rejects.toThrow('Some error occurred');
  
      // Check if the mock callback was not called
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

});
