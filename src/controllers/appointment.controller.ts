import { Request, Response } from "express";
import mongoose from "mongoose";
import { Appointment } from "../models/appointment.model";
import { Schedule } from "../models/schedule.model";

// Statuses that still hold a time slot
type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

const ACTIVE_STATUSES: AppointmentStatus[] = ["Pending", "Confirmed"];
const VALID_STATUSES: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

// Create Appointment
export const createAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      startTime,
      endTime,
      notes,
    } = req.body;

    // Get day name from appointment date
    const dayOfWeek = new Date(date).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    ) as DayOfWeek;

    // Check doctor's schedule
    const doctorSchedule = await Schedule.findOne({
      doctorId: doctorId,
      dayOfWeek: dayOfWeek,
    });

    if (!doctorSchedule) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    // Check requested time is inside doctor's schedule
    if (
      startTime < doctorSchedule.startTime ||
      endTime > doctorSchedule.endTime
    ) {
      return res.status(400).json({
        message: "Doctor is not available at this time",
      });
    }

    // Check that end time is after start time
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // Get doctor's active appointments on this date
    const doctorAppointments = await Appointment.find({
      doctorId: doctorId,
      date: date,
      status: { $in: ACTIVE_STATUSES },
    });

    // Check doctor double-booking
    const doctorOverlap = doctorAppointments.find((appointment) => {
      return (
        startTime < appointment.endTime &&
        endTime > appointment.startTime
      );
    });

    if (doctorOverlap) {
      return res.status(409).json({
        message: "Doctor already has an appointment at this time",
      });
    }

    // Check patient isn't double-booking themselves
    const patientOverlap = await Appointment.findOne({
      patientId: patientId,
      date: date,
      status: { $in: ACTIVE_STATUSES },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (patientOverlap) {
      return res.status(409).json({
        message: "You already have an appointment at this time",
      });
    }

    // Create appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      startTime,
      endTime,
      notes,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      newAppointment,
    });

  } catch (error) {
    console.error("Create Appointment Error:", error);

    return res.status(500).json({
      message: "Failed to book appointment",
    });
  }
};


// Get All Appointments
export const getAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    // Optional filter, e.g. GET /appointments?status=Confirmed
    const status = typeof req.query.status === "string"
      ? req.query.status
      : undefined;

    if (status && !VALID_STATUSES.includes(status as AppointmentStatus)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const filter = status
      ? { status: status as AppointmentStatus }
      : {};

    const appointments = await Appointment.find(filter);

    return res.status(200).json(appointments);

  } catch (error) {
    console.error("Get Appointments Error:", error);

    return res.status(500).json({
      message: "Failed to get appointments",
    });
  }
};


// Get Appointment By ID
export const getAppointmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = req.params.id;

    if (typeof appointmentId !== "string" || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    const targetAppointment =
      await Appointment.findById(appointmentId);

    if (!targetAppointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    return res.status(200).json(targetAppointment);

  } catch (error) {
    console.error("Get Appointment Error:", error);

    return res.status(500).json({
      message: "Failed to get appointment",
    });
  }
};


// Get Doctor Appointments
export const getDoctorAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    const doctorId = req.params.doctorId;

    if (typeof doctorId !== "string" || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        message: "Invalid doctor id",
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctorId,
    });

    return res.status(200).json(appointments);

  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);

    return res.status(500).json({
      message: "Failed to get doctor appointments",
    });
  }
};


// Get Patient Appointments (appointment history)
export const getPatientAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    const patientId = req.params.patientId;

    if (typeof patientId !== "string" || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        message: "Invalid patient id",
      });
    }

    const appointments = await Appointment.find({
      patientId: patientId,
    });

    return res.status(200).json(appointments);

  } catch (error) {
    console.error("Get Patient Appointments Error:", error);

    return res.status(500).json({
      message: "Failed to get patient appointments",
    });
  }
};


// Cancel Appointment
export const cancelAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = req.params.id;

    if (typeof appointmentId !== "string" || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // TODO: once auth is ready, only the owning patient or an admin can cancel

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message: "Appointment is already cancelled",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled",
      });
    }

    // Can't cancel an appointment that already started
    const appointmentDateTime = new Date(
      `${appointment.date}T${appointment.startTime}`
    );

    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({
        message: "Cannot cancel an appointment that has already started",
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    return res.status(500).json({
      message: "Failed to cancel appointment",
    });
  }
};


// Update Appointment Status (doctor confirms/completes an appointment)
export const updateAppointmentStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    if (typeof appointmentId !== "string" || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // TODO: once auth is ready, only the owning doctor or an admin can update

    if (appointment.status === "Completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be edited",
      });
    }

    appointment.status = status as AppointmentStatus;

    await appointment.save();

    return res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });

  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    return res.status(500).json({
      message: "Failed to update appointment status",
    });
  }
};
