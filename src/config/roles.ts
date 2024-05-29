export enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

const ALL_ROLES = {
  [Role.STUDENT]: ['auth'],
  [Role.INSTRUCTOR]: ['auth'],
  [Role.ADMIN]: ['auth'],
} as const;

const ROLES = Object.keys(ALL_ROLES);

const ROLE_RIGHTS = new Map(Object.entries(ALL_ROLES));

export { ALL_ROLES, ROLES, ROLE_RIGHTS };