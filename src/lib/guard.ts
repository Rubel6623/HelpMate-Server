import AppError from "../errors/AppError";

export function requireRole(user: any, role: string) {
  if (user.role !== role) {
    throw new AppError(403, "Unauthorized: Insufficient role");
  }
}
