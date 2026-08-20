import express from "express";

import {createSchedule,getSchedules,getScheduleById,getDoctorSchedules,updateSchedule,deleteSchedule,
} from "../controllers/schedule.controller";

import { validateSchedule } from "../middlewares/schedule.validator";

const router = express.Router();
router.post("/", validateSchedule, createSchedule);
router.get("/", getSchedules);
router.get("/doctor/:doctorId", getDoctorSchedules);
router.get("/:id", getScheduleById);
router.put("/:id", validateSchedule, updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;