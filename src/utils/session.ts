import type { Session } from "next-auth";

export type ROLES = "USER" | "MONSTER_CREATOR";

export function hasRole(session: Session | null, role: ROLES): boolean {
  if (session?.user?.roles) {
    return session.user.roles.indexOf(role) >= 0;
  }
  return false;
}
