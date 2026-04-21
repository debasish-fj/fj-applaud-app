"use client";

import {
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  HStack,
  Portal,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuThumbsUp, LuLock } from "react-icons/lu";
import { useTheme } from "../context/theme";
import { useSession } from "next-auth/react";
import {
  getCurrentWeek,
  getVoteStatus,
  getShortlist,
  getPublicNominations,
  castVote,
} from "../lib/api";
import type {
  CurrentWeek,
  ShortlistEntry,
  PublicNomination,
} from "../lib/api-types";

const AVATAR_PALETTE_DARK = [
  {
    bg: "rgba(139,92,246,0.2)",
    border: "rgba(139,92,246,0.4)",
    text: "#c4b5fd",
  },
  {
    bg: "rgba(59,130,246,0.2)",
    border: "rgba(59,130,246,0.4)",
    text: "#93c5fd",
  },
  {
    bg: "rgba(16,185,129,0.2)",
    border: "rgba(16,185,129,0.4)",
    text: "#6ee7b7",
  },
  {
    bg: "rgba(249,115,22,0.2)",
    border: "rgba(249,115,22,0.4)",
    text: "#fdba74",
  },
  {
    bg: "rgba(236,72,153,0.2)",
    border: "rgba(236,72,153,0.4)",
    text: "#f9a8d4",
  },
];

const AVATAR_PALETTE_LIGHT = [
  {
    bg: "rgba(109,40,217,0.1)",
    border: "rgba(109,40,217,0.35)",
    text: "#6d28d9",
  },
  {
    bg: "rgba(37,99,235,0.1)",
    border: "rgba(37,99,235,0.35)",
    text: "#1d4ed8",
  },
  { bg: "rgba(4,120,87,0.1)", border: "rgba(4,120,87,0.3)", text: "#065f46" },
  { bg: "rgba(194,65,12,0.1)", border: "rgba(194,65,12,0.3)", text: "#c2440e" },
  { bg: "rgba(157,23,77,0.1)", border: "rgba(157,23,77,0.3)", text: "#9d174d" },
];

function useWindowSize() {
  const [size, setSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function getAggregatedFeedback(
  nomineeId: number,
  nominations: PublicNomination[],
) {
  const filtered = nominations.filter((n) => n.nominee_id === nomineeId);
  if (filtered.length === 0) return null;
  return {
    combinedFeedback: filtered
      .map((n) => n.justification)
      .filter(Boolean)
      .join("\n\n"),
    impact:
      filtered
        .map((n) => n.impact_note)
        .filter(Boolean)
        .join(" · ") || "—",
    collaboration:
      filtered
        .map((n) => n.collaboration_note)
        .filter(Boolean)
        .join(" · ") || "—",
    initiatives:
      filtered
        .map((n) => n.initiative_note)
        .filter(Boolean)
        .join(" · ") || "—",
    values:
      filtered
        .map((n) => n.values_note)
        .filter(Boolean)
        .join(" · ") || "—",
  };
}

/* ─── Types ─────────────────────────────────────────────────────── */

type FeedbackKey =
  | "combinedFeedback"
  | "impact"
  | "collaboration"
  | "initiatives"
  | "values";

const FEEDBACK_SECTIONS: { key: FeedbackKey; label: string }[] = [
  { key: "impact", label: "Impact" },
  { key: "collaboration", label: "Collaboration" },
  { key: "initiatives", label: "Initiatives" },
  { key: "values", label: "Values" },
];

/* ─── Framer variants ──────────────────────────────────────────── */

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: "easeOut" as const },
  },
};

/* ─── Skeleton ─────────────────────────────────────────────────── */

function CandidateSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderColor="var(--bdr-1)"
      borderRadius="14px"
      px="5"
      py="4"
      bg="var(--sur-2)"
      style={{ opacity: 0.5 }}
    >
      <Flex align="center" gap="4">
        <Box w="18px" h="18px" borderRadius="full" bg="var(--bdr-2)" />
        <Box w="40px" h="40px" borderRadius="10px" bg="var(--bdr-2)" />
        <Box>
          <Box
            h="12px"
            w="120px"
            bg="var(--bdr-2)"
            borderRadius="6px"
            mb="1.5"
          />
          <Box h="10px" w="80px" bg="var(--bdr-1)" borderRadius="6px" />
        </Box>
      </Flex>
    </Box>
  );
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function VoteClient() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const AVATAR_PALETTE =
    theme === "dark" ? AVATAR_PALETTE_DARK : AVATAR_PALETTE_LIGHT;

  const [currentWeek, setCurrentWeek] = useState<CurrentWeek | null>(null);
  const [candidates, setCandidates] = useState<ShortlistEntry[]>([]);
  const [publicNominations, setPublicNominations] = useState<
    PublicNomination[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [votingNotOpen, setVotingNotOpen] = useState(false);
  const [noActiveWeek, setNoActiveWeek] = useState(false);

  const [selected, setSelected] = useState<string>("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackNomineeId, setFeedbackNomineeId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const windowSize = useWindowSize();

  useEffect(() => {
    async function load() {
      try {
        const week = await getCurrentWeek();
        setCurrentWeek(week);

        const isVotingOpen =
          week.status === "VOTING_OPEN" ||
          week.status === "SHORTLIST_PUBLISHED";

        if (!isVotingOpen) {
          setVotingNotOpen(true);
          return;
        }

        const [voteStatus, shortlist, nominations] = await Promise.all([
          getVoteStatus(week.week_id),
          getShortlist(week.week_id),
          getPublicNominations(week.week_id),
        ]);

        if (voteStatus.has_voted) {
          setAlreadyVoted(true);
          return;
        }

        setCandidates(shortlist);
        setPublicNominations(nominations);
        if (shortlist.length > 0) {
          setSelected(String(shortlist[0].nominee_id));
        }
      } catch (err: unknown) {
        const e = err as { response?: { status: number } };
        if (e.response?.status === 404) {
          setNoActiveWeek(true);
        } else {
          setPageError("Could not load voting data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSubmit = async () => {
    if (!currentWeek || !selected) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await castVote({
        week_id: currentWeek.week_id,
        nominee_id: Number(selected),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setSubmitError(
        e.response?.data?.detail ?? "Failed to cast vote. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFeedback = (nomineeId: number) => {
    setFeedbackNomineeId(nomineeId);
    setFeedbackOpen(true);
  };
  const closeFeedback = () => {
    setFeedbackOpen(false);
    setFeedbackNomineeId(null);
  };

  const selectedCandidate = candidates.find(
    (c) => String(c.nominee_id) === selected,
  );
  const selectedIdx = candidates.findIndex(
    (c) => String(c.nominee_id) === selected,
  );
  const selectedAvatar =
    selectedIdx >= 0 ? AVATAR_PALETTE[selectedIdx] : AVATAR_PALETTE[0];

  const feedbackCandidate = feedbackNomineeId
    ? candidates.find((c) => c.nominee_id === feedbackNomineeId)
    : null;
  const feedbackIdx = feedbackCandidate
    ? candidates.findIndex((c) => c.nominee_id === feedbackNomineeId)
    : -1;
  const feedbackAvatar =
    feedbackIdx >= 0 ? AVATAR_PALETTE[feedbackIdx] : AVATAR_PALETTE[0];
  const feedback = feedbackNomineeId
    ? getAggregatedFeedback(feedbackNomineeId, publicNominations)
    : null;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  /* ── Non-voting states ── */

  if (loading) {
    return (
      <Box minH="100vh" color="var(--fg-1)">
        <Container maxW="2xl" px="6" pt="12" pb="2">
          <Flex align="center" gap="4">
            <Flex
              w="48px"
              h="48px"
              borderRadius="14px"
              bg="var(--app-accent-muted)"
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              align="center"
              justify="center"
              flexShrink={0}
              style={{
                boxShadow: "var(--shadow-accent)",
                color: "var(--app-accent)",
              }}
            >
              <LuThumbsUp size={22} />
            </Flex>
            <Box>
              <Heading
                fontSize="28px"
                fontWeight="800"
                letterSpacing="-0.03em"
                color="var(--fg-1)"
                lineHeight="1.15"
                mb="1"
              >
                Cast Your Vote
              </Heading>
              <Text
                color="var(--fg-3)"
                fontSize="sm"
                lineHeight="1.5"
                fontWeight="500"
              >
                Loading candidates…
              </Text>
            </Box>
          </Flex>
        </Container>
        <Container maxW="2xl" py="6" px="6">
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="var(--bdr-1)"
            borderRadius="18px"
            px={{ base: "4", md: "6" }}
            py={{ base: "5", md: "6" }}
            style={{
              boxShadow:
                theme === "dark"
                  ? "0 1px 3px rgba(0,0,0,0.3)"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Flex direction="column" gap="2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <CandidateSkeleton key={i} />
              ))}
            </Flex>
          </Box>
        </Container>
      </Box>
    );
  }

  if (noActiveWeek || votingNotOpen || pageError) {
    return (
      <Box minH="100vh" color="var(--fg-1)">
        <Container maxW="2xl" px="6" pt="12" pb="2">
          <Flex align="center" gap="4">
            <Flex
              w="48px"
              h="48px"
              borderRadius="14px"
              bg="var(--app-accent-muted)"
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              align="center"
              justify="center"
              flexShrink={0}
              style={{
                boxShadow: "var(--shadow-accent)",
                color: "var(--app-accent)",
              }}
            >
              <LuThumbsUp size={22} />
            </Flex>
            <Box>
              <Heading
                fontSize="28px"
                fontWeight="800"
                letterSpacing="-0.03em"
                color="var(--fg-1)"
                lineHeight="1.15"
                mb="1"
              >
                Cast Your Vote
              </Heading>
              <Text
                color="var(--fg-3)"
                fontSize="sm"
                lineHeight="1.5"
                fontWeight="500"
              >
                {noActiveWeek ? "No active week" : "Not yet open"}
              </Text>
            </Box>
          </Flex>
        </Container>
        <Container maxW="2xl" py="6" px="6">
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="var(--bdr-1)"
            borderRadius="18px"
            px={{ base: "5", md: "8" }}
            py={{ base: "8", md: "10" }}
            textAlign="center"
          >
            <Text fontSize="32px" mb="4">
              🗳️
            </Text>
            <Text fontWeight="700" fontSize="md" color="var(--fg-1)" mb="2">
              {pageError
                ? "Something went wrong"
                : noActiveWeek
                  ? "No active polls right now"
                  : "Voting isn't open yet"}
            </Text>
            <Text
              fontSize="sm"
              color="var(--fg-3)"
              lineHeight="1.7"
              maxW="320px"
              mx="auto"
            >
              {pageError ??
                (noActiveWeek
                  ? "Check back soon — a new cycle will begin shortly."
                  : "Once nominations close and the shortlist is published, you'll be able to vote here.")}
            </Text>
            <Link href="/">
              <Button
                mt="6"
                h="40px"
                px="6"
                borderRadius="10px"
                variant="outline"
                borderColor="var(--bdr-2)"
                color="var(--fg-2)"
                fontSize="sm"
                fontWeight="600"
                _hover={{
                  borderColor: "var(--app-accent-border)",
                  color: "var(--app-accent)",
                  bg: "var(--app-accent-muted)",
                }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }

  if (alreadyVoted) {
    return (
      <Box minH="100vh" color="var(--fg-1)">
        <Container maxW="2xl" px="6" pt="12" pb="2">
          <Flex align="center" gap="4">
            <Flex
              w="48px"
              h="48px"
              borderRadius="14px"
              bg="var(--app-accent-muted)"
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              align="center"
              justify="center"
              flexShrink={0}
              style={{
                boxShadow: "var(--shadow-accent)",
                color: "var(--app-accent)",
              }}
            >
              <LuLock size={22} />
            </Flex>
            <Box>
              <Heading
                fontSize="28px"
                fontWeight="800"
                letterSpacing="-0.03em"
                color="var(--fg-1)"
                lineHeight="1.15"
                mb="1"
              >
                Vote Recorded
              </Heading>
              <Text
                color="var(--fg-3)"
                fontSize="sm"
                lineHeight="1.5"
                fontWeight="500"
              >
                Hi {firstName} — you've already voted this week
              </Text>
            </Box>
          </Flex>
        </Container>
        <Container maxW="2xl" py="6" px="6">
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="var(--app-accent-border)"
            borderRadius="18px"
            px={{ base: "5", md: "8" }}
            py={{ base: "8", md: "10" }}
            textAlign="center"
          >
            <Text fontSize="64px" mb="3" display="inline-block">
              🏆
            </Text>
            <Text
              fontSize="10px"
              fontWeight="700"
              color="var(--app-accent)"
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb="2"
            >
              Vote Submitted
            </Text>
            <Text
              fontSize="20px"
              fontWeight="700"
              letterSpacing="-0.02em"
              color="var(--fg-1)"
              lineHeight="1.25"
              mb="3"
            >
              Your vote has been recorded
            </Text>
            <Text
              fontSize="13px"
              color="var(--fg-2)"
              lineHeight="1.75"
              mb="7"
              maxW="300px"
              mx="auto"
            >
              Results will be announced at the end of the week. Thanks for
              participating!
            </Text>
            <VStack gap="3">
              <Link
                href="/leaderboard"
                style={{ width: "100%", maxWidth: "320px" }}
              >
                <Button
                  w="full"
                  h="44px"
                  bg="var(--app-accent)"
                  color="white"
                  borderRadius="10px"
                  fontWeight="600"
                  fontSize="sm"
                  _hover={{
                    bg: "var(--app-accent-hover)",
                    transform: "translateY(-1px)",
                    boxShadow: "var(--shadow-accent)",
                  }}
                  _active={{ transform: "scale(0.97)" }}
                  transition="all 0.2s"
                >
                  View Leaderboard →
                </Button>
              </Link>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  /* ── Main voting UI ── */
  return (
    <Box minH="100vh" color="var(--fg-1)">
      {/* Page header */}
      <Container maxW="2xl" px="6" pt="12" pb="2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Flex align="center" gap="4">
            <Flex
              w="48px"
              h="48px"
              borderRadius="14px"
              bg="var(--app-accent-muted)"
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              align="center"
              justify="center"
              flexShrink={0}
              style={{
                boxShadow: "var(--shadow-accent)",
                color: "var(--app-accent)",
              }}
            >
              <LuThumbsUp size={22} />
            </Flex>
            <Box>
              <Heading
                fontSize="28px"
                fontWeight="800"
                letterSpacing="-0.03em"
                color="var(--fg-1)"
                lineHeight="1.15"
                mb="1"
              >
                Cast Your Vote
              </Heading>
              <Text
                color="var(--fg-3)"
                fontSize="sm"
                lineHeight="1.5"
                fontWeight="500"
              >
                Hi {firstName} — choose your nominee for this week
              </Text>
            </Box>
          </Flex>
        </motion.div>
      </Container>

      {/* Candidate card */}
      <Container maxW="2xl" py="6" px="6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
        >
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="var(--bdr-1)"
            borderRadius="18px"
            px={{ base: "4", md: "6" }}
            py={{ base: "5", md: "6" }}
            position="relative"
            overflow="hidden"
            style={{
              boxShadow:
                theme === "dark"
                  ? "0 1px 3px rgba(0,0,0,0.3), 0 8px 32px -8px rgba(0,0,0,0.35)"
                  : "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px -8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Top accent line */}
            <Box
              position="absolute"
              top={0}
              left="10%"
              right="10%"
              h="1px"
              pointerEvents="none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--app-accent-border) 40%, var(--app-accent) 50%, var(--app-accent-border) 60%, transparent)",
                opacity: 0.6,
              }}
            />

            {/* Empty shortlist */}
            {candidates.length === 0 && (
              <Flex align="center" justify="center" py="12">
                <Text color="var(--fg-3)" fontSize="sm">
                  The shortlist hasn&apos;t been published yet.
                </Text>
              </Flex>
            )}

            {/* Candidate list */}
            {candidates.length > 0 && (
              <RadioGroup.Root
                value={selected}
                onValueChange={(e) => setSelected(e.value ?? "")}
              >
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {candidates.map((candidate, idx) => {
                    const isSelected =
                      selected === String(candidate.nominee_id);
                    const avatar = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                    const fullName = `${candidate.first_name} ${candidate.last_name}`;
                    const initials = `${candidate.first_name[0] ?? ""}${candidate.last_name[0] ?? ""}`;
                    const hasFeedback = publicNominations.some(
                      (n) => n.nominee_id === candidate.nominee_id,
                    );

                    return (
                      <motion.div
                        key={candidate.nominee_id}
                        variants={cardVariants}
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.975 }}
                        style={{ borderRadius: "14px" }}
                      >
                        <Box
                          borderWidth="1px"
                          borderColor={
                            isSelected ? "rgba(200,152,46,0.5)" : "var(--bdr-1)"
                          }
                          borderRadius="14px"
                          px="5"
                          py="4"
                          bg={
                            isSelected
                              ? "var(--app-accent-muted)"
                              : theme === "dark"
                                ? "var(--sur-2)"
                                : "white"
                          }
                          boxShadow={
                            isSelected
                              ? "0 0 0 1px rgba(200,152,46,0.25), 0 4px 20px -4px rgba(200,152,46,0.15)"
                              : theme === "dark"
                                ? "0 1px 3px rgba(0,0,0,0.15)"
                                : "0 1px 3px rgba(0,0,0,0.03)"
                          }
                          transition="all 0.2s ease"
                          cursor="pointer"
                        >
                          <Flex justify="space-between" align="center" gap="4">
                            <RadioGroup.Item
                              value={String(candidate.nominee_id)}
                              cursor="pointer"
                              flex="1"
                              minW={0}
                            >
                              <HStack gap="4" minW={0}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator flexShrink={0} />
                                <Flex
                                  w="40px"
                                  h="40px"
                                  borderRadius="10px"
                                  bg={avatar.bg}
                                  borderWidth="1px"
                                  borderColor={avatar.border}
                                  align="center"
                                  justify="center"
                                  flexShrink={0}
                                >
                                  <Text
                                    fontSize="xs"
                                    fontWeight="700"
                                    color={avatar.text}
                                    letterSpacing="0.05em"
                                  >
                                    {initials}
                                  </Text>
                                </Flex>
                                <Box minW={0}>
                                  <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="var(--fg-1)"
                                    lineHeight="1.3"
                                  >
                                    {fullName}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    color="var(--fg-4)"
                                    mt="0.5"
                                    fontWeight="500"
                                  >
                                    Rank #{candidate.rank}
                                  </Text>
                                </Box>
                              </HStack>
                            </RadioGroup.Item>

                            {hasFeedback && (
                              <Button
                                size="sm"
                                variant="outline"
                                borderColor="var(--app-accent-border)"
                                color="var(--app-accent)"
                                borderRadius="8px"
                                fontSize="xs"
                                fontWeight="500"
                                h="32px"
                                px="3.5"
                                bg="var(--app-accent-muted)"
                                _hover={{
                                  borderColor: "var(--app-accent)",
                                  bg: "var(--app-accent-muted)",
                                  color: "var(--app-accent)",
                                  transform: "translateY(-1px)",
                                  boxShadow:
                                    theme === "dark"
                                      ? "0 2px 8px -2px rgba(200,152,46,0.2)"
                                      : "0 2px 8px -2px rgba(200,152,46,0.12)",
                                }}
                                flexShrink={0}
                                transition="all 0.2s ease"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openFeedback(candidate.nominee_id);
                                }}
                              >
                                Team feedback
                              </Button>
                            )}
                          </Flex>
                        </Box>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </RadioGroup.Root>
            )}

            {/* Submit */}
            {candidates.length > 0 && (
              <Flex
                justify="flex-end"
                mt="6"
                pt="5"
                borderTopWidth="1px"
                borderColor="var(--bdr-1)"
                direction="column"
                align="flex-end"
                gap="2"
              >
                {submitError && (
                  <Text fontSize="xs" color="red.400">
                    {submitError}
                  </Text>
                )}
                <Button
                  bg="var(--app-accent)"
                  color="white"
                  borderRadius="12px"
                  h="48px"
                  px="10"
                  fontWeight="600"
                  fontSize="sm"
                  _hover={{
                    bg: "var(--app-accent-hover)",
                    transform: "translateY(-2px)",
                    boxShadow: "var(--shadow-accent)",
                  }}
                  _active={{ transform: "scale(0.97)" }}
                  transition="all 0.2s"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selected}
                >
                  {isSubmitting ? (
                    <Flex align="center" gap="2">
                      <span className="spinner" />
                      Casting vote…
                    </Flex>
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
              </Flex>
            )}
          </Box>
        </motion.div>
      </Container>

      {/* Team feedback modal */}
      <Dialog.Root
        open={feedbackOpen}
        onOpenChange={(e) => !e.open && closeFeedback()}
        size="lg"
        lazyMount
        scrollBehavior="inside"
      >
        <Portal>
          <Dialog.Backdrop bg="var(--overlay-bg)" backdropFilter="blur(6px)" />
          <Dialog.Positioner>
            <Dialog.Content
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              borderRadius="18px"
              maxH="90vh"
              boxShadow="var(--shadow-dropdown)"
              className="animate-springUp"
              style={{ background: "var(--sur-modal)" }}
            >
              <Dialog.CloseTrigger
                position="absolute"
                top="4"
                right="4"
                zIndex="10"
                asChild
              >
                <CloseButton
                  size="sm"
                  color="var(--fg-3)"
                  _hover={{ color: "var(--fg-1)", bg: "var(--sur-3)" }}
                  borderRadius="8px"
                />
              </Dialog.CloseTrigger>
              <Dialog.Body overflowY="auto" py="8" px="7">
                {feedbackCandidate && (
                  <VStack align="stretch" gap="5">
                    {/* Header */}
                    <Flex align="center" gap="4" pb="1">
                      <Flex
                        w="46px"
                        h="46px"
                        borderRadius="12px"
                        bg={feedbackAvatar.bg}
                        borderWidth="1px"
                        borderColor={feedbackAvatar.border}
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="700"
                          color={feedbackAvatar.text}
                          letterSpacing="0.05em"
                        >
                          {`${feedbackCandidate.first_name[0] ?? ""}${feedbackCandidate.last_name[0] ?? ""}`}
                        </Text>
                      </Flex>
                      <Box>
                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          color="var(--app-accent)"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          mb="0.5"
                        >
                          Team Feedback
                        </Text>
                        <Heading
                          fontSize="18px"
                          fontWeight="700"
                          letterSpacing="-0.02em"
                          color="var(--fg-1)"
                        >
                          {feedbackCandidate.first_name}{" "}
                          {feedbackCandidate.last_name}
                        </Heading>
                      </Box>
                    </Flex>

                    <Box
                      h="1px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, var(--bdr-1) 20%, var(--bdr-1) 80%, transparent)",
                      }}
                    />

                    {/* No feedback fallback */}
                    {!feedback && (
                      <Text
                        color="var(--fg-3)"
                        fontSize="sm"
                        textAlign="center"
                        py="4"
                      >
                        No team feedback available yet.
                      </Text>
                    )}

                    {feedback && (
                      <>
                        {/* Quote block */}
                        <Box
                          bg={
                            theme === "dark"
                              ? "var(--sur-2)"
                              : "rgba(0,0,0,0.02)"
                          }
                          borderWidth="1px"
                          borderColor="var(--app-accent-border)"
                          borderLeftWidth="3px"
                          borderLeftColor="var(--app-accent)"
                          borderRadius="12px"
                          px="5"
                          py="4"
                        >
                          <Text
                            color="var(--fg-1)"
                            fontSize="sm"
                            lineHeight="1.85"
                            fontWeight="400"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {feedback.combinedFeedback ||
                              "No justification provided."}
                          </Text>
                        </Box>

                        {/* Attribute grid */}
                        <Box
                          display="grid"
                          gridTemplateColumns="repeat(2, 1fr)"
                          gap="3"
                        >
                          {FEEDBACK_SECTIONS.map(({ key, label }) => (
                            <Box
                              key={key}
                              bg={theme === "dark" ? "var(--sur-2)" : "white"}
                              borderWidth="1px"
                              borderColor="var(--bdr-1)"
                              borderRadius="12px"
                              px="4"
                              py="3.5"
                              transition="all 0.2s ease"
                              _hover={{
                                borderColor: "var(--app-accent-border)",
                                boxShadow:
                                  theme === "dark"
                                    ? "0 2px 8px -2px rgba(0,0,0,0.2)"
                                    : "0 2px 8px -2px rgba(0,0,0,0.04)",
                              }}
                            >
                              <Text
                                fontSize="10px"
                                fontWeight="700"
                                color="var(--app-accent)"
                                letterSpacing="0.08em"
                                textTransform="uppercase"
                                mb="1.5"
                              >
                                {label}
                              </Text>
                              <Text
                                color="var(--fg-1)"
                                fontSize="xs"
                                lineHeight="1.65"
                              >
                                {feedback[key]}
                              </Text>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </VStack>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      {/* Success overlay */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--overlay-bg)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              key="success-card"
              initial={{ scale: 0.78, y: 48, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26,
                delay: 0.06,
              }}
              style={{
                background: "var(--sur-modal)",
                border: "1px solid var(--app-accent-border)",
                borderRadius: "22px",
                padding: "44px 40px",
                maxWidth: "420px",
                width: "90%",
                textAlign: "center",
                boxShadow: "var(--shadow-login)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "12%",
                  right: "12%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, var(--app-accent), transparent)",
                }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 18,
                  delay: 0.22,
                }}
                style={{
                  fontSize: "68px",
                  marginBottom: "8px",
                  display: "inline-block",
                }}
              >
                🏆
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4 }}
              >
                <Flex justify="center" mb="4">
                  <Flex
                    w="52px"
                    h="52px"
                    borderRadius="13px"
                    bg={selectedAvatar.bg}
                    borderWidth="1px"
                    borderColor={selectedAvatar.border}
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      color={selectedAvatar.text}
                      letterSpacing="0.05em"
                    >
                      {selectedCandidate
                        ? `${selectedCandidate.first_name[0] ?? ""}${selectedCandidate.last_name[0] ?? ""}`
                        : ""}
                    </Text>
                  </Flex>
                </Flex>

                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color="var(--app-accent)"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="2"
                >
                  Vote Cast!
                </Text>
                <Text
                  fontSize="22px"
                  fontWeight="700"
                  letterSpacing="-0.02em"
                  color="var(--fg-1)"
                  lineHeight="1.25"
                  mb="3"
                >
                  You voted for
                  <br />
                  {selectedCandidate
                    ? `${selectedCandidate.first_name} ${selectedCandidate.last_name}`
                    : ""}
                </Text>
                <Text
                  fontSize="13px"
                  color="var(--fg-2)"
                  lineHeight="1.75"
                  mb="7"
                >
                  Your vote has been recorded. Results will be announced at the
                  end of the week.
                </Text>

                <VStack gap="3">
                  <Link href="/leaderboard" style={{ width: "100%" }}>
                    <Button
                      w="full"
                      h="44px"
                      bg="var(--app-accent)"
                      color="white"
                      borderRadius="10px"
                      fontWeight="600"
                      fontSize="sm"
                      _hover={{
                        bg: "var(--app-accent-hover)",
                        transform: "translateY(-1px)",
                        boxShadow: "var(--shadow-accent)",
                      }}
                      _active={{ transform: "scale(0.97)" }}
                      transition="all 0.2s"
                    >
                      View Leaderboard →
                    </Button>
                  </Link>
                  <Button
                    w="full"
                    h="40px"
                    variant="ghost"
                    color="var(--fg-4)"
                    borderRadius="10px"
                    fontSize="sm"
                    _hover={{ color: "var(--fg-2)", bg: "var(--sur-2)" }}
                    onClick={() => setSubmitted(false)}
                  >
                    Close
                  </Button>
                </VStack>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
