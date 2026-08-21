"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scheduleSchema = new mongoose_1.default.Schema({
    doctorId: {
        type: String,
        required: true,
    },
    dayOfWeek: {
        type: String,
        required: true,
        enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    slotDuration: {
        type: Number,
        default: 30,
    },
    availability: {
        type: Boolean,
        default: true,
    }
});
exports.Schedule = mongoose_1.default.model("Schedule", scheduleSchema);
//# sourceMappingURL=schedule.model.js.map