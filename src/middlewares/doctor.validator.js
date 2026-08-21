"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDoctorProfileUpdate = exports.validateDoctorProfile = void 0;
const validateDoctorProfile = (req, res, next) => {
    const { specialty, experience, clinicAddress, consultationFee, workingHours, availabilityStatus } = req.body;
    // Validate required fields
    if (specialty === undefined ||
        experience === undefined ||
        clinicAddress === undefined ||
        consultationFee === undefined ||
        workingHours === undefined ||
        availabilityStatus === undefined) {
        res.status(400).json({
            message: "Specialty, experience, clinicAddress, consultationFee, workingHours, and availabilityStatus are required"
        });
        return;
    }
    // Validate specialty
    if (typeof specialty !== "string" ||
        specialty.trim() === "") {
        res.status(400).json({
            message: "Specialty must be a non-empty string"
        });
        return;
    }
    // Validate experience
    if (typeof experience !== "number" ||
        experience < 0) {
        res.status(400).json({
            message: "Experience must be a number greater than or equal to 0"
        });
        return;
    }
    // Validate clinic address
    if (typeof clinicAddress !== "string" ||
        clinicAddress.trim() === "") {
        res.status(400).json({
            message: "Clinic address must be a non-empty string"
        });
        return;
    }
    // Validate consultation fee
    if (typeof consultationFee !== "number" ||
        consultationFee < 0) {
        res.status(400).json({
            message: "Consultation fee must be a number greater than or equal to 0"
        });
        return;
    }
    // Validate working hours
    if (typeof workingHours !== "object" ||
        workingHours === null ||
        Array.isArray(workingHours)) {
        res.status(400).json({
            message: "Working hours must be an object"
        });
        return;
    }
    // Validate working hours "from"
    if (typeof workingHours.from !== "string" ||
        workingHours.from.trim() === "") {
        res.status(400).json({
            message: "Working hours 'from' is required"
        });
        return;
    }
    // Validate working hours "to"
    if (typeof workingHours.to !== "string" ||
        workingHours.to.trim() === "") {
        res.status(400).json({
            message: "Working hours 'to' is required"
        });
        return;
    }
    // Validate availability status
    if (typeof availabilityStatus !== "boolean") {
        res.status(400).json({
            message: "Availability status must be a boolean"
        });
        return;
    }
    next();
};
exports.validateDoctorProfile = validateDoctorProfile;
const validateDoctorProfileUpdate = (req, res, next) => {
    const { specialty, experience, clinicAddress, consultationFee, workingHours, availabilityStatus } = req.body;
    // Validate specialty
    if (specialty !== undefined &&
        (typeof specialty !== "string" || specialty.trim() === "")) {
        res.status(400).json({
            message: "Specialty must be a non-empty string"
        });
        return;
    }
    // Validate experience
    if (experience !== undefined &&
        (typeof experience !== "number" || experience < 0)) {
        res.status(400).json({
            message: "Experience must be a number greater than or equal to 0"
        });
        return;
    }
    // Validate clinic address
    if (clinicAddress !== undefined &&
        (typeof clinicAddress !== "string" || clinicAddress.trim() === "")) {
        res.status(400).json({
            message: "Clinic address must be a non-empty string"
        });
        return;
    }
    // Validate consultation fee
    if (consultationFee !== undefined &&
        (typeof consultationFee !== "number" || consultationFee < 0)) {
        res.status(400).json({
            message: "Consultation fee must be a number greater than or equal to 0"
        });
        return;
    }
    // Validate working hours
    if (workingHours !== undefined) {
        if (typeof workingHours !== "object" || workingHours === null) {
            res.status(400).json({
                message: "Working hours must be an object"
            });
            return;
        }
        if (typeof workingHours.from !== "string" ||
            workingHours.from.trim() === "") {
            res.status(400).json({
                message: "Working hours 'from' is required"
            });
            return;
        }
        if (typeof workingHours.to !== "string" ||
            workingHours.to.trim() === "") {
            res.status(400).json({
                message: "Working hours 'to' is required"
            });
            return;
        }
    }
    // Validate availability status
    if (availabilityStatus !== undefined &&
        typeof availabilityStatus !== "boolean") {
        res.status(400).json({
            message: "Availability status must be a boolean"
        });
        return;
    }
    next();
};
exports.validateDoctorProfileUpdate = validateDoctorProfileUpdate;
//# sourceMappingURL=doctor.validator.js.map