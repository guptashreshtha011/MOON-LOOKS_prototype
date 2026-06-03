import { User } from "../models";

// Client-side route-guard & authorization controls
export function isUserAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isUserClient(user: User | null): boolean {
  return user?.role === "client";
}

export function isEmailVerified(user: User | null): boolean {
  return user?.emailVerified === true;
}
