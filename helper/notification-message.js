const now = new Date();
const dateTimeString = now.toLocaleString();

const notificationmessage = {
  
    registrationsubject: "Welcome to HomeScouts,Your account registraion is complete!!!!",
    registrationbody:    "We are thrilled to have you on this platform, keep exploring properties, that made for you and search service providers for your living need.",
    
    addpostsubject:    "Your ad is under review",
    addpostbody:"Your ad post is under review.We will notify you once your ad post is live for public", 

    serviceprovidersubject:"Your application to be a service provider is under review",
    serviceproviderbody:"Your application is under review.we will notify you once you got qualified to be a service providor.",

    addlivesubject:"Your Ad is available for audience",
    addlivebody:"Congratulations, your as post is live",

    approveservicesubject:"Your Service Applicatoin is approved",
    approveservicebody:"Congratulations, your are now a service provider.Please visit my services for more info",


    reportsubject:"Thanks for your kind action",
    reportbody:"We are really sorry for your bad experience, we aware that you insist that this piece must not be on this platform. We will inspect the same based on your information.Once again thanks for making it available in our knowledge, togather we will make this a better platform.",
    

    changepasswordsubject:"Accout alert",
    changepasswordbody:"You have changed your password recently on "+dateTimeString,

    otpsubject:"Accout alert",
    otpbody:"You have changed your password recently on new "+dateTimeString,
    
    postrejectsubject:"Your AD got rejected",
    postrejectbody:"We have checked and found that your AD does not following our platform policies.We encourage you to repost with nessosary information.",
    
    servicerejectsubject:"You didn't qualified for the service application",
    servicerejectbody:"We have checked and found that your AD does not following our platform policies.We encourage you to repost with nessosary information.",

    enquirysubject:"Enquiry!!",
    enquirybody:"Our inquiry has been sent to the property owner!!",

  };
  
  module.exports = {notificationmessage};
  