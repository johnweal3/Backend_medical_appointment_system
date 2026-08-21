"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("../controllers/appointment.controller");
const appointment_middleware_1 = require("../middlewares/appointment.middleware");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - date
 *         - startTime
 *         - endTime
 *       properties:
 *         patientId:
 *           type: string
 *           example: 64f123abc456def789012345
 *         doctorId:
 *           type: string
 *           example: 64f123abc456def789012999
 *         date:
 *           type: string
 *           example: "2026-09-01"
 *         startTime:
 *           type: string
 *           example: "10:00"
 *         endTime:
 *           type: string
 *           example: "10:30"
 *         notes:
 *           type: string
 *           example: "First visit, knee pain"
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 */
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Time slot already taken
 */
router.post("/", appointment_middleware_1.validateAppointment, appointment_controller_1.createAppointment);
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments (optionally filter by status)
 *     tags: [Appointment]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
router.get("/", appointment_controller_1.getAppointments);
/**
 * @swagger
 * /appointments/doctor/{doctorId}:
 *   get:
 *     summary: Get all appointments for a doctor
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor's appointments retrieved successfully
 */
router.get("/doctor/:doctorId", appointment_controller_1.getDoctorAppointments);
/**
 * @swagger
 * /appointments/patient/{patientId}:
 *   get:
 *     summary: Get appointment history for a patient
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient's appointments retrieved successfully
 */
router.get("/patient/:patientId", appointment_controller_1.getPatientAppointments);
/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get a single appointment by id
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", appointment_controller_1.getAppointmentById);
/**
 * @swagger
 * /appointments/{id}/cancel:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Cannot cancel this appointment
 *       404:
 *         description: Appointment not found
 */
router.put("/:id/cancel", appointment_controller_1.cancelAppointment);
/**
 * @swagger
 * /appointments/{id}/status:
 *   put:
 *     summary: Update an appointment's status (doctor confirms/completes it)
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       400:
 *         description: Invalid status or appointment already completed
 *       404:
 *         description: Appointment not found
 */
router.put("/:id/status", appointment_controller_1.updateAppointmentStatus);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map