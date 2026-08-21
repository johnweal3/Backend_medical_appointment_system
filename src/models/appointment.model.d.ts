import mongoose from "mongoose";
export declare const Appointment: mongoose.Model<{
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    status: "Cancelled" | "Completed" | "Confirmed" | "Pending";
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=appointment.model.d.ts.map