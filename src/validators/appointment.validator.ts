import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export const validateCreateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctor, appointmentDate, timeSlot, notes } = req.body;

  // Doctor is required
  if (!doctor) {
    return res.status(400).json({
      success: false,
      message: "Doctor is required",
    });
  }

  // Doctor ID must be a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
  }

  // Appointment date is required
  if (!appointmentDate) {
    return res.status(400).json({
      success: false,
      message: "Appointment date is required",
    });
  }

  // Check that the date is valid
  const date = new Date(appointmentDate);

  if (isNaN(date.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment date",
    });
  }

  // Appointment must be in the future
  if (date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date must be in the future",
    });
  }

  // Time slot is required
  if (!timeSlot) {
    return res.status(400).json({
      success: false,
      message: "Time slot is required",
    });
  }

  // Notes are optional, but limited to 500 characters
  if (notes && notes.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Notes cannot exceed 500 characters",
    });
  }

  next();
};