require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");

const app = express();

app.use(express.json());

// Prefix all routes with /api
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Sync the models with the database
sequelize.sync().then(() => {
    console.log("[INFO] Database synced");
    app.listen(process.env.PORT, () => {
        console.log(`[INFO] Server running on port ${process.env.PORT}`);
    });
});

