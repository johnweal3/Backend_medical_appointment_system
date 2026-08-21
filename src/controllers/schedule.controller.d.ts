import { Request, Response } from "express";
export declare const createSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSchedules: (req: Request, res: Response) => Promise<void>;
export declare const getScheduleById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDoctorSchedules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=schedule.controller.d.ts.map