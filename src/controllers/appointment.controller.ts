import { Request, Response } from "express";
import mongoose from "mongoose";
import Appointment from "../models/appointment.model";

export const createAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      doctor,
      appointmentDate,
      timeSlot,
      notes,
    } = req.body;

    // We will get this from Person 1's auth middleware
    const patient = req.user.id;

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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};