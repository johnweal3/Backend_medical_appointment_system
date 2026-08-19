import mongoose, { Document, Schema } from "mongoose";

export interface IDoctorProfile extends Document {
    doctor: mongoose.Types.ObjectId;
    specialty: string;
    experience: number;
    clinicAddress: string;
    consultationFee: number;
    workingHours: {
        from: string;
        to: string;
    };
    availabilityStatus: boolean;
}

const doctorProfileSchema = new Schema<IDoctorProfile>(
    {
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        specialty: {
            type: String,
            required: true,
            trim: true
        },

        experience: {
            type: Number,
            required: true,
            min: 0
        },

        clinicAddress: {
            type: String,
            required: true,
            trim: true
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 0
        },

        workingHours: {
            from: {
                type: String,
                required: true
            },

            to: {
                type: String,
                required: true
            }
        },

        availabilityStatus: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IDoctorProfile>(
    "DoctorProfile",
    doctorProfileSchema
);