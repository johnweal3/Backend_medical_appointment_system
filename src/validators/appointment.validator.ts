import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Validation for creating an appointment
export const validateCreateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctor, appointmentDate, timeSlot, notes } = req.body;

  if (!doctor) {
    return res.status(400).json({
      success: false,
      message: "Doctor is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctor ID format",
    });
  }

  if (!appointmentDate) {
    return res.status(400).json({
      success: false,
      message: "Appointment date is required",
    });
  }

  const date = new Date(appointmentDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment date format",
    });
  }

  if (date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date must be in the future",
    });
  }

  if (!timeSlot) {
    return res.status(400).json({
      success: false,
      message: "Time slot is required",
    });
  }

  if (notes && notes.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Notes cannot exceed 500 characters",
    });
  }

  next();
};

// Validation for update status payload
export const validateUpdateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

// Validation for Mongo ObjectId parameters
export const validateAppointmentId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID format",
    });
  }

  next();
};