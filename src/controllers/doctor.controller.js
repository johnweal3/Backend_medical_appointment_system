"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorProfile = exports.updateDoctorProfile = exports.createDoctorProfile = exports.getDoctorProfile = exports.getAllDoctors = exports.getDoctorProfileById = void 0;
const doctorProfile_model_1 = __importDefault(require("../models/doctorProfile.model"));
const user_model_1 = require("../models/user.model");
// GET /doctors/:doctorId
const getDoctorProfileById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        if (typeof doctorId !== "string" || doctorId.length === 0) {
            res.status(400).json({
                message: "Invalid doctor ID"
            });
            return;
        }
        const profile = await doctorProfile_model_1.default.findOne({
            doctor: doctorId
        }).populate("doctor", "fullName email role");
        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get doctor profile"
        });
    }
};
exports.getDoctorProfileById = getDoctorProfileById;
// GET  /doctors
const getAllDoctors = async (req, res) => {
    try {
        const { name, specialty } = req.query;
        let doctorIds;
        // Search by doctor name
        if (name) {
            const users = await user_model_1.User.find({
                fullName: {
                    $regex: name,
                    $options: "i"
                },
                role: "doctor"
            }).select("_id");
            doctorIds = users.map((user) => user._id); // waiting for user model
            // No doctors found with this name
            if (doctorIds.length === 0) {
                res.status(200).json([]);
                return;
            }
        }
        // Build DoctorProfile filter
        const filter = {};
        if (doctorIds) {
            filter.doctor = { $in: doctorIds };
        }
        // Filter by specialty
        if (specialty) {
            filter.specialty = {
                $regex: specialty,
                $options: "i"
            };
        }
        const doctors = await doctorProfile_model_1.default.find(filter)
            .populate("doctor", "fullName email role");
        res.status(200).json(doctors);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get doctors"
        });
    }
};
exports.getAllDoctors = getAllDoctors;
// GET /doctors/me
const getDoctorProfile = async (req, res) => {
    try {
        const profile = await doctorProfile_model_1.default.findOne({
            doctor: req.user.id
        }).populate("doctor", "fullName email role");
        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get doctor profile"
        });
    }
};
exports.getDoctorProfile = getDoctorProfile;
// POST /doctors/me
const createDoctorProfile = async (req, res) => {
    try {
        const existingProfile = await doctorProfile_model_1.default.findOne({
            doctor: req.user.id
        });
        if (existingProfile) {
            res.status(409).json({
                message: "Doctor profile already exists"
            });
            return;
        }
        const profile = await doctorProfile_model_1.default.create({
            doctor: req.user.id,
            specialty: req.body.specialty,
            experience: req.body.experience,
            clinicAddress: req.body.clinicAddress,
            consultationFee: req.body.consultationFee,
            workingHours: req.body.workingHours,
            availabilityStatus: req.body.availabilityStatus
        });
        res.status(201).json(profile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create doctor profile"
        });
    }
};
exports.createDoctorProfile = createDoctorProfile;
// PATCH /doctors/me
const updateDoctorProfile = async (req, res) => {
    try {
        const profile = await doctorProfile_model_1.default.findOneAndUpdate({
            doctor: req.user.id
        }, {
            $set: {
                specialty: req.body.specialty,
                experience: req.body.experience,
                clinicAddress: req.body.clinicAddress,
                consultationFee: req.body.consultationFee,
                workingHours: req.body.workingHours,
                availabilityStatus: req.body.availabilityStatus
            }
        }, {
            new: true,
            runValidators: true
        });
        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update doctor profile"
        });
    }
};
exports.updateDoctorProfile = updateDoctorProfile;
// DELETE /doctors/me
const deleteDoctorProfile = async (req, res) => {
    try {
        const profile = await doctorProfile_model_1.default.findOneAndDelete({
            doctor: req.user.id
        });
        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }
        res.status(200).json({
            message: "Doctor profile deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete doctor profile"
        });
    }
};
exports.deleteDoctorProfile = deleteDoctorProfile;
//# sourceMappingURL=doctor.controller.js.map