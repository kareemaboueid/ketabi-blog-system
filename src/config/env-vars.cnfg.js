import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const env_vars_schema = Joi.object()
  .keys({
    // Define the environment variables
    NODE_ENV: Joi.string().valid('production', 'development').required(),

    // Define port
    PORT: Joi.number().default(5555),

    // Define MongoDB
    // MongoDB username
    MONGODB_USERNAME: Joi.string().required().description('Mongo DB username'),
    // MongoDB password
    MONGODB_PASSWORD: Joi.string().required().description('Mongo DB password'),
    // MongoDB test database
    MONGODB_TEST_DB: Joi.string()
      .required()
      .description('Mongo DB test database'),
    // MongoDB real database
    MONGODB_REAL_DB: Joi.string()
      .required()
      .description('Mongo DB real database'),
    // MongoDB url
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),

    // JWT
    // JWT secret key
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    // JWT access expiration minutes
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    // JWT refresh expiration days
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    // JWT reset password expiration minutes
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    // JWT verify email expiration minutes
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    // SMTP
    // SMTP host
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP port
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP username
    SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP password
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    // Email from
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app',
    ),
  })
  .unknown();

// Validate the environment variables
const { value: vars, error } = env_vars_schema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/**
 * @typedef {Object} env_vars
 */
export const env_vars = {
  env: vars.NODE_ENV,
  port: vars.PORT,
  mongoose: {
    username: vars.MONGODB_USERNAME,
    password: vars.MONGODB_PASSWORD,
    test_db: vars.MONGODB_TEST_DB,
    real_db: vars.MONGODB_REAL_DB,
    url: vars.MONGODB_URL + (vars.NODE_ENV === 'test' ? '-test' : ''),
  },
  jwt: {
    secret: vars.JWT_SECRET,
    access_expiration_minutes: vars.JWT_ACCESS_EXPIRATION_MINUTES,
    refresh_expiration_days: vars.JWT_REFRESH_EXPIRATION_DAYS,
    reset_password_expiration_minutes:
      vars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verify_email_expiration_minutes: vars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: vars.SMTP_HOST,
      port: vars.SMTP_PORT,
      auth: {
        user: vars.SMTP_USERNAME,
        pass: vars.SMTP_PASSWORD,
      },
    },
    from: vars.EMAIL_FROM,
  },
};
export default env_vars;
