import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function protect(req: Request, res: Response, next: NextFunction): void {
  // 1. Get token from cookies
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super-secret-key-12345");

    // 3. Attach decoded user info to request
    (req as any).user = decoded;

    // 4. Move to next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}


export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    // Check if user exists and has a permitted role
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: You do not have access" });
      return;
    }

    next();
  };
}