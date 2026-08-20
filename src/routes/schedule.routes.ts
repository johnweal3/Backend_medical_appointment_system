import express from "express";
import {createSchedule,getSchedules,getScheduleById,getDoctorSchedules,updateSchedule,deleteSchedule,
} from "../controllers/schedule.controller";
import { validateSchedule } from "../middlewares/schedule.validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - doctorId
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *       properties:
 *         doctorId:
 *           type: string
 *           description: ID of the doctor
 *         dayOfWeek:
 *           type: string
 *           enum:
 *             - Sunday
 *             - Monday
 *             - Tuesday
 *             - Wednesday
 *             - Thursday
 *             - Friday
 *             - Saturday
 *           description: Day of the week
 *         startTime:
 *           type: string
 *           description: Start time of the schedule
 *         endTime:
 *           type: string
 *           description: End time of the schedule
 *         slotDuration:
 *           type: number
 *           description: Duration of each appointment slot in minutes
 *           default: 30
 *         availability:
 *           type: boolean
 *           description: Indicates whether the schedule is available
 *           default: true
 *       example:
 *         doctorId: "doctor123"
 *         dayOfWeek: "Monday"
 *         startTime: "09:00"
 *         endTime: "15:00"
 *         slotDuration: 30
 *         availability: true
 */

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: APIs for managing doctors schedules
 */
const router = express.Router();

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     tags:
 *       - Schedules
 *     summary: Create a new doctor schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Invalid data or schedule overlaps with another schedule
 *       500:
 *         description: Failed to create the schedule
 */
router.post("/", validateSchedule, createSchedule);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get all schedules
 *     responses:
 *       200:
 *         description: List of all schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Failed to get schedules
 */
router.get("/", getSchedules);

/**
 * @swagger
 * /api/schedules/doctor/{doctorId}:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get schedules for a specific doctor
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor schedules found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Doctor ID not found
 *       500:
 *         description: Failed to get the schedules
 */
router.get("/doctor/:doctorId", getDoctorSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get a schedule by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Failed to get the schedule
 */
router.get("/:id", getScheduleById);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     tags:
 *       - Schedules
 *     summary: Update a schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       403:
 *         description: You can only manage your own schedule
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Failed to update the schedule
 */
router.put("/:id", validateSchedule, updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     tags:
 *       - Schedules
 *     summary: Delete a schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       400:
 *         description: Schedule ID is required
 *       403:
 *         description: You can only manage your own schedule
 *       404:
 *         description: Schedule not found
 *       409:
 *         description: Cannot delete schedule with future confirmed appointments
 *       500:
 *         description: Failed to delete schedule
 */
router.delete("/:id", deleteSchedule);


export default router;