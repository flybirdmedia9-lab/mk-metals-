export const ROLE_LEVELS = {
  viewer: 1,
  staff: 2,
  manager: 3,
  owner: 4,
}

export function canAccess(userRole, minRole) {
  return (ROLE_LEVELS[userRole] || 0) >= (ROLE_LEVELS[minRole] || 0)
}
