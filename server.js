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

// Sync the models with the database
sequelize.sync().then(() => {
    console.log("[INFO] Database synced");
    app.listen(process.env.PORT, () => {
        console.log(`[INFO] Server running on port ${process.env.PORT}`);
    });
});

