import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const VALID_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Note: patientId is NOT validated here — it always comes from the logged-in
// patient's token (see auth.middleware + appointment.controller), never from
// the request body, so a patient can never book on someone else's behalf.
export const validateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctorId, dayOfWeek, startTime, endTime } = req.body;

  // Required fields
  if (!doctorId || !dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({
      message: "doctorId, dayOfWeek, startTime and endTime are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({
      message: "Invalid doctor ID",
    });
  }

  // Validate day
  if (!VALID_DAYS.includes(dayOfWeek)) {
    return res.status(400).json({
      message: "Invalid day of week",
    });
  }

  // Validate time format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(startTime)) {
    return res.status(400).json({
      message: "Invalid startTime format. Use HH:MM",
    });
  }

  if (!timeRegex.test(endTime)) {
    return res.status(400).json({
      message: "Invalid endTime format. Use HH:MM",
    });
  }

  // End time must be after start time
  if (startTime >= endTime) {
    return res.status(400).json({
      message: "endTime must be after startTime",
    });
  }

  next();
};