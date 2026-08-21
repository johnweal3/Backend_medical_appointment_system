import mongoose from "mongoose";
export declare const Schedule: mongoose.Model<{
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
}, mongoose.Document<unknown, {}, {
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    doctorId: string;
    dayOfWeek: "Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday";
    startTime: string;
    endTime: string;
    slotDuration: number;
    availability: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=schedule.model.d.ts.map