"use client";

import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LuTrophy } from "react-icons/lu";
import ReactConfetti from "react-confetti";
import { useTheme } from "../context/theme";

/* ─── Types ──────────────────────────────────────────────────────── */

interface LeaderboardRow {
  rank: number;
  name: string;
  points: number;
  initials: string;
}

/* ─── Podium constants ───────────────────────────────────────────── */

// Olympic display order: 2nd (left), 1st (center), 3rd (right)
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_LABELS = ["1st Place", "2nd Place", "3rd Place"];
const PODIUM_HEIGHTS = ["150px", "210px", "110px"]; // slot order: left, center, right
const AVATAR_SIZES = ["60px", "80px", "52px"];
const MEDAL_FONT = ["30px", "42px", "26px"];
const RANK_NUMS = ["2", "1", "3"];

const PODIUM_COLORS = [
  {
    accent: "#e8c870",
    muted: "rgba(200,152,46,0.18)",
    border: "rgba(200,152,46,0.45)",
    glow: "rgba(200,152,46,0.35)",
  },
  {
    accent: "#b0c4de",
    muted: "rgba(148,163,184,0.14)",
    border: "rgba(148,163,184,0.4)",
    glow: "rgba(148,163,184,0.2)",
  },
  {
    accent: "#cd7f32",
    muted: "rgba(180,100,30,0.14)",
    border: "rgba(180,100,30,0.4)",
    glow: "rgba(180,100,30,0.2)",
  },
];

/* ─── List avatar palette ────────────────────────────────────────── */

const LIST_AVATARS_DARK = [
  {
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
    text: "#93c5fd",
  },
  {
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.3)",
    text: "#6ee7b7",
  },
  {
    bg: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
    text: "#c4b5fd",
  },
  {
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.35)",
    text: "#fdba74",
  },
  {
    bg: "rgba(236,72,153,0.15)",
    border: "rgba(236,72,153,0.3)",
    text: "#f9a8d4",
  },
  {
    bg: "rgba(234,179,8,0.15)",
    border: "rgba(234,179,8,0.3)",
    text: "#fde047",
  },
];
const LIST_AVATARS_LIGHT = [
  { bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.3)", text: "#1d4ed8" },
  { bg: "rgba(4,120,87,0.1)", border: "rgba(4,120,87,0.3)", text: "#065f46" },
  {
    bg: "rgba(109,40,217,0.1)",
    border: "rgba(109,40,217,0.3)",
    text: "#6d28d9",
  },
  { bg: "rgba(234,88,12,0.1)", border: "rgba(234,88,12,0.3)", text: "#c2440e" },
  { bg: "rgba(190,24,93,0.1)", border: "rgba(190,24,93,0.3)", text: "#9d174d" },
  { bg: "rgba(161,98,7,0.1)", border: "rgba(161,98,7,0.3)", text: "#92400e" },
];

/* ─── CountUp ────────────────────────────────────────────────────── */

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
  return <>{useCountUp(to, 1100, delay)}</>;
}

/* ─── Skeleton ───────────────────────────────────────────────────── */

/* ─── Component ─────────────────────────────────────────────────── */

interface Props {
  entries: {
    employee_id: number;
    first_name: string;
    last_name: string;
    total_points: number;
  }[];
  error: boolean;
}

export default function LeaderboardClient({ entries, error: hasError }: Props) {
  const { theme } = useTheme();
  const listAvatars = theme === "dark" ? LIST_AVATARS_DARK : LIST_AVATARS_LIGHT;

  const rows: LeaderboardRow[] = entries.map((e, i) => ({
    rank: i + 1,
    name: `${e.first_name} ${e.last_name}`,
    points: e.total_points,
    initials: `${e.first_name[0]}${e.last_name[0]}`,
  }));

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (rows.length === 0) return;
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [rows.length]);

  const topThree = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <Box minH="100vh" color="var(--fg-1)">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
          gravity={0.25}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Header ── */}
      <Container maxW="3xl" px="6" pt="12" pb="2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              <Text color="var(--fg-3)" fontSize="sm" fontWeight="500">
                All-time recognition points
              </Text>
            </Box>
          </Flex>
        </motion.div>
      </Container>

      <Container maxW="3xl" py="6" px="6">
        {/* ── Error ── */}
        {hasError && (
          <Flex align="center" justify="center" py="16">
            <Text color="var(--fg-3)" fontSize="sm">
              Could not load leaderboard. Please try again.
            </Text>
          </Flex>
        )}

        {/* ── Empty ── */}
        {!hasError && rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              py="20"
              gap="5"
            >
              {/* Icon */}
              <Flex
                w="72px"
                h="72px"
                borderRadius="20px"
                bg="var(--app-accent-muted)"
                borderWidth="1px"
                borderColor="var(--app-accent-border)"
                align="center"
                justify="center"
                style={{ boxShadow: "var(--shadow-accent)" }}
              >
                <LuTrophy size={30} style={{ color: "var(--app-accent)", opacity: 0.6 }} />
              </Flex>

              {/* Text */}
              <Flex direction="column" align="center" gap="2">
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="var(--fg-1)"
                  letterSpacing="-0.02em"
                >
                  No winners yet
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--fg-3)"
                  textAlign="center"
                  maxW="280px"
                  lineHeight="1.7"
                >
                  Recognition points will appear here once the first cycle is complete.
                </Text>
              </Flex>

              {/* Decorative dots */}
              <Flex gap="2" mt="1">
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="var(--app-accent-border)"
                    style={{ opacity: 1 - i * 0.3 }}
                  />
                ))}
              </Flex>
            </Flex>
          </motion.div>
        )}

        {/* ── Data ── */}
        {!hasError && rows.length > 0 && (
          <>
            {/* ── Olympic Podium ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ marginBottom: "40px" }}
            >
              <Flex
                align="flex-end"
                justify="center"
                gap={{ base: "3", md: "5" }}
              >
                {PODIUM_ORDER.map((winnerIdx, slotIdx) => {
                  const person = topThree[winnerIdx];
                  if (!person) return null;
                  const c = PODIUM_COLORS[winnerIdx];
                  const isFirst = winnerIdx === 0;
                  const avSize = AVATAR_SIZES[slotIdx];
                  const podH = PODIUM_HEIGHTS[slotIdx];
                  const mFont = MEDAL_FONT[slotIdx];

                  return (
                    <motion.div
                      key={person.rank}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.15 + slotIdx * 0.08,
                      }}
                    >
                      <Flex
                        direction="column"
                        align="center"
                        w={{
                          base: isFirst ? "110px" : "88px",
                          md: isFirst ? "148px" : "116px",
                        }}
                      >
                        {/* Medal */}
                        <Text lineHeight="1" mb="3" style={{ fontSize: mFont }}>
                          {PODIUM_MEDALS[winnerIdx]}
                        </Text>

                        {/* Avatar */}
                        <Flex
                          w={avSize}
                          h={avSize}
                          borderRadius={isFirst ? "18px" : "14px"}
                          bg={c.muted}
                          borderWidth="2px"
                          borderColor={c.border}
                          align="center"
                          justify="center"
                          mb="3"
                          style={{
                            boxShadow: isFirst
                              ? `0 0 36px -4px ${c.glow}, 0 0 0 4px ${c.muted}`
                              : `0 0 16px -4px ${c.glow}`,
                            animation: isFirst
                              ? "pulseGlow 3s ease-in-out infinite"
                              : "none",
                          }}
                        >
                          <Text
                            fontWeight="800"
                            style={{
                              color: c.accent,
                              fontSize: isFirst ? "22px" : "14px",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {person.initials}
                          </Text>
                        </Flex>

                        {/* Name + label + pts */}
                        <Flex
                          direction="column"
                          align="center"
                          gap="1"
                          mb="4"
                          px="1"
                        >
                          <Text
                            fontWeight="800"
                            textAlign="center"
                            letterSpacing="-0.02em"
                            color="var(--fg-1)"
                            style={{
                              fontSize: isFirst ? "14px" : "12px",
                              lineHeight: 1.3,
                            }}
                          >
                            {person.name}
                          </Text>
                          <Text
                            fontWeight="600"
                            style={{
                              color: c.accent,
                              fontSize: isFirst ? "11px" : "10px",
                            }}
                          >
                            {PODIUM_LABELS[winnerIdx]}
                          </Text>
                          <Text
                            color="var(--fg-4)"
                            style={{ fontSize: "10px" }}
                          >
                            <CountUp to={person.points} delay={slotIdx * 100} />{" "}
                            pts
                          </Text>
                        </Flex>

                        {/* Podium block */}
                        <Box
                          w="full"
                          h={podH}
                          borderRadius="12px 12px 0 0"
                          position="relative"
                          overflow="hidden"
                          style={{
                            background: `linear-gradient(180deg, ${c.muted} 0%, rgba(0,0,0,0) 100%)`,
                            border: `1px solid ${c.border}`,
                            borderBottom: "none",
                            boxShadow: isFirst
                              ? `0 -8px 32px -8px ${c.glow}`
                              : "none",
                          }}
                        >
                          {/* Top shimmer */}
                          <Box
                            position="absolute"
                            top="0"
                            left="10%"
                            right="10%"
                            h="2px"
                            borderRadius="full"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
                              opacity: isFirst ? 0.9 : 0.5,
                            }}
                          />
                          {/* Watermark rank */}
                          <Flex
                            position="absolute"
                            inset="0"
                            align="center"
                            justify="center"
                          >
                            <Text
                              fontWeight="900"
                              style={{
                                color: c.accent,
                                fontSize: isFirst ? "56px" : "40px",
                                opacity: 0.1,
                                lineHeight: 1,
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {RANK_NUMS[slotIdx]}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </motion.div>
                  );
                })}
              </Flex>
            </motion.div>

            {/* ── Rest of the list ── */}
            {rest.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box
                  bg="var(--sur-1)"
                  borderWidth="1px"
                  borderColor="var(--bdr-1)"
                  borderRadius="18px"
                  overflow="hidden"
                  style={{
                    boxShadow:
                      theme === "dark"
                        ? "0 1px 3px rgba(0,0,0,0.3), 0 8px 32px -8px rgba(0,0,0,0.35)"
                        : "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px -8px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Card header */}
                  <Flex
                    px="5"
                    py="3"
                    borderBottomWidth="1px"
                    borderColor="var(--bdr-1)"
                    align="center"
                    justify="space-between"
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="var(--fg-3)"
                    >
                      Rankings
                    </Text>
                    <Text fontSize="xs" color="var(--fg-4)" fontWeight="500">
                      {rows.length} total
                    </Text>
                  </Flex>

                  {/* List rows */}
                  <Flex direction="column">
                    {rest.map((person, idx) => {
                      const av = listAvatars[idx % listAvatars.length];
                      const isLast = idx === rest.length - 1;
                      return (
                        <motion.div
                          key={person.rank}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.45 + idx * 0.04,
                          }}
                        >
                          <Flex
                            align="center"
                            gap="4"
                            px="5"
                            py="3.5"
                            borderBottomWidth={isLast ? "0" : "1px"}
                            borderColor="var(--bdr-1)"
                            transition="background 0.15s"
                            _hover={{
                              bg:
                                theme === "dark"
                                  ? "var(--sur-2)"
                                  : "var(--sur-2)",
                            }}
                          >
                            {/* Rank */}
                            <Flex
                              w="28px"
                              h="28px"
                              borderRadius="full"
                              bg="var(--sur-2)"
                              borderWidth="1px"
                              borderColor="var(--bdr-1)"
                              align="center"
                              justify="center"
                              flexShrink={0}
                            >
                              <Text
                                fontSize="xs"
                                fontWeight="700"
                                color="var(--fg-3)"
                              >
                                {person.rank}
                              </Text>
                            </Flex>

                            {/* Avatar */}
                            <Flex
                              w="36px"
                              h="36px"
                              borderRadius="10px"
                              bg={av.bg}
                              borderWidth="1px"
                              borderColor={av.border}
                              align="center"
                              justify="center"
                              flexShrink={0}
                            >
                              <Text
                                fontSize="10px"
                                fontWeight="700"
                                color={av.text}
                                letterSpacing="0.05em"
                              >
                                {person.initials}
                              </Text>
                            </Flex>

                            {/* Name */}
                            <Text
                              flex="1"
                              fontWeight="600"
                              fontSize="sm"
                              color="var(--fg-1)"
                              letterSpacing="-0.01em"
                            >
                              {person.name}
                            </Text>

                            {/* Points */}
                            <Text
                              fontSize="sm"
                              fontWeight="700"
                              color="var(--fg-2)"
                            >
                              <CountUp
                                to={person.points}
                                delay={400 + idx * 50}
                              />
                              <Text
                                as="span"
                                fontSize="xs"
                                fontWeight="400"
                                color="var(--fg-4)"
                                ml="1"
                              >
                                pts
                              </Text>
                            </Text>
                          </Flex>
                        </motion.div>
                      );
                    })}
                  </Flex>
                </Box>
              </motion.div>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
