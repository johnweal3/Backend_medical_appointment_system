import { Request, Response } from "express";
import {Schedule} from "../models/schedule.model";
import { Appointment } from "../models/appointment.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// CREATE SCHEDULE
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;
    
    const overlap = await Schedule.findOne({
      doctorId,
      dayOfWeek,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlap) {
      return res.status(400).json({
        message: "Schedule overlaps with another schedule",
      });
    }
    const newSchedule = await Schedule.create(req.body);
    res.status(201).json({
      message: "Schedule created successfully",
      newSchedule
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the schedule"
    });
  }
};

// GET ALL SCHEDULES
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({
      message: "Falied to find schedules",
    });
  }
};

// GET ONE SCHEDULE
export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const scheduleId = req.params.id;
    const targetSchedule = await Schedule.findById(scheduleId);

    if (!targetSchedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }
    res.status(200).json({
      message: "Schedule found successfully",
      targetSchedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the schedule",
    });
  }
};

// GET DOCTOR SCHEDULES
export const getDoctorSchedules = async (
  req: Request,
  res: Response
) => {
  try {
    const doctorId = req.params.doctorId as string;
    const schedules = await Schedule.find({ doctorId });

    if (schedules.length === 0) {
      return res.status(404).json({
        message: "No schedules found for this doctor",
      });
    }
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get the schedules",
    });
  }
};
// UPDATE SCHEDULE
export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const {doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }
    if (schedule.doctorId.toString() !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "You can only manage your own schedule",
      });
    }
    schedule.dayOfWeek = dayOfWeek;
    schedule.startTime = startTime;
    schedule.endTime = endTime;
    schedule.slotDuration = slotDuration || 30;

    await schedule.save();

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the schedule",
    });
  }
};

// DELETE SCHEDULE
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const scheduleId = req.params.id;
    if (!scheduleId) {
      return res.status(400).json({
        message: "Id is required",
      });
    }
    const targetSchedule = await Schedule.findById(scheduleId);

    if (!targetSchedule) {
      return res.status(404).json({
        message: "No schedule for this id",
      });
    }

    if (targetSchedule.doctorId.toString() !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "You can only manage your own schedule",
      });
    }
    const futureAppointment = await Appointment.findOne({
      doctorId: targetSchedule.doctorId,
      dayOfWeek: targetSchedule.dayOfWeek,
      status: "Confirmed",
    });
    if (futureAppointment) {
      return res.status(409).json({
        message: "Cannot delete schedule with future confirmed appointments",
      });
    }

    await targetSchedule.deleteOne();

    return res.status(200).json({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete schedule",
    });
  }
};
