import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "patient" | "doctor" | "admin";
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  // 1. Extract Authorization header regardless of casing
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;

  let token: string | undefined;
  if (authHeader) {
    const parts = authHeader.trim().split(" ");
    // Check for "Bearer <token>" case-insensitively
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // 2. Return 401 if token is missing
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    // 3. Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    // Validate payload structure
    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      !["patient", "doctor", "admin"].includes(decoded.role)
    ) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }

    // 4. Attach decoded user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role as "patient" | "doctor" | "admin",
    };

    // 5. Pass to next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    // Check if user exists on request and has a permitted role
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: You do not have access" });
      return;
    }

    next();
  };
}
