
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    apps: [
        {
            name: "Turl-Staging",
            script: "./dist/index.js",

            max_restarts: 10,
            restart_delay: 3000,
            env: {
                "NODE_ENV": process.env.NODE_ENV,
                "PORT": process.env.PORT,
                "EMAIL": process.env.EMAIL,
                "EMAIL_PASSWORD": process.env.EMAIL_PASSWORD,
                "JWT_SECRET": process.env.JWT_SECRET,
                "DATABASE_URL": process.env.DATABASE_URL,
                "FRONTEND_URL": process.env.FRONTEND_URL,
            }
        }
    ]
}
