import { Router } from "express";

import {
    getAllDoctors,
    getDoctorProfile,
    getDoctorProfileById,
    createDoctorProfile,
    updateDoctorProfile,
    deleteDoctorProfile
} from "../controllers/doctor.controller";

import {
    validateDoctorProfileUpdate,
    validateDoctorProfile
} from "../middlewares/doctor.validator";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DoctorProfile:
 *       type: object
 *       required:
 *         - specialty
 *         - experience
 *         - clinicAddress
 *         - consultationFee
 *         - workingHours
 *         - availabilityStatus
 *       properties:
 *         specialty:
 *           type: string
 *           description: Doctor's medical specialty
 *           example: Cardiology
 *         experience:
 *           type: number
 *           minimum: 0
 *           description: Doctor's years of experience
 *           example: 5
 *         clinicAddress:
 *           type: string
 *           description: Doctor's clinic address
 *           example: Cairo, Egypt
 *         consultationFee:
 *           type: number
 *           minimum: 0
 *           description: Consultation fee
 *           example: 500
 *         workingHours:
 *           type: object
 *           required:
 *             - from
 *             - to
 *           properties:
 *             from:
 *               type: string
 *               description: Starting working time
 *               example: "09:00"
 *             to:
 *               type: string
 *               description: Ending working time
 *               example: "17:00"
 *         availabilityStatus:
 *           type: boolean
 *           description: Whether the doctor is currently available
 *           example: true
 *
 *     DoctorProfileUpdate:
 *       type: object
 *       properties:
 *         specialty:
 *           type: string
 *           example: Cardiology
 *         experience:
 *           type: number
 *           minimum: 0
 *           example: 6
 *         clinicAddress:
 *           type: string
 *           example: Cairo, Egypt
 *         consultationFee:
 *           type: number
 *           minimum: 0
 *           example: 600
 *         workingHours:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *               example: "10:00"
 *             to:
 *               type: string
 *               example: "18:00"
 *         availabilityStatus:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns all doctor profiles.
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    getAllDoctors
);

/**
 * @swagger
 * /doctors/me:
 *   get:
 *     summary: Get my doctor profile
 *     description: Returns the authenticated doctor's profile.
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */
router.get(
    "/me",
    getDoctorProfile
);

/**
 * @swagger
 * /doctors/me:
 *   post:
 *     summary: Create my doctor profile
 *     description: Creates a doctor profile for the authenticated user.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorProfile'
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Doctor profile already exists
 *       500:
 *         description: Server error
 */
router.post(
    "/me",
    validateDoctorProfile,
    createDoctorProfile
);

/**
 * @swagger
 * /doctors/me:
 *   patch:
 *     summary: Update my doctor profile
 *     description: Partially updates the authenticated doctor's profile.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorProfileUpdate'
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */
router.patch(
    "/me",
    validateDoctorProfileUpdate,
    updateDoctorProfile
);

/**
 * @swagger
 * /doctors/me:
 *   delete:
 *     summary: Delete my doctor profile
 *     description: Deletes the authenticated doctor's profile.
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: Doctor profile deleted successfully
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */
router.delete(
    "/me",
    deleteDoctorProfile
);

/**
 * @swagger
 * /doctors/{doctorId}:
 *   get:
 *     summary: Get a specific doctor's profile
 *     description: Returns the profile of a specific doctor.
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         description: ID of the doctor
 *         schema:
 *           type: string
 *           example: 64f123abc456def789012345
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully
 *       400:
 *         description: Invalid doctor ID
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:doctorId",
    getDoctorProfileById
);

export default router;