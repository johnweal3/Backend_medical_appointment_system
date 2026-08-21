import { Request, Response, NextFunction } from "express";
export declare function protect(req: Request, res: Response, next: NextFunction): void;
export declare function authorize(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map