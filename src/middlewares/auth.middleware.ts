import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "patient" | "doctor" | "admin";
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  // Accept the token returned by login through the Authorization header.
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      !["patient", "doctor", "admin"].includes(decoded.role)
    ) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }

    // 3. Attach decoded user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role as "patient" | "doctor" | "admin",
    };

    // 4. Move to next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}


export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    // Check if user exists and has a permitted role
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: You do not have access" });
      return;
    }

    next();
  };
}
