import { Request, Response } from "express";
export declare const createAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAppointments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAppointmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDoctorAppointments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPatientAppointments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAppointmentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=appointment.controller.d.ts.map