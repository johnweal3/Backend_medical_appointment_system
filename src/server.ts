import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import scheduleRoutes from "./routes/schedule.routes";
import appointmentRoutes from "./routes/appointment.routes";
import auth from "./routes/auth.routes";
import doctorRouter from "./routes/doctor.routes"
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;



app.get("/", (req, res) => {
  res.json({
    message: "Medical Appointment System API is running"
  });
});


app.use("/api/appointments", appointmentRoutes);
app.use("/auth" , auth);
app.use("/api",doctorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});