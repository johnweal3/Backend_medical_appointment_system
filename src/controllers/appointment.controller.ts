import { Request, Response } from "express";

import Appointment from "../models/appointment.model";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @desc    Book a new appointment
// @route   POST /api/appointments
export const createAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { doctor, appointmentDate, timeSlot, notes } = req.body;
    const patient = req.user?.id;

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      timeSlot,
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for the selected doctor",
      });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      notes,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};

// @desc    Get user appointments (Patient gets theirs, Doctor gets assigned ones)
// @route   GET /api/appointments/my-appointments
export const getMyAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const query =
      userRole === "Doctor" ? { doctor: userId } : { patient: userId };

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get My Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
export const getAppointmentById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Get Appointment By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment details",
    });
  }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
export const cancelAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};

// @desc    Update appointment status (Doctor / Admin)
// @route   PATCH /api/appointments/:id/status
export const updateAppointmentStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};