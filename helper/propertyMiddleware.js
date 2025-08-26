// propertyMiddleware.js

const mongoose = require('mongoose');
const cron = require('node-cron');

const preSaveMiddleware = function (next) {
    console.log('Pre-save middleware triggered.');
    console.log("createdAt field is modified.");
    const currentTime = new Date();
    const postTime = this.updatedAt;
    const timeDifference = currentTime - postTime;
    const propertyAgeInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (propertyAgeInDays == 30) {
        console.log("Property age is 30 days");
        this.is_active = false;
        this.admin_approval = "pending";
    } else if (propertyAgeInDays > 30) {
        console.log("Property age is 45 days");
        this.is_active = false;
        this.admin_approval = "pending";
    } else {
        console.log("Property age is less than 30 days.");
    }

    next();
};

const startCronJob = cron.schedule('5 0 * * *', async () => {
    try {
        console.log("Cron job started at " + new Date().toLocaleString());
        const PropertyPost = mongoose.model('PropertyPost');
        const propertiesToDeactivate = await PropertyPost.find();
        propertiesToDeactivate.forEach(async property => {
            const currentTime = new Date();
            const postTime = property.updatedAt;
            const timeDifference = currentTime - postTime;
            const propertyAgeInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            if (propertyAgeInDays == 30) {
                console.log("30");
                property.is_active = false;
                property.admin_approval = "pending";
                await property.save();
                console.log('Properties deactivated successfully.');
            } else {
                const propertiesToDeactivate = await PropertyPost.find({ is_active: false, admin_approval: "pending" });
                propertiesToDeactivate.forEach(async property => {
                    const currentTime = new Date();
                    const postTime = property.updatedAt;
                    const timeDifference = currentTime - postTime;
                    const propertyAgeInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    if (propertyAgeInDays >= 45) {
                        await PropertyPost.findByIdAndRemove(property._id);
                        console.log('Property deleted successfully.');
                    } else {
                        console.log('Properties are less than 30 days old.');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error deactivating properties:', error);
    }
});

module.exports = {
    preSaveMiddleware,
    startCronJob,
};