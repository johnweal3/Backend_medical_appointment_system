import { Response } from "express";
import DoctorProfile from "../models/doctorProfile.model";
import User from "../models/user.model"; // waiting for this file to complete
import { AuthRequest } from "../middlewares/auth.middleware"; // waiting for this file to complete

// GET /doctors/:doctorId
export const getDoctorProfileById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const profile = await DoctorProfile.findOne({
            doctor: req.params.doctorId
        }).populate("doctor", "fullName email role");

        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get doctor profile"
        });
    }
};

// GET  /doctors
export const getAllDoctors = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { name, specialty } = req.query;

        let doctorIds;

        // Search by doctor name
        if (name) {
            const users = await User.find({
                fullName: {
                    $regex: name as string,
                    $options: "i"
                },
                role: "Doctor"
            }).select("_id");

            doctorIds = users.map((user) => user._id); // waiting for user model

            // No doctors found with this name
            if (doctorIds.length === 0) {
                res.status(200).json([]);
                return;
            }
        }

        // Build DoctorProfile filter
        const filter: any = {};

        if (doctorIds) {
            filter.doctor = { $in: doctorIds };
        }

        // Filter by specialty
        if (specialty) {
            filter.specialty = {
                $regex: specialty as string,
                $options: "i"
            };
        }

        const doctors = await DoctorProfile.find(filter)
            .populate("doctor", "fullName email role");

        res.status(200).json(doctors);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get doctors"
        });
    }
};

// GET /doctors/me
export const getDoctorProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const profile = await DoctorProfile.findOne({
            doctor: req.user!.id
        }).populate("doctor", "fullName email role");

        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get doctor profile"
        });
    }
};


// POST /doctors/me
export const createDoctorProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const existingProfile = await DoctorProfile.findOne({
            doctor: req.user!.id
        });

        if (existingProfile) {
            res.status(409).json({
                message: "Doctor profile already exists"
            });
            return;
        }

        const profile = await DoctorProfile.create({
            doctor: req.user!.id,
            specialty: req.body.specialty,
            experience: req.body.experience,
            clinicAddress: req.body.clinicAddress,
            consultationFee: req.body.consultationFee,
            workingHours: req.body.workingHours,
            availabilityStatus: req.body.availabilityStatus
        });

        res.status(201).json(profile);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create doctor profile"
        });
    }
};


// PATCH /doctors/me
export const updateDoctorProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const profile = await DoctorProfile.findOneAndUpdate(
            {
                doctor: req.user!.id
            },
            {
                $set: {
                    specialty: req.body.specialty,
                    experience: req.body.experience,
                    clinicAddress: req.body.clinicAddress,
                    consultationFee: req.body.consultationFee,
                    workingHours: req.body.workingHours,
                    availabilityStatus: req.body.availabilityStatus
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!profile) {
            res.status(404).json({
                message: "Doctor profile not found"
            });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update doctor profile"
        });
    }
};


// DELETE /doctors/me
export const deleteDoctorProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const profile = await DoctorProfile.findOneAndDelete({
            doctor: req.user!.id
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
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete doctor profile"
        });
    }
};