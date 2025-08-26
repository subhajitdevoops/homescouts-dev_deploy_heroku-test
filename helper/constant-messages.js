const messages = {
  
  success: "Successful",
  somethingWentWrong: "something went wrong.",
  startIndexRequired: "Start Index is required.",
  pageLimitRequired: "Page Limit is required.",
  statusRequired: "status is required",
  firstNameRequired: "First name is required.",
  firstNameLength: "First name length should be 2-50 Characters.",
  lastNameRequired: "Last name is required.",
  lastNameLength: "Last name length should be 2-50 Characters.",
  mobileRequired: "Mobile number is required.",
  emailRequired: "Email-Id is required.",
  emailValid: "Must be a valid Email-Id.",
  emailExistandVerify: "We have an existing user with this email-id!!, Please Login",
  emailExistbutnotVerify: "We have an existing user with this email-id. But not verify, Please login to verify",
  emailExistUnverifiedResendOTP: "Your email is already registered but not verified. We have sent a new verification OTP to your mail",
  mobileValid: "Must be a valid mobile number.",
  mobileExist: "Mobile number already registered.",
  passwordRequired: "Password is required.",
  confirmpasswordRequired: "Confirm Password is required.",
  passwordandconfirmpasswordsame:"Password & ConfirmPassword are not same !!",
  passwordValid: "Password length should be 8-16",
  invalidCredential: "Invalid Credentials",
  loggedIn: "Logged in successfully !!!",
  requiredLimitAndIndex:"Please give Index number and limit of item in every page!!!!",

  userIdRequired: "User id is required.",
  userNotFound: "User not exists.",
  userAlreadyExist: "User is already present in our Database.",
  userRegistered: "User is registered successfully.",
 
  adminIdRequired: "admin id is required.",
  adminNotFound: "admin not exists.",
  adminAlreadyExist: "admin is already present in our Database.",
  adminRegistered: "aadmin is registered successfully.",

  tokenRequired: "Token is required.",
  invalidToken: "Token is invalid.",
  linkExpired: "Link has been expired.",
  setPassword: "Password Set Successfully",
  sucessfullyChangePassword: "Password Change Successfully",
  sucessfullyChangeEmail: "Email Change Successfully",
  notChangeEmail: "Email Change unSuccessfull!!",
  notChangePassword: "Password Change unSuccessfull!!",
  oldPasswordAndNewPasswordSame:"Your old password and new password can not be same.",
  PasswordAndConfirmPasswordNotSame:"Confirm password does not match with password.",


  pageIdNotExist: "Page id is not exist.",
  pageNotExist: "This page is not exist",
  profilePhotoRequired: "Profile photo is required.",

  databaseSaveError:"Database Save Error",
  sucessfullySentOtp:"Account created successfully,Please check your mail for temporary password.You can now use this password for any related activity. We recommend to change it for security purpose.",
  adminRegistration:"Admin registration sucessfully!!",
  googleRegistration:"Google registration sucessfull!!",


  errorToSentEmail :"Error to sent email!!",
  errorToSentOtp:"error to sent otp!!",
  emailNotExist:"Email not exist!!",
  emailExistplsverifywithotp:"Your email is already registered.Please verify account: OTP sent to your mail",
  emailExistUnverifiedResendOTP: "Your email is already registered but not verified. We have sent a new verification OTP to your mail",
  afterloginverifywithotp:"Before login please verify account: OTP sent to your mail",


  otpVerified: "Otp verified!!",
  otpNotMatch:"Otp not match!!",
  emailSubjectpasswordSentForRegistration:'Password for New Registration!!',
  emailSubjectOtpSentForRegistration:'OTP verification for New Registration!!',
  emailSubjectOtpSentForResetPassword:'OTP verification for Reset Password!!',
  emailSubjectOtpSentForChangePassword:'OTP verification for Change Password!!',
  emailSubjectOtpSentForRERA:'OTP verification for RERA!!',
  emailSubjectOtpSentForChangeEmail:'OTP verification for Change Email!!',
  emailSubjectOtpSentForChangephone:'OTP verification for Change phone!!',
  //emailHtmlForPasswordChange:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="homescouts/assets/img/logo.JPG" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + result.name + ' ,<br><br> We have received your application for new password. <br><br> Your new password is <strong>' + otpcode + '</strong> <br><br> Please change this password ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2020 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>',
  catchError:"Catch Error!!",
  internalServerError:"Internal server error",
 // registrationhtml:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="https://ik.imagekit.io/homescouts/HomeScouts%20logo.png?updatedAt=1690981399501" alt="HomeScouts logo" title="HomeScouts logo" border="0" width="200" style="height: auto;"/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new registration. <br><br> Your new OTP is <strong>' + otpcode + '</strong> <br><br> Please verify your account  ASAP for security purpose. <br><br> Thank you !!<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>',


 sucessfullySavedDetails:"Sucessfully saved Details",
 sucessfullyCreatedDetails:"Sucessfully Created Details",
 notSucess:"Unsucessfull",


};

module.exports = {messages};
