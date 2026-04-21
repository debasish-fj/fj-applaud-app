import axios from "axios";
import type {
  CurrentWeek,
  EligibleNominee,
  GoogleLoginResponse,
  LeaderboardEntry,
  MeResponse,
  Nomination,
  NominationFormSchema,
  NominationSubmitRequest,
  NominationUpdateRequest,
  OnboardRequest,
  OnboardResponse,
  PublicNomination,
  ShortlistEntry,
  Vote,
  VoteStatus,
  VoteSubmitRequest,
  WinnerResult,
} from "./api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Direct client — used only server-side (e.g. src/auth.ts during sign-in).
 * Never call this from a client component.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Proxy client — all client-side calls go through /api/proxy/...
 * The proxy route injects the backend token server-side; the browser never
 * sees or sends the DRF token.
 */
const proxyClient = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
});

// ─── Auth (server-side only) ──────────────────────────────────────────────────

/**
 * Exchange a Google OAuth access token for a backend session token.
 * Called server-side from src/auth.ts during sign-in — uses direct client.
 * POST /api/auth/google/
 */
export async function googleLogin(
  accessToken: string,
): Promise<GoogleLoginResponse> {
  console.log("[googleLogin] hitting:", apiClient.defaults.baseURL + "/api/auth/google/");
  const { data } = await apiClient.post<GoogleLoginResponse>(
    "/api/auth/google/",
    { access_token: accessToken },
  );
  console.log("[googleLogin] response:", data);
  return data;
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user's profile.
 * GET /api/users/me/
 */
export async function getMe(): Promise<MeResponse> {
  const { data } = await proxyClient.get<MeResponse>("/api/users/me/");
  return data;
}

/**
 * List all eligible nominees (everyone except the requesting user).
 * GET /api/users/eligible-nominees/
 */
export async function getEligibleNominees(): Promise<EligibleNominee[]> {
  const { data } = await proxyClient.get<EligibleNominee[]>(
    "/api/users/eligible-nominees/",
  );
  return data;
}

/**
 * Complete one-time user onboarding (set first & last name).
 * PATCH /api/users/me/onboard/
 */
export async function onboardUser(
  body: OnboardRequest,
): Promise<OnboardResponse> {
  const { data } = await proxyClient.patch<OnboardResponse>(
    "/api/users/me/onboard/",
    body,
  );
  return data;
}

// ─── Weeks ────────────────────────────────────────────────────────────────────

/**
 * Get the currently active week.
 * GET /api/rewards/weeks/current/
 */
export async function getCurrentWeek(): Promise<CurrentWeek> {
  const { data } = await proxyClient.get<CurrentWeek>(
    "/api/rewards/weeks/current/",
  );
  return data;
}

/**
 * Get the authenticated user's vote status for a specific week.
 * GET /api/rewards/weeks/{weekId}/vote-status/
 */
export async function getVoteStatus(weekId: number): Promise<VoteStatus> {
  const { data } = await proxyClient.get<VoteStatus>(
    `/api/rewards/weeks/${weekId}/vote-status/`,
  );
  return data;
}

// ─── Nominations ──────────────────────────────────────────────────────────────

/**
 * Submit a nomination for the current week.
 * POST /api/rewards/nominations/
 */
export async function submitNomination(
  body: NominationSubmitRequest,
): Promise<Nomination> {
  const { data } = await proxyClient.post<Nomination>(
    "/api/rewards/nominations/",
    body,
  );
  return data;
}

/**
 * Update an existing nomination while the week is still open.
 * PATCH /api/rewards/nominations/{nominationId}/
 */
export async function updateNomination(
  nominationId: number,
  body: NominationUpdateRequest,
): Promise<Nomination> {
  const { data } = await proxyClient.patch<Nomination>(
    `/api/rewards/nominations/${nominationId}/`,
    body,
  );
  return data;
}

/**
 * Get the authenticated user's nomination for the current week.
 * GET /api/rewards/nominations/me/current/
 */
export async function getMyCurrentNomination(): Promise<Nomination> {
  const { data } = await proxyClient.get<Nomination>(
    "/api/rewards/nominations/me/current/",
  );
  return data;
}

/**
 * List anonymised nominations for a given week (visible after shortlist is published).
 * GET /api/rewards/nominations/week/{weekId}/public/
 */
export async function getPublicNominations(
  weekId: number,
): Promise<PublicNomination[]> {
  const { data } = await proxyClient.get<PublicNomination[]>(
    `/api/rewards/nominations/week/${weekId}/public/`,
  );
  return data;
}

/**
 * Get the static nomination form schema (prompts & rubric labels).
 * GET /api/rewards/nominations/form-schema/
 */
export async function getNominationFormSchema(): Promise<NominationFormSchema> {
  const { data } = await proxyClient.get<NominationFormSchema>(
    "/api/rewards/nominations/form-schema/",
  );
  return data;
}

// ─── Shortlist ────────────────────────────────────────────────────────────────

/**
 * Get the published shortlist for a week.
 * GET /api/rewards/shortlists/week/{weekId}/
 */
export async function getShortlist(weekId: number): Promise<ShortlistEntry[]> {
  const { data } = await proxyClient.get<ShortlistEntry[]>(
    `/api/rewards/shortlists/week/${weekId}/`,
  );
  return data;
}

// ─── Votes ────────────────────────────────────────────────────────────────────

/**
 * Cast a vote for a shortlisted nominee.
 * POST /api/rewards/votes/
 */
export async function castVote(body: VoteSubmitRequest): Promise<Vote> {
  const { data } = await proxyClient.post<Vote>("/api/rewards/votes/", body);
  return data;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

/**
 * Get the cumulative points leaderboard across all published weeks.
 * GET /api/rewards/leaderboard/
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await proxyClient.get<LeaderboardEntry[]>(
    "/api/rewards/leaderboard/",
  );
  return data;
}

// ─── Admin-only ───────────────────────────────────────────────────────────────

/**
 * Aggregate nominations into a shortlist for a week (admin only).
 * POST /api/rewards/shortlists/{weekId}/aggregate/
 */
export async function aggregateShortlist(
  weekId: number,
): Promise<ShortlistEntry[]> {
  const { data } = await proxyClient.post<ShortlistEntry[]>(
    `/api/rewards/shortlists/${weekId}/aggregate/`,
    {},
  );
  return data;
}

/**
 * Finalize results and assign points for a week (admin only).
 * POST /api/rewards/results/{weekId}/finalize/
 */
export async function finalizeResults(weekId: number): Promise<WinnerResult> {
  const { data } = await proxyClient.post<WinnerResult>(
    `/api/rewards/results/${weekId}/finalize/`,
    {},
  );
  return data;
}
