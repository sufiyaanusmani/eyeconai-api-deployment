require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors")

const app = express();

// CORS
app.use(cors());

app.use(express.json());

// Prefix all routes with /api
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/organization", require("./routes/organizationRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/public", require("./routes/publicRoutes")); // Public routes without authentication

// Initialize database connection
const initializeDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("[INFO] Database connection established");
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync();
            console.log("[INFO] Database synced");
        }
    } catch (error) {
        console.error("[ERROR] Unable to connect to database:", error);
    }
};

// Initialize database
initializeDb();

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[INFO] Server running on port ${PORT}`);
    });
}

module.exports = app;