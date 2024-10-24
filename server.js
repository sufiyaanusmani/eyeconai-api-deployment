require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const User = require("./models/User");

const app = express();

app.use(express.json());

// Prefix all routes with /api
app.use("/api/auth", require("./routes/authRoutes"));

// Sync the models with the database
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});

