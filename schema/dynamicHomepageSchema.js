const mongoose = require('mongoose');

var DynamicHomePage = new mongoose.Schema({

    step:{type:String },
    approvestatus:{type:Number},
        
    /// Home ///
    home: {
            title:{type:String },     
            description: {type:String},           
            quote: {type:String}, 
            sliderImagepath: [{type:String}],
            seccondaryImagePath: {type:String},    
          },
    /// Feacher ///
    feature :{
                featureImagePath:{type:String},
                featureHeadDescription:{type:String},  
                featureDetails:[{
                      iconPath:{type:String},
                      featureDescription:{type:String},  
                    }],  
              },
    /// Update ///
    update :{
      updateImagePath:[{type:String}],
      updateDetails:[{
        iconPath:{type:String},
        updateDescription:{type:String},  
      }],  
    }, 
    ///Services ///
    services :{
      serviceImagePath:{type:String},
      servicesDescription: [{
        iconPath:{type:String},
        serviceTitle:{type:String}, 
      }],
    },
    /// Testimony ///
    testimony:[{
      testimonyImagePath:{type:String},
      testimonyDescription: {type:String},                        
    }],
    /// Faqs ///                  
      faqs:[{
          Qus:{type:String},
          Ans:{type:String},
      }],
      /// Contact ///                  
      contact:{
        contactDescription: {type:String},  
        contctImagePath:{type:String},
      }
},{
    timestamps: true
});

module.exports = mongoose.model("DynamicHomePage", DynamicHomePage);

