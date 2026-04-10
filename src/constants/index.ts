export const USER_ROLE = {
  USER: 'USER',
  RUNNER: 'RUNNER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
} as const;

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
