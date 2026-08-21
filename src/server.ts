import express, { Application } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db";
import swaggerSpec from "./config/swagger";

import scheduleRoutes from "./routes/schedule.routes";
import appointmentRoutes from "./routes/appointment.routes";
import authRoutes from "./routes/auth.routes";
import doctorRoutes from "./routes/doctor.routes";

dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Medical Appointment System API is running"
    });
});

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const startServer = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await connectDB();

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
module.exports = app;
