export interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  normalizedEmail: string;
  normalizedPhone: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const REGISTERED_USERS_KEY = "dripdoggy_registered_users";
const AUTH_SESSION_KEY = "dripdoggy_auth_session";
const MOCK_OTP = "123456";
const SEED_USER_ID = "test-user-1";

export function getMockOtp(): string {
  return MOCK_OTP;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isEmail(value: string): boolean {
  return value.includes("@");
}

export function getRegisteredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: StoredUser[]): void {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function getSessionUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveSessionUser(user: AuthUser): void {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

export function clearSessionUser(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function findUserByIdentifier(identifier: string): StoredUser | null {
  const users = getRegisteredUsers();
  const isEmailInput = isEmail(identifier);
  if (isEmailInput) {
    const normalized = normalizeEmail(identifier);
    return users.find((u) => u.normalizedEmail === normalized) ?? null;
  } else {
    const normalized = normalizePhone(identifier);
    return users.find((u) => u.normalizedPhone === normalized) ?? null;
  }
}

export function emailExists(email: string): boolean {
  const normalized = normalizeEmail(email);
  return getRegisteredUsers().some((u) => u.normalizedEmail === normalized);
}

export function phoneExists(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return getRegisteredUsers().some((u) => u.normalizedPhone === normalized);
}

export function createUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}): StoredUser {
  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    normalizedEmail: normalizeEmail(payload.email),
    normalizedPhone: normalizePhone(payload.phone),
    createdAt: new Date().toISOString(),
  };
  const users = getRegisteredUsers();
  users.push(newUser);
  saveRegisteredUsers(users);
  return newUser;
}

export function toAuthUser(storedUser: StoredUser): AuthUser {
  return {
    id: storedUser.id,
    firstName: storedUser.firstName,
    lastName: storedUser.lastName,
    email: storedUser.email,
    phone: storedUser.phone,
  };
}

export function seedTestUser(): void {
  const users = getRegisteredUsers();
  const alreadySeeded = users.some((u) => u.id === SEED_USER_ID);
  if (alreadySeeded) return;

  const testUser: StoredUser = {
    id: SEED_USER_ID,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "9876543210",
    normalizedEmail: "test@gmail.com",
    normalizedPhone: "9876543210",
    createdAt: new Date().toISOString(),
  };
  users.push(testUser);
  saveRegisteredUsers(users);
}
