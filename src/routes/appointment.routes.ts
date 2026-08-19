import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import {
  validateCreateAppointment,
  validateUpdateStatus,
  validateAppointmentId,
} from "../middlewares/appointment.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64e3f1a2b9d1c82f4c1e2a3b"
 *         patient:
 *           type: string
 *           example: "64e3f1a2b9d1c82f4c1e2a11"
 *         doctor:
 *           type: string
 *           example: "64e3f1a2b9d1c82f4c1e2a22"
 *         appointmentDate:
 *           type: string
 *           format: date
 *           example: "2026-09-15T00:00:00.000Z"
 *         timeSlot:
 *           type: string
 *           example: "10:00 AM - 10:30 AM"
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *           example: "Pending"
 *         notes:
 *           type: string
 *           example: "Routine checkup and prescription renewal"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateAppointmentInput:
 *       type: object
 *       required:
 *         - doctor
 *         - appointmentDate
 *         - timeSlot
 *       properties:
 *         doctor:
 *           type: string
 *           description: MongoDB ObjectId of the Doctor
 *           example: "64e3f1a2b9d1c82f4c1e2a22"
 *         appointmentDate:
 *           type: string
 *           format: date
 *           description: Must be a valid future date
 *           example: "2026-09-15"
 *         timeSlot:
 *           type: string
 *           example: "10:00 AM - 10:30 AM"
 *         notes:
 *           type: string
 *           maxLength: 500
 *           example: "Routine checkup"
 *
 *     UpdateStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *           example: "Confirmed"
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentInput'
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Validation error or slot already booked
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", validateCreateAppointment, createAppointment);

/**
 * @swagger
 * /api/appointments/my-appointments:
 *   get:
 *     summary: Get all appointments for the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-appointments", getMyAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment details by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details retrieved successfully
 *       400:
 *         description: Invalid appointment ID format
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", validateAppointmentId, getAppointmentById);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *         description: Appointment already cancelled
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/cancel", validateAppointmentId, cancelAppointment);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (Doctor/Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateStatusInput'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Access denied
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id/status",
  validateAppointmentId,
  restrictTo("Doctor", "Admin"),
  validateUpdateStatus,
  updateAppointmentStatus
);

export default router;