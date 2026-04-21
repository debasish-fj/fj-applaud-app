// ─── Shared ───────────────────────────────────────────────────────────────────

export type RatingScore = 1 | 3 | 5;

export type WeekStatus =
  | "DRAFT"
  | "NOMINATION_OPEN"
  | "NOMINATION_CLOSED"
  | "AGGREGATED"
  | "SHORTLIST_PUBLISHED"
  | "VOTING_OPEN"
  | "VOTING_CLOSED"
  | "RESULTS_PUBLISHED"
  | "ARCHIVED";

export type PointEntryType = "WINNER" | "RUNNER_UP" | "PARTICIPATION";

export interface ApiError {
  code?: string;
  detail: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface GoogleLoginResponse {
  key: string;
  is_new_user: boolean;
}

// ─── Users ────────────────────────────────────────────────────────────────────

/** GET /api/users/me/ */
export interface MeResponse {
  name: string;
  url: string;
}

/** GET /api/users/eligible-nominees/ */
export interface EligibleNominee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

/** PATCH /api/users/me/onboard/ — request body */
export interface OnboardRequest {
  first_name: string;
  last_name: string;
}

/** PATCH /api/users/me/onboard/ — response */
export interface OnboardResponse {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
}

// ─── Weeks ────────────────────────────────────────────────────────────────────

/** GET /api/rewards/weeks/current/ */
export interface CurrentWeek {
  week_id: number;
  status: WeekStatus;
  nomination_open_at: string;
  nomination_close_at: string;
  is_nomination_open: boolean;
  has_user_submitted_nomination: boolean;
}

/** GET /api/rewards/weeks/{week_id}/vote-status/ */
export interface VoteStatus {
  has_voted: boolean;
}

// ─── Nominations ──────────────────────────────────────────────────────────────

/** POST /api/rewards/nominations/ — request body */
export interface NominationSubmitRequest {
  week_id: number;
  nominee_id: number;
  justification: string;
  evidence_url?: string;
  impact_rating: RatingScore;
  impact_note: string;
  collaboration_rating: RatingScore;
  collaboration_note: string;
  initiative_rating: RatingScore;
  initiative_note: string;
  values_rating: RatingScore;
  values_note: string;
}

/** PATCH /api/rewards/nominations/{id}/ — request body (all fields optional) */
export type NominationUpdateRequest = Partial<NominationSubmitRequest>;

/** GET /api/rewards/nominations/{id}/ or POST response */
export interface Nomination {
  id: number;
  week_id: number;
  nominee_id: number;
  justification: string;
  evidence_url: string | null;
  created_at: string;
  impact_rating: RatingScore;
  impact_note: string;
  collaboration_rating: RatingScore;
  collaboration_note: string;
  initiative_rating: RatingScore;
  initiative_note: string;
  values_rating: RatingScore;
  values_note: string;
  avg_rating: string;
}

/** GET /api/rewards/nominations/week/{week_id}/public/ */
export interface PublicNomination {
  id: number;
  week_id: number;
  nominee_id: number;
  justification: string;
  evidence_url: string | null;
  created_at: string;
  impact_note: string;
  collaboration_note: string;
  initiative_note: string;
  values_note: string;
}

// ─── Form schema ──────────────────────────────────────────────────────────────

export interface RubricOption {
  value: RatingScore;
  label: string;
}

export interface Rubric {
  prompt: string;
  options: RubricOption[];
}

/** GET /api/rewards/nominations/form-schema/ */
export interface NominationFormSchema {
  q1_prompt: string;
  q2_prompt: string;
  impact_rubric: Rubric;
  collaboration_rubric: Rubric;
  initiative_rubric: Rubric;
  values_rubric: Rubric;
}

// ─── Shortlist ────────────────────────────────────────────────────────────────

/** GET /api/rewards/shortlists/week/{week_id}/ */
export interface ShortlistEntry {
  week_id: number;
  rank: number;
  nominee_id: number;
  first_name: string;
  last_name: string;
}

// ─── Votes ────────────────────────────────────────────────────────────────────

/** POST /api/rewards/votes/ — request body */
export interface VoteSubmitRequest {
  week_id: number;
  nominee_id: number;
}

/** POST /api/rewards/votes/ — response */
export interface Vote {
  id: number;
  week_id: number;
  nominee_id: number;
  created_at: string;
}

// ─── Results ──────────────────────────────────────────────────────────────────

/** POST /api/rewards/results/{week_id}/finalize/ — response */
export interface WinnerResult {
  week_id: number;
  winner_id: number;
  runner_up_id: number | null;
  winner_final_score: string;
  runner_up_final_score: string | null;
  model_version: string;
  created_at: string;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

/** GET /api/rewards/leaderboard/ */
export interface LeaderboardEntry {
  employee_id: number;
  first_name: string;
  last_name: string;
  total_points: number;
}
