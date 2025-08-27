const Joi = require('joi');

const dynamicHomepageValidation=async (req,res,next)=>{
    try { 
            
            var schema = {
                type: Joi.object().when('type', { is: 'home', then: Joi.string().required()}).
                concat(Joi.object().when('type', { is: 'feature', then: Joi.string().required()})).
                concat(Joi.object().when('type', { is: 'updates', then: Joi.string().required()})).
                concat(Joi.object().when('type', { is: 'services', then: Joi.string().required()})).
                concat(Joi.object().when('type', { is: 'testimony', then: Joi.string().required()})).
                concat(Joi.object().when('type', { is: 'faqs', then: Joi.string().required()}))
            };

            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}


module.exports={dynamicHomepageValidation}