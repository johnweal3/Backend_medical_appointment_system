/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - doctorId
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *       properties:
 *         doctorId:
 *           type: string
 *           description: ID of the doctor
 *         dayOfWeek:
 *           type: string
 *           enum:
 *             - Sunday
 *             - Monday
 *             - Tuesday
 *             - Wednesday
 *             - Thursday
 *             - Friday
 *             - Saturday
 *           description: Day of the week
 *         startTime:
 *           type: string
 *           description: Start time of the schedule
 *         endTime:
 *           type: string
 *           description: End time of the schedule
 *         slotDuration:
 *           type: number
 *           description: Duration of each appointment slot in minutes
 *           default: 30
 *         availability:
 *           type: boolean
 *           description: Indicates whether the schedule is available
 *           default: true
 *       example:
 *         doctorId: "doctor123"
 *         dayOfWeek: "Monday"
 *         startTime: "09:00"
 *         endTime: "15:00"
 *         slotDuration: 30
 *         availability: true
 */
/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: APIs for managing doctors schedules
 */
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=schedule.routes.d.ts.map