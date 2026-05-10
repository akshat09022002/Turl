import dotenv from "dotenv";
dotenv.config();



const currEnv= "development";

const env_variables={
    "development":{
        JWT_SECRET:process.env.DEVELOPMENT_JWT_SECRET,
        DATABASE_URL:process.env.DEVELOPMENT_DATABASE_URL,
        FRONTEND_URL:process.env.DEVELOPMENT_FRONTEND_URL,
        BACKEND_URL:process.env.DEVELOPMENT_BACKEND_URL,
        PORT: process.env.DEVELOPMENT_PORT,
    },
    "staging":{
        JWT_SECRET:process.env.STAGING_JWT_SECRET,
        DATABASE_URL:process.env.STAGING_DATABASE_URL,
        FRONTEND_URL:process.env.STAGING_FRONTEND_URL,
        BACKEND_URL:process.env.STAGING_BACKEND_URL,
        PORT:process.env.STAGING_PORT,
    },
    "production":{
        JWT_SECRET:process.env.JWT_SECRET,
        DATABASE_URL:process.env.DATABASE_URL,
        FRONTEND_URL:process.env.FRONTEND_URL,
        BACKEND_URL:process.env.BACKEND_URL,
        PORT:process.env.PORT,
    }
}

export const secrets = {
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    JWT_SECRET: env_variables[currEnv].JWT_SECRET,
    DATABASE_URL: env_variables[currEnv].DATABASE_URL,
    FRONTEND_URL: env_variables[currEnv].FRONTEND_URL,
    BACKEND_URL: env_variables[currEnv].BACKEND_URL,
    PORT: env_variables[currEnv].PORT,
}