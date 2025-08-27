const UserStatus = require('../schema/userStatus');

// Function to delete expired statuses
async function deleteExpiredStatuses() {
    try {
        const oneMinuteAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate the timestamp of 1 minute ago

        // Find and delete expired statuses
        const deletedStatuses = await UserStatus.deleteMany({ createdAt: { $lt: oneMinuteAgo } });

        console.log(`${deletedStatuses.deletedCount} expired statuses deleted.`);
    } catch (error) {
        console.error('Error deleting expired statuses:', error);
    }
}
// Export the deleteExpiredStatuses function
module.exports = deleteExpiredStatuses;
