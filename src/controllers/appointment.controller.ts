import { Response } from "express";
import mongoose from "mongoose";
import { Appointment } from "../models/appointment.model";
import { Schedule } from "../models/schedule.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// Statuses that still hold a time slot
type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const ACTIVE_STATUSES: AppointmentStatus[] = ["Pending", "Confirmed"];

const VALID_STATUSES: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

// Create Appointment
// patientId always comes from the logged-in patient's token, never from the
// request body — otherwise anyone could book an appointment "as" someone else.
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id;

    if (!patientId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { doctorId, dayOfWeek, startTime, endTime, notes } = req.body;

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

    // Get doctor's active appointments on this day
    const doctorAppointments = await Appointment.find({
      doctorId: doctorId,
      dayOfWeek: dayOfWeek,
      status: { $in: ACTIVE_STATUSES },
    });

    // Check doctor double-booking
    const doctorOverlap = doctorAppointments.find((appointment) => {
      return startTime < appointment.endTime && endTime > appointment.startTime;
    });

    if (doctorOverlap) {
      return res.status(409).json({
        message: "Doctor already has an appointment at this time",
      });
    }

    // Check patient isn't double-booking themselves
    const patientOverlap = await Appointment.findOne({
      patientId: patientId,
      dayOfWeek: dayOfWeek,
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
      dayOfWeek,
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

// Get All Appointments — admin only, since admins are the ones who oversee
// every appointment in the system. Patients/doctors use the endpoints below
// that are scoped to their own appointments.
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    if (status && !VALID_STATUSES.includes(status as AppointmentStatus)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const filter = status ? { status: status as AppointmentStatus } : {};

    const appointments = await Appointment.find(filter);

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Get Appointments Error:", error);

    return res.status(500).json({
      message: "Failed to get appointments",
    });
  }
};

// Get Appointment By ID — only the owning patient, the owning doctor, or admin
export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = req.params.id;

    if (
      typeof appointmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(appointmentId)
    ) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const user = req.user!;
    const isOwner =
      appointment.patientId.toString() === user.id ||
      appointment.doctorId.toString() === user.id;

    if (user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        message: "Forbidden: this is not your appointment",
      });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error("Get Appointment Error:", error);

    return res.status(500).json({
      message: "Failed to get appointment",
    });
  }
};

// Get Doctor Appointments — only that doctor themself, or admin
export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor id is required",
      });
    }

    const user = req.user!;
    if (user.role !== "admin" && user.id !== doctorId) {
      return res.status(403).json({
        message: "Forbidden: you can only view your own appointments",
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

// Get Patient Appointments — only that patient themself, or admin
export const getPatientAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient id is required",
      });
    }

    const user = req.user!;
    if (user.role !== "admin" && user.id !== patientId) {
      return res.status(403).json({
        message: "Forbidden: you can only view your own appointments",
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

// Cancel Appointment — only the owning patient, or admin
export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = req.params.id;

    if (
      typeof appointmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(appointmentId)
    ) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const user = req.user!;
    if (user.role !== "admin" && appointment.patientId.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: this is not your appointment",
      });
    }

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

// Update Appointment Status — only the owning doctor, or admin
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    if (
      typeof appointmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(appointmentId)
    ) {
      return res.status(400).json({
        message: "Invalid appointment id",
      });
    }

    if (!VALID_STATUSES.includes(status as AppointmentStatus)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const user = req.user!;
    if (user.role !== "admin" && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: this is not your appointment",
      });
    }

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