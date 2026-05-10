
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    apps: [
        {
            name: "Turl",
            script: "./app.js",
            watch: true,
            env: {
                "NODE_ENV": "development",
                "PORT": process.env.PORT,
                "EMAIL": process.env.EMAIL,
                "EMAIL_PASSWORD": process.env.EMAIL_PASSWORD,
                "JWT_SECRET": process.env.JWT_SECRET,
                "DATABASE_URL": process.env.DATABASE_URL,
                "FRONTEND_URL": process.env.FRONTEND_URL,
            },
            env_staging: {
                "NODE_ENV": "staging",
                "PORT": process.env.PORT,
                "EMAIL": process.env.EMAIL,
                "EMAIL_PASSWORD": process.env.EMAIL_PASSWORD,
                "JWT_SECRET": process.env.STAGING_JWT_SECRET,
                "DATABASE_URL": process.env.STAGING_DATABASE_URL,
                "FRONTEND_URL": process.env.STAGING_FRONTEND_URL,
            }
        }
    ]
}