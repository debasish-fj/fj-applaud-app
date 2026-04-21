"use client";

import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LuTrophy } from "react-icons/lu";
import { useTheme } from "../context/theme";
import { getLeaderboard } from "../lib/api";

/* ─── Types ─────────────────────────────────────────────────────── */

interface LeaderboardRow {
  rank: number;
  name: string;
  points: number;
}

/* ─── Theme constants ────────────────────────────────────────────── */

const MEDALS = ["🥇", "🥈", "🥉"];

const AVATAR_PALETTE_DARK = [
  { bg: "rgba(200,152,46,0.2)", border: "rgba(200,152,46,0.45)", text: "#e8c870" },
  { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.35)", text: "#cbd5e1" },
  { bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.35)", text: "#fdba74" },
  { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#93c5fd" },
  { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#6ee7b7" },
  { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)", text: "#c4b5fd" },
];

const AVATAR_PALETTE_LIGHT = [
  { bg: "rgba(200,152,46,0.12)", border: "rgba(200,152,46,0.4)", text: "#92600a" },
  { bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.35)", text: "#475569" },
  { bg: "rgba(234,88,12,0.1)", border: "rgba(234,88,12,0.3)", text: "#c2440e" },
  { bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.3)", text: "#1d4ed8" },
  { bg: "rgba(4,120,87,0.1)", border: "rgba(4,120,87,0.3)", text: "#065f46" },
  { bg: "rgba(109,40,217,0.1)", border: "rgba(109,40,217,0.3)", text: "#6d28d9" },
];

const TOP3_BAR_GRADIENTS = [
  "linear-gradient(90deg, #c8982e, #e8c870, #c8982e)",
  "linear-gradient(90deg, #64748b, #94a3b8)",
  "linear-gradient(90deg, #92400e, #cd7f32)",
];

/* ─── CountUp hook ─────────────────────────────────────────────── */

function useCountUp(target: number, duration = 1100, delay = 0) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now() + delay;

    function step(now: number) {
      if (now < start) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const t = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, delay]);

  return val;
}

function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const val = useCountUp(to, 1100, delay);
  return <>{val}</>;
}

/* ─── Framer variants ──────────────────────────────────────────── */

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ─── Skeleton row ─────────────────────────────────────────────── */

function SkeletonRow({ isTop }: { isTop?: boolean }) {
  return (
    <Box
      borderWidth="1px"
      borderColor={isTop ? "var(--app-accent-border)" : "var(--bdr-1)"}
      borderRadius="14px"
      px="5"
      py="4"
      bg={isTop ? "var(--app-accent-muted)" : "var(--sur-2)"}
      style={{ opacity: 0.5 }}
    >
      <Flex align="center" gap="4">
        <Box w="28px" h="28px" borderRadius="full" bg="var(--bdr-2)" />
        <Box w="40px" h="40px" borderRadius="10px" bg="var(--bdr-2)" />
        <Box flex="1">
          <Box h="12px" w="120px" bg="var(--bdr-2)" borderRadius="6px" mb="2" />
          <Box h="5px" bg="var(--bdr-1)" borderRadius="full" />
        </Box>
      </Flex>
    </Box>
  );
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function LeaderboardClient() {
  const { theme } = useTheme();
  const AVATAR_PALETTE =
    theme === "dark" ? AVATAR_PALETTE_DARK : AVATAR_PALETTE_LIGHT;

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barReady, setBarReady] = useState(false);

  useEffect(() => {
    getLeaderboard()
      .then((entries) => {
        setLeaderboardData(
          entries.map((entry, idx) => ({
            rank: idx + 1,
            name: `${entry.first_name} ${entry.last_name}`,
            points: entry.total_points,
          }))
        );
      })
      .catch(() => setError("Could not load leaderboard. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setBarReady(true), 180);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const maxPoints = leaderboardData.length
    ? Math.max(...leaderboardData.map((p) => p.points), 1)
    : 1;

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <Box minH="100vh" color="var(--fg-1)">
      {/* ── Page header ── */}
      <Container maxW="3xl" px="6" pt="12" pb="2">
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
              style={{ boxShadow: "var(--shadow-accent)", color: "var(--app-accent)" }}
            >
              <LuTrophy size={22} />
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
                Leaderboard
              </Heading>
              <Text color="var(--fg-3)" fontSize="sm" lineHeight="1.5" fontWeight="500">
                All-time recognition points
              </Text>
            </Box>
          </Flex>
        </motion.div>
      </Container>

      {/* ── Leaderboard card ── */}
      <Container maxW="3xl" py="6" px="6">
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
            {/* Subtle top accent line */}
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

            {/* Error state */}
            {error && (
              <Flex align="center" justify="center" py="12">
                <Text color="var(--fg-3)" fontSize="sm">{error}</Text>
              </Flex>
            )}

            {/* Loading skeleton */}
            {loading && (
              <Flex direction="column" gap="2.5">
                {[true, true, true].map((isTop, i) => (
                  <SkeletonRow key={i} isTop={isTop} />
                ))}
                <Box h="32px" />
                {[false, false, false].map((isTop, i) => (
                  <SkeletonRow key={i + 3} isTop={isTop} />
                ))}
              </Flex>
            )}

            {/* Empty state */}
            {!loading && !error && leaderboardData.length === 0 && (
              <Flex align="center" justify="center" py="12">
                <Text color="var(--fg-3)" fontSize="sm">No points data yet.</Text>
              </Flex>
            )}

            {/* Actual data */}
            {!loading && !error && leaderboardData.length > 0 && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {/* ── Top 3 ── */}
                {topThree.map((person, idx) => {
                  const avatar = AVATAR_PALETTE[idx] ?? AVATAR_PALETTE[0];
                  const pct = Math.round((person.points / maxPoints) * 100);
                  const initials = person.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <motion.div
                      key={person.rank}
                      variants={rowVariants}
                      whileHover={{ scale: 1.008, transition: { duration: 0.15 } }}
                    >
                      <Box
                        borderWidth="1px"
                        borderColor="var(--app-accent-border)"
                        borderRadius="14px"
                        px="5"
                        py="4"
                        bg="var(--app-accent-muted)"
                        position="relative"
                        overflow="hidden"
                        transition="all 0.2s ease"
                        _hover={{
                          boxShadow:
                            theme === "dark"
                              ? "0 4px 20px -6px rgba(200,152,46,0.2)"
                              : "0 4px 20px -6px rgba(200,152,46,0.12)",
                        }}
                        style={
                          idx === 0
                            ? { animation: "pulseGlow 3s ease-in-out infinite" }
                            : undefined
                        }
                      >
                        {/* Rank accent bar */}
                        <Box
                          position="absolute"
                          left="0"
                          top="20%"
                          bottom="20%"
                          w="3px"
                          borderRadius="0 3px 3px 0"
                          bg={
                            idx === 0
                              ? "var(--app-accent)"
                              : idx === 1
                                ? "#94a3b8"
                                : "#cd7f32"
                          }
                        />

                        <Flex align="center" gap="4">
                          {/* Medal */}
                          <Text fontSize="24px" lineHeight="1" flexShrink={0} ml="2">
                            {MEDALS[idx]}
                          </Text>

                          {/* Avatar */}
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

                          {/* Name + progress bar */}
                          <Box flex="1" minW={0}>
                            <Flex align="center" justify="space-between" mb="2.5">
                              <Text
                                fontWeight="800"
                                fontSize="sm"
                                color="var(--fg-1)"
                                letterSpacing="-0.01em"
                              >
                                {person.name}
                              </Text>
                              <Text fontSize="xs" fontWeight="700" color="var(--fg-2)">
                                <CountUp to={person.points} delay={idx * 100} /> pts
                              </Text>
                            </Flex>
                            <Box h="5px" bg="var(--bdr-1)" borderRadius="full" overflow="hidden">
                              <Box
                                h="full"
                                borderRadius="full"
                                style={{
                                  width: barReady ? `${pct}%` : "0%",
                                  background: TOP3_BAR_GRADIENTS[idx],
                                  backgroundSize: "200% auto",
                                  transition: `width 0.9s cubic-bezier(0.2,0,0,1) ${idx * 100}ms`,
                                  animation: barReady ? "shimmer 2.5s linear infinite" : "none",
                                }}
                              />
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                    </motion.div>
                  );
                })}

                {/* Divider */}
                {rest.length > 0 && (
                  <motion.div variants={rowVariants}>
                    <Flex align="center" gap="4" py="1">
                      <Box
                        flex="1"
                        h="1px"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--bdr-1) 30%, var(--bdr-1) 70%, transparent)",
                        }}
                      />
                      <Text
                        fontSize="xs"
                        color="var(--fg-3)"
                        letterSpacing="0.08em"
                        fontWeight="600"
                      >
                        OTHERS
                      </Text>
                      <Box
                        flex="1"
                        h="1px"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--bdr-1) 30%, var(--bdr-1) 70%, transparent)",
                        }}
                      />
                    </Flex>
                  </motion.div>
                )}

                {/* ── Ranks 4+ ── */}
                {rest.map((person, idx) => {
                  const globalIdx = idx + 3;
                  const avatar = AVATAR_PALETTE[globalIdx % AVATAR_PALETTE.length];
                  const pct = Math.round((person.points / maxPoints) * 100);
                  const initials = person.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <motion.div
                      key={person.rank}
                      variants={rowVariants}
                      whileHover={{ scale: 1.008, transition: { duration: 0.15 } }}
                    >
                      <Box
                        borderWidth="1px"
                        borderColor="var(--bdr-1)"
                        borderRadius="14px"
                        px="5"
                        py="4"
                        bg={theme === "dark" ? "var(--sur-2)" : "white"}
                        transition="all 0.2s ease"
                        _hover={{
                          borderColor: "var(--app-accent-border)",
                          boxShadow:
                            theme === "dark"
                              ? "0 2px 12px -4px rgba(0,0,0,0.25)"
                              : "0 2px 12px -4px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Flex align="center" gap="4">
                          {/* Rank circle */}
                          <Flex
                            w="28px"
                            h="28px"
                            borderRadius="full"
                            bg="var(--sur-2)"
                            align="center"
                            justify="center"
                            flexShrink={0}
                          >
                            <Text fontSize="xs" fontWeight="700" color="var(--fg-3)">
                              {person.rank}
                            </Text>
                          </Flex>

                          {/* Avatar */}
                          <Flex
                            w="36px"
                            h="36px"
                            borderRadius="9px"
                            bg={avatar.bg}
                            borderWidth="1px"
                            borderColor={avatar.border}
                            align="center"
                            justify="center"
                            flexShrink={0}
                          >
                            <Text
                              fontSize="10px"
                              fontWeight="700"
                              color={avatar.text}
                              letterSpacing="0.05em"
                            >
                              {initials}
                            </Text>
                          </Flex>

                          {/* Name + bar */}
                          <Box flex="1" minW={0}>
                            <Flex align="center" justify="space-between" mb="2">
                              <Text fontWeight="700" fontSize="sm" color="var(--fg-1)">
                                {person.name}
                              </Text>
                              <Text fontSize="xs" color="var(--fg-3)" fontWeight="500">
                                <CountUp to={person.points} delay={300 + idx * 80} /> pts
                              </Text>
                            </Flex>
                            <Box h="3px" bg="var(--bdr-1)" borderRadius="full" overflow="hidden">
                              <Box
                                h="full"
                                borderRadius="full"
                                style={{
                                  width: barReady ? `${pct}%` : "0%",
                                  background: "var(--bdr-3)",
                                  transition: `width 0.85s cubic-bezier(0.2,0,0,1) ${(idx + 3) * 80}ms`,
                                }}
                              />
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
