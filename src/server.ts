import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import scheduleRoutes from "./routes/schedule.routes";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Medical Appointment System API is running"
  });
});
import appointmentRoutes from "./routes/appointment.routes";
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});