import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "umoja_organizer_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getOrganizerSettings() {
  const accessCode = process.env.UMOJA_ORGANIZER_ACCESS_CODE;
  const secret = process.env.UMOJA_SESSION_SECRET;
  const configured = Boolean(
    accessCode && accessCode.length >= 12 && !accessCode.toLowerCase().startsWith("replace") &&
    secret && secret.length >= 32 && !secret.toLowerCase().startsWith("replace"),
  );
  return { accessCode, secret, configured };
}

function equalSecret(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signature(expiresAt: number, secret: string) {
  return createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
}

export function isOrganizerAccessCodeValid(input: string) {
  const { accessCode, configured } = getOrganizerSettings();
  return configured && Boolean(accessCode) && equalSecret(input, accessCode!);
}

export function createOrganizerSessionToken(now = Date.now()) {
  const { secret, configured } = getOrganizerSettings();
  if (!configured || !secret) throw new Error("Organizer access is not configured.");
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
  return `${expiresAt}.${signature(expiresAt, secret)}`;
}

function isSessionTokenValid(token: string | undefined, now = Date.now()) {
  const { secret, configured } = getOrganizerSettings();
  if (!configured || !secret || !token) return false;
  const [expiresAtText, suppliedSignature, ...extra] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (extra.length || !Number.isSafeInteger(expiresAt) || expiresAt <= now || !suppliedSignature) return false;
  const expected = Buffer.from(signature(expiresAt, secret), "hex");
  const supplied = Buffer.from(suppliedSignature, "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function hasOrganizerSession() {
  const cookieStore = await cookies();
  return isSessionTokenValid(cookieStore.get(COOKIE_NAME)?.value);
}

export function organizerSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export const organizerSessionCookieName = COOKIE_NAME;
export function isOrganizerAccessConfigured() {
  return getOrganizerSettings().configured;
}
