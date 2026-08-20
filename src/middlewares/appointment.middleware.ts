import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    patientId,
    doctorId,
    date,
    startTime,
    endTime,
  } = req.body;

  // Check required fields
  if (!patientId || !doctorId || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check patient ID
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid patient ID",
    });
  }

  // Check doctor ID
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
  }

  // Check date
  const appointmentDate = new Date(date);

  if (isNaN(appointmentDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  // Appointment must be in the future
  if (appointmentDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date must be in the future",
    });
  }

  // Check time order
  if (startTime >= endTime) {
    return res.status(400).json({
      success: false,
      message: "Start time must be before end time",
    });
  }

  next();
};