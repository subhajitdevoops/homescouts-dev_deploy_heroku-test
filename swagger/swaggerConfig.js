const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HomeScouts API Documentation',
    version: '1.0.0',
    description: 'API documentation for this project (Backend:Node.js)',
  },
  servers: [
    {
      url: 'http://localhost:9000', 
      description: 'Local server',
    },
    {
      url: 'https://homescouts.in/', 
      description: 'Live server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Replace with the path to your API route files
};

const swaggerSpec = swaggerJSDoc(options);

// Add your Swagger specification for the /user/registration endpoint


const userAuth = {
  paths: {
    "/api/user/registration": {
      "post": {
        "summary": "User Registration",
        "tags": ["User"],
        "requestBody": {
          "description": "User registration details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  },
                  "confirmpassword": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "mobilenumber": {
                    "type": "number"
                  },
                  "user_type": {
                    "type": "string"
                  },
                  "termandcondition": {
                    "type": "boolean"
                  }
                },
                "example": {
                  "email": "subhajitchakrabortyofficial+89@gmail.com",
                  "password": "1234567",
                  "confirmpassword": "1234567",
                  "name": "SUBHAJIT CHAKRABORTY",
                  "mobilenumber": 9836926770,
                  "user_type": "business",
                  "termandcondition": true
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful user registration response"
          }
        }
      }
    },
    "/api/user/login": {
      "post": {
        "summary": "User Login",
        "tags": ["User"],
        "requestBody": {
          "description": "User login details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  }
                },
                "example": {
                  "email": "subhajitchakrabortyofficial+1@gmail.com",
                  "password": "1234567"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful login response"
          }
        }
      }
    },
    "/api/user/resetpassword": {
      "post": {
        "summary": "Reset Password",
        "tags": ["User"],
        "requestBody": {
          "description": "Reset password request",
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string"
                  }
                },
                "example": {
                  "email": "pratimachakraborty9433@gmail.com"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password reset request successful"
          }
        }
      }
    },
    "/api/user/resetotpverify": {
      "post": {
        "summary": "Verify Reset OTP",
        "tags": ["User"],
        "requestBody": {
          "description": "Verify reset OTP request",
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "otp": {
                    "type": "string"
                  },
                  "_id": {
                    "type": "string"
                  }
                },
                "example": {
                  "otp": "508222",
                  "_id": "63b95931680b1f20187b735a"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OTP verification successful"
          }
        }
      }
    },
    "/api/user/setpassword": {
      "post": {
        "summary": "Set Password",
        "tags": ["User"],
        "requestBody": {
          "description": "Set password request",
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "password": {
                    "type": "string"
                  },
                  "confirmpassword": {
                    "type": "string"
                  },
                  "_id": {
                    "type": "string"
                  }
                },
                "example": {
                  "password": "1234567",
                  "confirmpassword": "1234567",
                  "_id": "63b95931680b1f20187b735a"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password set successfully"
          }
        }
      }
    },
    "/api/user/registration/otpverify": {
      "post": {
        "summary": "Verify Registration OTP",
        "tags": ["User"],
        "requestBody": {
          "description": "Verify registration OTP request",
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "otp": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  }
                },
                "example": {
                  "otp": "588809",
                  "email": "subhajitchakrabortyofficial+89@gmail.com"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OTP verification successful"
          }
        }
      }
    },              
  },
};


const adminAuth = {
  paths: {
    "/api/admin/login": {
      "post": {
        "summary": "Admin Login",
        "tags": ["Admin"],
        "requestBody": {
          "description": "Admin login credentials",
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  }
                },
                "example": {
                  "email": "subhajitchakrabortyofficial+89@gmail.com",
                  "password": "1234567"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful admin login response"
          }
        }
      }
    },    
    "/api/admin/changepassword": {
      "post": {
        "summary": "Change Admin Password",
        "tags": ["Admin"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Change admin password details",
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "oldpassword": {
                    "type": "string"
                  },
                  "newpassword": {
                    "type": "string"
                  },
                  "confirmpassword": {
                    "type": "string"
                  }
                },
                "example": {
                  "email": "dr.nodeserver@gmail.com",
                  "oldpassword": "12345",
                  "newpassword": "1234567",
                  "confirmpassword": "1234567"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful password change response"
          }
        }
      }
    },    
  },
};


const userServices = {
  paths: {


    '/api/userService/getallproperty': {
      get: {
        summary: 'Get all property',
        tags: ['User Service'],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "required": true,
            "type": "integer"
          },
          {
            "name": "searchQuery",
            "in": "query",
            "description": "Search query",
            "type": "string"
          },
          {
            "name": "typeOfBusiness",
            "in": "query",
            "description": "Type of business",
            "type": "string"
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "required": true,
            "type": "integer"
          },
          {
            "name": "location",
            "in": "query",
            "description": "Location",
            "type": "string"
          },
          {
            "name": "filterdata",
            "in": "query",
            "description": "Filter data",
            "type": "string"
          }
        ],
        responses: {
          '200': {
            description: 'Login successful!!',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    response: {
                      type: 'string',
                    },
                    statuscode: {
                      type: 'number',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/userService/getallproperty2': {
      post: {
        summary: 'Get a property details by property id',
        tags: ['User Service'],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "description": "ID of the property",
            "required": true,
            "type": "string"
          }
        ],
        responses: {
          '200': {
            description: 'Login successful!!',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    response: {
                      type: 'string',
                    },
                    statuscode: {
                      type: 'number',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/userService/postpropertydata": {
  "post": {
    "summary": "Post property data for basic step",
    "tags": ["User Service"],
    "security": [
      {
        "authtoken": []
      }
    ],
    "requestBody": {
      "description": "Post property data",
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "step": {
                "type": "string"
              },
              "basicdetails": {
                "type": "object",
                "properties": {
                  "typeOfBusiness": {
                    "type": "string"
                  },
                  "typeOfProperty": {
                    "type": "string"
                  },
                  "catagory": {
                    "type": "string"
                  },
                  "subCatagory": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "Successful response",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean"
                },
                "response": {
                  "type": "string"
                },
                "statuscode": {
                  "type": "number"
                },
                "message": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
    },
    "/api/userService/postpropertydata2": {
      "post": {
        "summary": "Post property data for location step",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "location": {
                    "type": "object",
                    "properties": {
                      "apartmentAndSocity": {
                        "type": "string"
                      },
                      "houseNumber": {
                        "type": "string"
                      },
                      "locality": {
                        "type": "string"
                      },
                      "subLocality": {
                        "type": "string"
                      },
                      "city": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/postpropertydata3": {
      "post": {
        "summary": "Post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "aboutproperty": {
                    "type": "object",
                    "properties": {
                      "availableFor": {
                        "type": "string"
                      },
                      "roomDetails": {
                        "type": "object",
                        "properties": {
                          "noOfBedRooms": {
                            "type": "integer"
                          },
                          "noOfBathRooms": {
                            "type": "integer"
                          },
                          "noOfBalconies": {
                            "type": "integer"
                          }
                        }
                      },
                      "carpetArea": {
                        "type": "integer"
                      },
                      "areaMessurementUnit": {
                        "type": "string"
                      },
                      "othersRoom": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      },
                      "furnishingType": {
                        "type": "string"
                      },
                      "option": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string"
                            },
                            "count": {
                              "type": "integer"
                            },
                            "isAvilable": {
                              "type": "boolean"
                            }
                          }
                        }
                      },
                      "reservedParking": {
                        "type": "object",
                        "properties": {
                          "CoveredParking": {
                            "type": "object",
                            "properties": {
                              "noOfParking": {
                                "type": "integer"
                              }
                            }
                          },
                          "OpenParking": {
                            "type": "object",
                            "properties": {
                              "noOfParking": {
                                "type": "integer"
                              }
                            }
                          }
                        }
                      },
                      "FloorDetails": {
                        "type": "object",
                        "properties": {
                          "totalNoOfFloor": {
                            "type": "integer"
                          },
                          "whichFloor": {
                            "type": "string"
                          }
                        }
                      },
                      "availability": {
                        "type": "object",
                        "properties": {
                          "status": {
                            "type": "string"
                          },
                          "ageOfProperty": {
                            "type": "string"
                          },
                          "possessionBy": {
                            "type": "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/postpropertydata4": {
      "post": {
        "summary": "Post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "pricinganddetails": {
                    "type": "object",
                    "properties": {
                      "rera_number": {
                        "type": "string"
                      },
                      "ownership": {
                        "type": "string"
                      },
                      "pricingDetails": {
                        "type": "object",
                        "properties": {
                          "expectedPrice": {
                            "type": "number"
                          },
                          "pricePerSqrft": {
                            "type": "number"
                          }
                        }
                      },
                      "allInclusivePrice": {
                        "type": "string"
                      },
                      "taxandGovtChargesExcluded": {
                        "type": "string"
                      },
                      "priceNegotiable": {
                        "type": "string"
                      },
                      "additionalPricingDetails": {
                        "type": "object",
                        "properties": {
                          "Maintenance": {
                            "type": "number"
                          },
                          "BookingPrice": {
                            "type": "number"
                          },
                          "AnnualDuesPayable": {
                            "type": "number"
                          }
                        }
                      },
                      "someHouseRules": {
                        "type": "object",
                        "properties": {
                          "petsAllowed": {
                            "type": "boolean"
                          },
                          "visitorsAllowed": {
                            "type": "boolean"
                          },
                          "smokingAllowed": {
                            "type": "boolean"
                          },
                          "alcoholAllowed": {
                            "type": "boolean"
                          },
                          "partyAllowed": {
                            "type": "boolean"
                          }
                        }
                      },
                      "uniqueDescription": {
                        "type": "string"
                      },
                      "firesaleOrNot": {
                        "type": "boolean"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/postpropertydata5": {
      "post": {
        "summary": "Post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "uploadImages": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "propertyImage": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "isCoverImage": {
                          "type": "boolean"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },    
    "/api/userService/postpropertydata6": {
      "post": {
        "summary": "Post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "pricinganddetails": {
                    "type": "object",
                    "properties": {
                      "rentDetails": {
                        "type": "number"
                      },
                      "securityDepositeScheme": {
                        "type": "string"
                      },
                      "securityDepositeAmmount": {
                        "type": "number"
                      },
                      "noOfMonths": {
                        "type": "number"
                      },
                      "foodDetails": {
                        "type": "string"
                      },
                      "mealTypes": {
                        "type": "string"
                      },
                      "someHouseRules": {
                        "type": "object",
                        "properties": {
                          "petsAllowed": {
                            "type": "boolean"
                          },
                          "visitorsAllowed": {
                            "type": "boolean"
                          },
                          "smokingAllowed": {
                            "type": "boolean"
                          },
                          "alcoholAllowed": {
                            "type": "boolean"
                          },
                          "partyAllowed": {
                            "type": "boolean"
                          }
                        }
                      },
                      "availabilityOfMealOnWeekdays": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      },
                      "availabilityOfMealOnWeekends": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      },
                      "lastEntry": {
                        "type": "string"
                      },
                      "haveAnyOtherRule": {
                        "type": "string"
                      },
                      "uniqueDescription": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/postpropertydata7": {
      "post": {
        "summary": "Post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Post property data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "step": {
                    "type": "string"
                  },
                  "aboutproperty": {
                    "type": "object",
                    "properties": {
                      "roomDetails": {
                        "type": "object",
                        "properties": {
                          "noOfBedRooms": {
                            "type": "integer"
                          },
                          "noOfBathRooms": {
                            "type": "integer"
                          },
                          "noOfBalconies": {
                            "type": "integer"
                          },
                          "roomTypes": {
                            "type": "string"
                          },
                          "howManyPeople": {
                            "type": "integer"
                          }
                        }
                      },
                      "capacityAndAvailability": {
                        "type": "object",
                        "properties": {
                          "noOfBed": {
                            "type": "integer"
                          },
                          "noOfBedsAvailable": {
                            "type": "integer"
                          }
                        }
                      },
                      "attachedBathroom": {
                        "type": "boolean"
                      },
                      "attachedBalcony": {
                        "type": "boolean"
                      },
                      "othersRoom": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      },
                      "furnishingType": {
                        "type": "string"
                      },
                      "option": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string"
                            },
                            "count": {
                              "type": "integer"
                            },
                            "isAvilable": {
                              "type": "boolean"
                            }
                          }
                        }
                      },
                      "reservedParking": {
                        "type": "object",
                        "properties": {
                          "CoveredParking": {
                            "type": "object",
                            "properties": {
                              "noOfParking": {
                                "type": "integer"
                              }
                            }
                          },
                          "OpenParking": {
                            "type": "object",
                            "properties": {
                              "noOfParking": {
                                "type": "integer"
                              }
                            }
                          }
                        }
                      },
                      "FloorDetails": {
                        "type": "object",
                        "properties": {
                          "totalNoOfFloor": {
                            "type": "integer"
                          },
                          "whichFloor": {
                            "type": "string"
                          }
                        }
                      },
                      "availableFor": {
                        "type": "string"
                      },
                      "suitablefor": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },   
    "/api/userService/incompletepostpropertydata": {
      "get": {
        "summary": "Get incomplete property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/discardpostpropertydata": {
      "post": {
        "summary": "Discard post property data",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/getpropertybyuserid": {
      "get": {
        "summary": "Get property by user ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/visitorcounterbyid": {
      "get": {
        "summary": "Get visitor counter by ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "_id",
            "in": "query",
            "description": "ID of the property",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/enquiry": {
      "post": {
        "summary": "Submit an enquiry",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Enquiry details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "senderId": {
                    "type": "integer"
                  },
                  "receiverId": {
                    "type": "string"
                  },
                  "enquiry": {
                    "type": "object",
                    "properties": {
                      "propertyId": {
                        "type": "string"
                      },
                      "name": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "integer"
                      },
                      "message": {
                        "type": "string"
                      },
                      "userType": {
                        "type": "string"
                      },
                      "messagetype": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "response": {
                      "type": "string"
                    },
                    "statuscode": {
                      "type": "number"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/userService/propertysortlist": {
      "post": {
        "summary": "Get sorted property list",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Property sorting details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/propertysortlist2": {
      "get": {
        "summary": "Get sorted property list",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/servicesortlist": {
      "post": {
        "summary": "Get sorted service list",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service sorting details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/servicesortlist2": {
      "get": {
        "summary": "Get sorted service list",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/servicactiveinactive": {
      "post": {
        "summary": "Activate or deactivate a service",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service activation or deactivation",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/propertyactiveinactive": {
      "post": {
        "summary": "Activate or deactivate a property",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Property activation or deactivation",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userservice/getfurnishing": {
      "get": {
        "summary": "Get furnishing details",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    

    "/api/userService/applyforservices": {
      "post": {
        "summary": "Apply for services",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service application details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "service_offering_title": {
                    "type": "string"
                  },
                  "select_your_offering": {
                    "type": "string"
                  },
                  "documents_details": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string"
                        },
                        "documents": {
                          "type": "string"
                        }
                      }
                    }
                  },
                  "add_offering_location": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "snapsort_offering": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/getapplyforservices": {
      "get": {
        "summary": "Get applied services",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/getservicesbyserviceid": {
      "get": {
        "summary": "Get services by service ID",
        "tags": ["User Service"],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "description": "Service ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/serviceslisting": {
      "get": {
        "summary": "Get services listing",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "searchQuery",
            "in": "query",
            "description": "Search query",
            "type": "string"
          },
          {
            "name": "location",
            "in": "query",
            "description": "Location",
            "type": "string"
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "type": "integer"
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/serviceslistingsettings": {
      "get": {
        "summary": "Get services listing settings",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/serviceslistingbyid": {
      "get": {
        "summary": "Get services listing by ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "type": "integer"
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/visitorcounterbyserviceid": {
      "get": {
        "summary": "Get visitor counter by service ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "_id",
            "in": "query",
            "description": "Service ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
    
        
    "/api/userService/chat": {
      "post": {
        "summary": "Send a chat message",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Chat message details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "person_id": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
    "/api/userService/getchatbyuserid": {
      "get": {
        "summary": "Get chat messages by user ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/getchatbychatid": {
      "get": {
        "summary": "Get chat messages by chat ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "chatid",
            "in": "query",
            "description": "Chat ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/blockchatbychatid": {
      "post": {
        "summary": "Block or unblock chat by chat ID",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Chat blocking details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "chatid": {
                    "type": "string"
                  },
                  "is_block": {
                    "type": "boolean"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/createreport": {
      "post": {
        "summary": "Create a report",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Report creation details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "chatId": {
                    "type": "string"
                  },
                  "personId": {
                    "type": "string"
                  },
                  "message": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string"
                      },
                      "text": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },        
       

    "/api/userService/statusupdate": {
      "post": {
        "summary": "Update status",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Update status details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "media": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string"
                        },
                        "link": {
                          "type": "string"
                        }
                      }
                    }
                  },
                  "location": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/getstatusbylocation": {
      "get": {
        "summary": "Get statuses by location",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "location",
            "in": "query",
            "description": "Location",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    

    "/api/userservice/getprofile": {
      "get": {
        "summary": "Get user profile",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/otpsentforchangepassword": {
      "post": {
        "summary": "Send OTP for password change",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Password change details",
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "newpassword": {
                    "type": "string"
                  },
                  "confirmpassword": {
                    "type": "string"
                  },
                  "oldpassword": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/otpverifyforchangepassword": {
      "post": {
        "summary": "Verify OTP and change password",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "OTP verification and password change details",
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "otp": {
                    "type": "string"
                  },
                  "newpassword": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/otpsentforchangeemail": {
      "post": {
        "summary": "Send OTP for changing email",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Email change details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "oldemail": {
                    "type": "string"
                  },
                  "newemail": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },  
    "/api/userService/otpverifyforchangeemail": {
      "post": {
        "summary": "Verify OTP and change email",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "OTP verification and email change details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "otp": {
                    "type": "string"
                  },
                  "newemail": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userservice/updateprofile": {
      "post": {
        "summary": "Update user profile",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Update user profile details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "avatar": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userService/phoneverify": {
      "get": {
        "summary": "Verify phone number",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/api/userservice/phonenumberotpsent": {
      "post": {
        "summary": "Send OTP for changing phone number",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Phone number change details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "userId": {
                    "type": "string"
                  },
                  "route": {
                    "type": "string"
                  },
                  "oldnumber": {
                    "type": "string"
                  },
                  "newnumber": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userservice/phonenumberotpverify": {
      "post": {
        "summary": "Verify OTP and change phone number",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "OTP verification and phone number change details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "userId": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "newnumber": {
                    "type": "string"
                  },
                  "otp": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },                          
    
    
    "/api/userservice/notification": {
      "get": {
        "summary": "Get notifications",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/userservice/notification2": {
      "post": {
        "summary": "Get notifications",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Get notifications by user ID",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    

    "/api/userservice/dynamicfilteroption": {
      "get": {
        "summary": "Get dynamic filter options",
        "tags": ["User Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
    
  },
};


const adminServices = {
  paths: {

    "/api/adminservice/propertysettings": {
      "post": {
        "summary": "Update Property Settings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Property settings update details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "step": {
                    "type": "string",
                    "description": "Step of the property settings update"
                  },
                  "_id": {
                    "type": "string",
                    "description": "ID of the property settings"
                  },
                  "typeOfProperty": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Name of the property type"
                      },
                      "catagory": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "Name of the property category"
                            }
                          }
                        },
                        "description": "Array of property categories"
                      }
                    }
                  },
                  "furnishingDetails": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "type": {
                          "type": "string",
                          "description": "Type of furnishing"
                        },
                        "amenities": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "name": {
                                "type": "string",
                                "description": "Name of the amenity"
                              },
                              "count": {
                                "type": "integer",
                                "description": "Count of the amenity"
                              },
                              "isAvilable": {
                                "type": "boolean",
                                "description": "Availability of the amenity"
                              }
                            }
                          },
                          "description": "Array of amenities"
                        }
                      }
                    },
                    "description": "Array of furnishing details"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/verifyproperty": {
      "post": {
        "summary": "Verify Property",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Property verification details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "ID of the property to be verified"
                  },
                  "is_verified": {
                    "type": "boolean",
                    "description": "Verification status of the property"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
    "/api/adminservice/feature": {
      "post": {
        "summary": "Set Property as Featured",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Property feature details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "ID of the property to be set as featured"
                  },
                  "is_feacher": {
                    "type": "boolean",
                    "description": "Feature status of the property"
                  },
                  "feacher_validity": {
                    "type": "string",
                    "description": "Validity date for the property's feature status"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
    "/api/adminservice/propertysettings": {
      "get": {
        "summary": "Get Property Settings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
   

    "/api/adminservice/addservicesettings": {
      "post": {
        "summary": "Add Service Settings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service settings details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string",
                    "description": "ID of the service settings"
                  },
                  "is_active": {
                    "type": "boolean",
                    "description": "Whether the service setting is active or not"
                  },
                  "name": {
                    "type": "string",
                    "description": "Name of the service"
                  },
                  "serviceIcon": {
                    "type": "string",
                    "description": "Path to the service icon image"
                  },
                  "is_documents_needed": {
                    "type": "boolean",
                    "description": "Whether documents are needed for the service"
                  },
                  "documents_details": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "help_text": {
                          "type": "string",
                          "description": "Help text for the document"
                        },
                        "Guidline": {
                          "type": "string",
                          "description": "Guidelines for uploading the document"
                        }
                      }
                    },
                    "description": "Array of document details"
                  },
                  "admin_approval": {
                    "type": "string",
                    "description": "Admin approval status for the service"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/servicesettings": {
      "get": {
        "summary": "Get Service Settings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/deleteservice": {
      "post": {
        "summary": "Delete Service",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service ID to be deleted",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string",
                    "description": "ID of the service to be deleted"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/activeinactiveservice": {
      "post": {
        "summary": "Activate/Deactivate Service",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Service ID and activation status",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string",
                    "description": "ID of the service"
                  },
                  "is_active": {
                    "type": "boolean",
                    "description": "Activation status (true to activate, false to deactivate)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },




    "/api/adminservice/addfurnishing":{
      "post": {
        "summary": "Add Furnishing Details",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Furnishing details to be added",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string",
                    "description": "ID of the property for which furnishing details are being added"
                  },
                  "step": {
                    "type": "string",
                    "description": "Step indicating the type of furnishing"
                  },
                  "furnishingDetails": {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "description": "Type of furnishing (e.g., furnished, unfurnished)"
                      },
                      "amenities": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "Name of the amenity"
                            },
                            "count": {
                              "type": "integer",
                              "description": "Count of the amenity"
                            },
                            "isAvilable": {
                              "type": "boolean",
                              "description": "Availability status of the amenity"
                            }
                          }
                        },
                        "description": "Array of amenities"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/getfurnishing": {
      "get": {
        "summary": "Get Furnishing Details",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
            // You can include the response schema here if needed
          }
        }
      }
    },    


    "/api/adminservice/dynamichomepage": {
      "post": {
          "summary": "Update Dynamic Home Page",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              },
                              "step": {
                                  "type": "string",
                                  "description": "Step of the home page"
                              },
                              "title": {
                                  "type": "string",
                                  "description": "Title of the home page"
                              },
                              "sliderImagepath": {
                                  "type": "array",
                                  "items": {
                                      "type": "string"
                                  },
                                  "description": "Array of slider image paths"
                              },
                              "seccondaryImagePath": {
                                  "type": "string",
                                  "description": "Secondary image path"
                              },
                              "description": {
                                  "type": "string",
                                  "description": "Description of the home page"
                              },
                              "quote": {
                                  "type": "string",
                                  "description": "Quote for the home page"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },
    "/api/adminservice/dynamichomepage2": {
      "post": {
          "summary": "Update Dynamic Home Page for Services",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details for services",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "step": {
                                  "type": "string",
                                  "description": "Step of the home page"
                              },
                              "serviceImagePath": {
                                  "type": "string",
                                  "description": "Service image path"
                              },
                              "servicesDescription": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "serviceTitle": {
                                              "type": "string",
                                              "description": "Title of the service"
                                          },
                                          "iconPath": {
                                              "type": "string",
                                              "description": "Icon path for the service"
                                          }
                                      }
                                  },
                                  "description": "Array of service descriptions"
                              },
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },  
    "/api/adminservice/dynamichomepage3": {
      "post": {
          "summary": "Update Dynamic Home Page",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              },
                              "step": {
                                  "type": "string",
                                  "description": "Step of the update"
                              },
                              "updateImagePath": {
                                  "type": "array",
                                  "items": {
                                      "type": "string"
                                  },
                                  "description": "Array of update image paths"
                              },
                              "updateDetails": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "iconPath": {
                                              "type": "string",
                                              "description": "Icon path for the update"
                                          },
                                          "updateDescription": {
                                              "type": "string",
                                              "description": "Description of the update"
                                          }
                                      }
                                  },
                                  "description": "Array of update details"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },  
    "/adminservice/dynamichomepage4": {
      "post": {
          "summary": "Update Dynamic Home Page",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              },
                              "step": {
                                  "type": "string",
                                  "description": "Step of the update"
                              },
                              "featureImagePath": {
                                  "type": "string",
                                  "description": "Feature image path"
                              },
                              "featureHeadDescription": {
                                  "type": "string",
                                  "description": "Head description of the feature"
                              },
                              "featureDetails": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "iconPath": {
                                              "type": "string",
                                              "description": "Icon path for the feature"
                                          },
                                          "featureDescription": {
                                              "type": "string",
                                              "description": "Description of the feature"
                                          }
                                      }
                                  },
                                  "description": "Array of feature details"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },  
    "/adminservice/dynamichomepage5": {
      "post": {
          "summary": "Update Dynamic Home Page",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              },
                              "step": {
                                  "type": "string",
                                  "description": "Step of the update"
                              },
                              "faqs": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "Qus": {
                                              "type": "string",
                                              "description": "FAQ question"
                                          },
                                          "Ans": {
                                              "type": "string",
                                              "description": "FAQ answer"
                                          }
                                      }
                                  },
                                  "description": "Array of FAQ details"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },  
    "/adminservice/dynamichomepage6": {
      "post": {
          "summary": "Update Dynamic Home Page",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "Dynamic home page update details",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "_id": {
                                  "type": "string",
                                  "description": "ID of the dynamic home page"
                              },
                              "step": {
                                  "type": "string",
                                  "description": "Step of the update"
                              },
                              "testimony": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "testimonyImagePath": {
                                              "type": "string",
                                              "description": "Image path for the testimony"
                                          },
                                          "testimonyDescription": {
                                              "type": "string",
                                              "description": "Testimony description"
                                          }
                                      }
                                  },
                                  "description": "Array of testimony details"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },
    "/adminservice/dynamichomepage": {
      "get": {
        "summary": "Get dynamic homepage configuration",
        "tags": [
          "Admin Service"
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    


    "/adminservice/serviceslistingbyid": {
      "get": {
        "summary": "Get services by user ID",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "description": "User ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of results to return per page",
            "required": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number for paginated results",
            "required": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },   
    "/adminservice/getuserlist": {
      "get": {
        "summary": "Get list of users",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of results to return per page",
            "required": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number for paginated results",
            "required": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "searchQuery",
            "in": "query",
            "description": "Search query to filter users",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/getpropertybyuserid": {
          "get": {
            "summary": "Get property by user ID",
            "tags": [
              "Admin Service"
            ],
            "security": [
              {
                "authtoken": []
              }
            ],
            "parameters": [
              {
                "in": "query",
                "name": "id",
                "required": true,
                "schema": {
                  "type": "string"
                },
                "description": "User ID for retrieving properties"
              }
            ],
            "responses": {
              "200": {
                "description": "Successful response"
              }
            }
          }
    },
    "/adminservice/getuserbyid": {
      "get": {
        "summary": "Get user by ID",
        "tags": [
          "Admin Service"
        ],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "id",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "User ID for retrieving user details"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/adminservice/activeinactivebyuserid": {
      "post": {
          "summary": "Activate/Deactivate User by ID",
          "tags": ["Admin Service"],
          "security": [
            {
              "authtoken": []
            }
          ],
          "requestBody": {
              "description": "User ID and activation status",
              "required": true,
              "content": {
                  "application/json": {
                      "schema": {
                          "type": "object",
                          "properties": {
                              "id": {
                                  "type": "string",
                                  "description": "User ID"
                              },
                              "is_active": {
                                  "type": "integer",
                                  "description": "Activation status (0 for inactive, 1 for active)"
                              }
                          }
                      }
                  }
              }
          },
          "responses": {
              "200": {
                  "description": "Successful response"
              }
          }
      }
    },  
       
  
    "/adminservice/statuschangereport": {
      "post": {
        "summary": "Change Status of a Report",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Report status change data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "adminAction": {
                    "type": "string",
                    "enum": ["resolved", "pending", "rejected"]
                  },
                  "adminComment": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Report status changed successfully"
          }
        }
      }
    },
    "/adminservice/reportlisting": {
      "get": {
        "summary": "Get a list of reports",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "required": true,
            "type": "integer"
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "required": true,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/adminservice/blockuser": {
      "post": {
        "summary": "Block/Unblock a user",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "User blocking data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "personId": {
                    "type": "string",
                    "description": "ID of the user to be blocked/unblocked"
                  },
                  "is_active": {
                    "type": "boolean",
                    "description": "Block/unblock status of the user"
                  },
                  "block_by_admin": {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "description": "Type of block (e.g., temporary, permanent)"
                      },
                      "block_time": {
                        "type": "string",
                        "description": "Timestamp indicating the block time (if applicable)"
                      }
                    }
                  },
                  "report_id": {
                    "type": "string",
                    "description": "ID of the report associated with the user"
                  },
                  "adminAction": {
                    "type": "string",
                    "description": "Admin action (e.g., resolved)"
                  },
                  "adminComment": {
                    "type": "string",
                    "description": "Admin comment for the action"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    

    "/adminservice/getprofile": {
      "get": {
        "summary": "Get Admin Profile",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/adminservice/updateprofile": {
      "post": {
        "summary": "Update Admin Profile",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Admin profile update data",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "mobilenumber": {
                    "type": "number"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Profile updated successfully"
          }
        }
      }
    },
    

    "/adminservice/statuschangeservices": {
      "post": {
        "summary": "Change Status of Services",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Change status of services",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "admin_approval": {
                    "type": "string",
                    "enum": ["approved", "rejected"]
                  }
                },
                "required": ["_id", "admin_approval"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status change successful"
          }
        }
      }
    },
    "/adminservice/statuschangepostproperty": {
      "post": {
        "summary": "Change Status of Post Property",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Change status of post property",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "_id": {
                    "type": "string"
                  },
                  "admin_approval": {
                    "type": "string",
                    "enum": ["approved", "rejected"]
                  }
                },
                "required": ["_id", "admin_approval"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status change successful"
          }
        }
      }
    },
    "/adminservice/pendingproperty": {
      "get": {
        "summary": "Get Pending Property Listings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "required": true,
            "type": "integer"
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "required": true,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },    
    "/adminservice/pendingservices": {
      "get": {
        "summary": "Get Pending Services Listings",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "required": true,
            "type": "integer"
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "required": true,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
  
    "/adminservice/dashboard": {
      "get": {
        "summary": "Get Dashboard Data",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "useryear",
            "in": "query",
            "description": "Year for user data",
            "type": "integer",
            "required": true
          },
          {
            "name": "propertyyear",
            "in": "query",
            "description": "Year for property data",
            "type": "integer",
            "required": true
          },
          {
            "name": "serviceyear",
            "in": "query",
            "description": "Year for service data",
            "type": "integer",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    },
    "/api/adminservice/contact": {
      "get": {
        "summary": "Get Contact Messages",
        "tags": ["Admin Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "type": "integer",
            "required": true
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "type": "integer",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
    
  },
};

const commonService = {
  paths: {
    "/api/commonService/fileupload": {
      "post": {
        "summary": "File Upload for Dynamic Homepage",
        "tags": ["Common Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "parameters": [
          {
            "name": "step",
            "in": "query",
            "description": "Step for file upload",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "File upload using form data",
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "files": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful file upload response"
          }
        }
      }
    },    
    "/api/commonService/contact": {
      "post": {
        "summary": "Contact Form Submission",
        "tags": ["Common Service"],
        "security": [
          {
            "authtoken": []
          }
        ],
        "requestBody": {
          "description": "Contact form submission details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "subject": {
                    "type": "string"
                  },
                  "company": {
                    "type": "string"
                  },
                  "service": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  }
                },
                "example": {
                  "name": "Subhajit chakraborty",
                  "email": "dr.subhajitchakraborty@gmail.com",
                  "subject": "Enquery",
                  "company": "ABCD",
                  "service": "SEO",
                  "message": "Hiiiii,Guys"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful contact form submission response"
          }
        }
      }
    }
  },
};

const googleRegistrationAndLogin = {
  paths: {
    "/api/user/googleregistration": {
      "post": {
        "summary": "Google Registration",
        "tags": ["User"],
        "requestBody": {
          "description": "Google registration details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "credential": {
                    "type": "string"
                  },
                  "user_type": {
                    "type": "string"
                  }
                },
                "example": {
                  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
                  "user_type": "business"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful registration response"
          }
        }
      }
    },
    "/api/user/googlelogin": {
      "post": {
        "summary": "Google Login",
        "tags": ["User"],
        "requestBody": {
          "description": "Google login details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "credential": {
                    "type": "string"
                  }
                },
                "example": {
                  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful login response"
          }
        }
      }
    },
    
  },
};

const imageKitAuth = {
  paths: {
  "/auth": {
  "get": {
    "summary": "Authentication endpoint",
    "tags": ["Authentication"],
    "responses": {
      "200": {
        "description": "Successful authentication response"
        }
      }
    }
  },
  },
};



// Merge your existing swaggerSpec with the userRegistrationSpec
swaggerSpec.paths = { ...swaggerSpec.paths, ...userAuth.paths, ...adminAuth.paths, ...userServices.paths, ...adminServices.paths, 
                      ...commonService.paths , ...googleRegistrationAndLogin.paths , ...imageKitAuth.paths};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export the Express app for use in other files (app.js)
module.exports = app;