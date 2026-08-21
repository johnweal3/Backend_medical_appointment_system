import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IDoctorProfile, {}, {}, {}, Document<unknown, {}, IDoctorProfile, {}, mongoose.DefaultSchemaOptions> & IDoctorProfile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDoctorProfile>;
export default _default;
//# sourceMappingURL=doctorProfile.model.d.ts.map