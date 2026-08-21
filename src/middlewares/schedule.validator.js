"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchedule = void 0;
const validateSchedule = (req, res, next) => {
    const { doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;
    if (!doctorId || !dayOfWeek || !startTime || !endTime) {
        return res.status(400).json({
            message: "doctor, dayOfWeek, startTime and endTime are required",
        });
    }
    if (typeof doctorId !== "string") {
        return res.status(400).json({
            message: "The name must be a string"
        });
    }
    if (typeof dayOfWeek !== "string") {
        return res.status(400).json({
            message: "The day must be a string"
        });
    }
    if (typeof startTime !== "string") {
        return res.status(400).json({
            message: "Start time must be a string"
        });
    }
    if (typeof endTime !== "string") {
        return res.status(400).json({
            message: "End time must be a string"
        });
    }
    if (typeof slotDuration !== "number") {
        return res.status(400).json({
            message: "Slot duration must be a number"
        });
    }
    if (startTime >= endTime) {
        return res.status(400).json({
            message: "StartTime must be before endTime",
        });
    }
    if (slotDuration <= 0) {
        return res.status(400).json({
            message: "Slot duration must be greater than 0",
        });
    }
    next();
};
exports.validateSchedule = validateSchedule;
//# sourceMappingURL=schedule.validator.js.map