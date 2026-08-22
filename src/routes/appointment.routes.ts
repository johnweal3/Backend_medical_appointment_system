import express from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";

import { validateAppointment } from "../middlewares/appointment.middleware";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         patientId:
 *           type: string
 *           description: Always the logged-in patient — never sent by the client
 *           example: 64f123abc456def789012345
 *         doctorId:
 *           type: string
 *           example: 64f123abc456def789012999
 *         dayOfWeek:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
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
 *
 *     NewAppointment:
 *       type: object
 *       required:
 *         - doctorId
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *       properties:
 *         doctorId:
 *           type: string
 *           example: 64f123abc456def789012999
 *         dayOfWeek:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *         startTime:
 *           type: string
 *           example: "10:00"
 *         endTime:
 *           type: string
 *           example: "10:30"
 *         notes:
 *           type: string
 *           example: "First visit, knee pain"
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment (patient only)
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAppointment'
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only patients can book appointments
 *       409:
 *         description: Time slot already taken
 */
router.post(
  "/",
  protect,
  authorize("patient"),
  validateAppointment,
  createAppointment
);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments (admin only, optionally filter by status)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins only
 */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAppointments
);

/**
 * @swagger
 * /api/appointments/doctor/{doctorId}:
 *   get:
 *     summary: Get all appointments for a doctor (that doctor, or admin)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/doctor/:doctorId",
  protect,
  authorize("doctor", "admin"),
  getDoctorAppointments
);

/**
 * @swagger
 * /api/appointments/patient/{patientId}:
 *   get:
 *     summary: Get appointment history for a patient (that patient, or admin)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/patient/:patientId",
  protect,
  authorize("patient", "admin"),
  getPatientAppointments
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get a single appointment by id (owning patient, owning doctor, or admin)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.get(
  "/:id",
  protect,
  getAppointmentById
);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   put:
 *     summary: Cancel an appointment (owning patient, or admin)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.put(
  "/:id/cancel",
  protect,
  authorize("patient", "admin"),
  cancelAppointment
);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     summary: Update an appointment's status (owning doctor confirms/completes it, or admin)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 */
router.put(
  "/:id/status",
  protect,
  authorize("doctor", "admin"),
  updateAppointmentStatus
);

export default router;