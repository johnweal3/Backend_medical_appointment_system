"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateSchedule = exports.getDoctorSchedules = exports.getScheduleById = exports.getSchedules = exports.createSchedule = void 0;
const schedule_model_1 = require("../models/schedule.model");
const appointment_model_1 = require("../models/appointment.model");
// CREATE SCHEDULE
const createSchedule = async (req, res) => {
    try {
        const { doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;
        const overlap = await schedule_model_1.Schedule.findOne({
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
        const newSchedule = await schedule_model_1.Schedule.create(req.body);
        res.status(201).json({
            message: "Schedule created successfully",
            newSchedule
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create the schedule"
        });
    }
};
exports.createSchedule = createSchedule;
// GET ALL SCHEDULES
const getSchedules = async (req, res) => {
    try {
        const schedules = await schedule_model_1.Schedule.find();
        res.status(200).json(schedules);
    }
    catch (error) {
        res.status(500).json({
            message: "Falied to find schedules",
        });
    }
};
exports.getSchedules = getSchedules;
// GET ONE SCHEDULE
const getScheduleById = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const targetSchedule = await schedule_model_1.Schedule.findById(scheduleId);
        if (!targetSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }
        res.status(200).json({
            message: "Schedule found successfully",
            targetSchedule,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get the schedule",
        });
    }
};
exports.getScheduleById = getScheduleById;
// GET DOCTOR SCHEDULES
const getDoctorSchedules = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        if (!doctorId) {
            return res.status(404).json({
                message: "Doctor id is not found",
            });
        }
        const schedules = await schedule_model_1.Schedule.find({
            doctorId: doctorId,
        });
        return res.status(200).json(schedules);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get the schedules",
        });
    }
};
exports.getDoctorSchedules = getDoctorSchedules;
// UPDATE SCHEDULE
const updateSchedule = async (req, res) => {
    try {
        const { doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;
        const schedule = await schedule_model_1.Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }
        if (schedule.doctorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage your own schedule",
            });
        }
        schedule.doctorId = doctorId;
        schedule.dayOfWeek = dayOfWeek;
        schedule.startTime = startTime;
        schedule.endTime = endTime;
        schedule.slotDuration = slotDuration || 30;
        await schedule.save();
        res.status(200).json({
            message: "Schedule updated successfully",
            schedule,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update the schedule",
        });
    }
};
exports.updateSchedule = updateSchedule;
// DELETE SCHEDULE
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        if (!scheduleId) {
            return res.status(400).json({
                message: "Id is required",
            });
        }
        const targetSchedule = await schedule_model_1.Schedule.findById(scheduleId);
        if (!targetSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }
        if (targetSchedule.doctorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage your own schedule",
            });
        }
        const futureAppointment = await appointment_model_1.Appointment.findOne({
            doctorId: targetSchedule.doctorId,
            status: "Confirmed",
        });
        if (futureAppointment) {
            return res.status(409).json({
                message: "Cannot delete schedule with future confirmed appointments",
            });
        }
        const schedules = await schedule_model_1.Schedule.find();
        const scheduleIndex = schedules.findIndex((Schedule) => {
            return scheduleId === Schedule.id;
        });
        if (scheduleIndex === -1) {
            return res.status(404).json({
                message: "No schedule for this id",
            });
        }
        schedules.splice(scheduleIndex, 1);
        return res.status(200).json({
            message: "Schedule deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete schedule",
        });
    }
};
exports.deleteSchedule = deleteSchedule;
//# sourceMappingURL=schedule.controller.js.map