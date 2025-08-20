const Joi = require('joi');

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
}).unknown();

const { error } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}