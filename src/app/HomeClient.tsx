"use client";

import { Box, Container, Flex, Text, Heading } from "@chakra-ui/react";
import Link from "next/link";
import {
  LuSparkles,
  LuThumbsUp,
  LuTrophy,
  LuArrowRight,
  LuLock,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import type {
  CurrentWeek,
  WeekStatus,
  LeaderboardEntry,
} from "./lib/api-types";

/* ── Badge text ─────────────────────────────────────────────────── */

function getBadgeText(status: WeekStatus): string {
  switch (status) {
    case "NOMINATION_OPEN":
      return "Nominations Open";
    case "VOTING_OPEN":
    case "SHORTLIST_PUBLISHED":
      return "Voting Open";
    case "RESULTS_PUBLISHED":
      return "Results Published";
    case "VOTING_CLOSED":
    case "NOMINATION_CLOSED":
    case "AGGREGATED":
      return "Week in Progress";
    default:
      return "Active Week";
  }
}

/* ── Types & constants ──────────────────────────────────────────── */

interface ActionCard {
  href: string;
  label: string;
  sublabel: string;
  description: string;
  Icon: IconType;
  enabled: boolean;
  disabledReason?: string;
  accentColor: string;
  accentMuted: string;
  accentBorder: string;
  glowColor: string;
}

const WINNER_MEDALS = ["🥇", "🥈", "🥉"];
const WINNER_LABELS = ["1st Place", "2nd Place", "3rd Place"];
const WINNER_COLORS = [
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
// Olympic display order: 2nd (left), 1st (center), 3rd (right)
const PODIUM_DISPLAY_ORDER = [1, 0, 2];
const PODIUM_HEIGHTS = ["160px", "220px", "120px"]; // left(2nd), center(1st), right(3rd)
const AVATAR_SIZES = ["64px", "84px", "56px"];
const MEDAL_SIZES = ["32px", "44px", "28px"];
const RANK_NUMBERS = ["2", "1", "3"];

/* ── Framer variants ────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 28 },
  },
};

function heroAnim(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  };
}

/* ── Props ──────────────────────────────────────────────────────── */

interface Props {
  currentWeek: CurrentWeek | null;
  noActiveWeek: boolean;
  winners: LeaderboardEntry[];
}

/* ── Component ──────────────────────────────────────────────────── */

export default function HomeClient({
  currentWeek,
  noActiveWeek,
  winners,
}: Props) {
  const hasWinners = winners.length > 0;
  const nominationEnabled = currentWeek?.status === "NOMINATION_OPEN";
  const votingEnabled =
    currentWeek?.status === "VOTING_OPEN" ||
    currentWeek?.status === "SHORTLIST_PUBLISHED";

  const badgeText =
    noActiveWeek || !currentWeek
      ? "No Active Polls"
      : getBadgeText(currentWeek.status);

  const [showConfetti, setShowConfetti] = useState(hasWinners);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!hasWinners) return;
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, [hasWinners]);

  const cards: ActionCard[] = [
    {
      href: "/review",
      label: "Submit",
      sublabel: "Recognition",
      description: "Nominate a colleague who went above and beyond this week.",
      Icon: LuSparkles,
      enabled: !!nominationEnabled,
      disabledReason: "Nominations are currently closed",
      accentColor: "var(--app-accent)",
      accentMuted: "var(--app-accent-muted)",
      accentBorder: "var(--app-accent-border)",
      glowColor: "rgba(212,168,61,0.28)",
    },
    {
      href: "/vote",
      label: "Cast Your",
      sublabel: "Vote",
      description: "Support your favourite nominee and help decide the winner.",
      Icon: LuThumbsUp,
      enabled: !!votingEnabled,
      disabledReason: "Voting is currently closed",
      accentColor: "#5b9cf6",
      accentMuted: "rgba(91,156,246,0.12)",
      accentBorder: "rgba(91,156,246,0.32)",
      glowColor: "rgba(91,156,246,0.22)",
    },
    {
      href: "/leaderboard",
      label: "View the",
      sublabel: "Leaderboard",
      description: "See who is leading the recognition cycle this week.",
      Icon: LuTrophy,
      enabled: true,
      accentColor: "#4ade80",
      accentMuted: "rgba(74,222,128,0.10)",
      accentBorder: "rgba(74,222,128,0.28)",
      glowColor: "rgba(74,222,128,0.18)",
    },
  ];

  return (
    <Box
      minH="100vh"
      color="var(--fg-1)"
      overflow="hidden"
      style={{ background: "var(--app-gradient)" }}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={350}
          recycle={false}
          gravity={0.22}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Ambient glow backdrop */}
      <Box
        position="fixed"
        top="-15%"
        left="50%"
        w="900px"
        h="700px"
        pointerEvents="none"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(212,168,61,0.10) 0%, rgba(212,168,61,0.03) 50%, transparent 70%)",
          animation: "floatGlow 7s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      <Container maxW="5xl" px="6" position="relative" style={{ zIndex: 1 }}>
        {/* ── Hero text ── */}
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          gap="5"
          pt={{ base: "10", md: "14" }}
          pb={{ base: "12", md: "16" }}
        >
          <motion.div {...heroAnim(0.08)}>
            <Flex
              align="center"
              gap="2"
              px="4"
              py="1.5"
              borderRadius="full"
              borderWidth="1px"
              borderColor="var(--app-accent-border)"
              bg="var(--app-accent-muted)"
              display="inline-flex"
            >
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg={noActiveWeek ? "var(--fg-4)" : "var(--app-accent)"}
                style={
                  noActiveWeek
                    ? undefined
                    : { animation: "pulseDot 2s ease-in-out infinite" }
                }
              />
              <Text
                fontSize="xs"
                fontWeight="600"
                color={noActiveWeek ? "var(--fg-3)" : "var(--app-accent)"}
                letterSpacing="0.06em"
                textTransform="uppercase"
              >
                {badgeText}
              </Text>
            </Flex>
          </motion.div>

          <motion.div {...heroAnim(0.16)}>
            <Heading
              fontSize={{ base: "38px", md: "56px", lg: "62px" }}
              fontWeight="700"
              letterSpacing="-0.03em"
              lineHeight="1.08"
              maxW="680px"
              color="var(--fg-1)"
            >
              Recognize the people{" "}
              <Box as="span" className="text-gradient">
                who make a difference
              </Box>
            </Heading>
          </motion.div>

          <motion.div {...heroAnim(0.24)}>
            <Text
              color="var(--fg-2)"
              fontSize={{ base: "md", md: "lg" }}
              maxW="420px"
              lineHeight="1.8"
              fontWeight="400"
            >
              {noActiveWeek
                ? "There are no active polls right now. Check back soon for the next nomination cycle."
                : "Celebrate the colleagues who go the extra mile. Pick an action below to get started."}
            </Text>
          </motion.div>
        </Flex>

        {/* ── Winners Podium ── */}
        {hasWinners && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            style={{ marginBottom: "48px" }}
          >
            <Flex direction="column" align="center" gap="6">
              {/* Section header */}
              <Flex direction="column" align="center" gap="2">
                <Flex align="center" gap="2">
                  <LuTrophy size={20} style={{ color: "var(--app-accent)" }} />
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    color="var(--app-accent)"
                  >
                    This Week&apos;s Winners
                  </Text>
                </Flex>
                <Text fontSize="sm" color="var(--fg-3)" fontWeight="400">
                  Congratulations to our top performers
                </Text>
              </Flex>

              {/* Podium — Olympic order: 2nd | 1st | 3rd */}
              <Flex
                align="flex-end"
                justify="center"
                gap={{ base: "2", md: "4" }}
              >
                {PODIUM_DISPLAY_ORDER.map((winnerIdx, slotIdx) => {
                  const winner = winners[winnerIdx];
                  if (!winner) return null;
                  const c = WINNER_COLORS[winnerIdx];
                  const isFirst = winnerIdx === 0;
                  const initials = `${winner.first_name[0]}${winner.last_name[0]}`;
                  const avatarSize = AVATAR_SIZES[slotIdx];
                  const medalSize = MEDAL_SIZES[slotIdx];
                  const podiumH = PODIUM_HEIGHTS[slotIdx];
                  const rankNum = RANK_NUMBERS[slotIdx];

                  return (
                    <motion.div
                      key={winner.employee_id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.4 + slotIdx * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <Flex
                        direction="column"
                        align="center"
                        w={{
                          base: isFirst ? "110px" : "90px",
                          md: isFirst ? "150px" : "120px",
                        }}
                      >
                        {/* Medal emoji */}
                        <Text fontSize={medalSize} lineHeight="1" mb="3">
                          {WINNER_MEDALS[winnerIdx]}
                        </Text>

                        {/* Avatar */}
                        <Flex
                          w={avatarSize}
                          h={avatarSize}
                          borderRadius={isFirst ? "18px" : "14px"}
                          bg={c.muted}
                          borderWidth="2px"
                          borderColor={c.border}
                          align="center"
                          justify="center"
                          mb="3"
                          position="relative"
                          style={{
                            boxShadow: isFirst
                              ? `0 0 32px -4px ${c.glow}, 0 0 0 4px ${c.muted}`
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
                              fontSize: isFirst ? "22px" : "15px",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {initials}
                          </Text>
                        </Flex>

                        {/* Name & label */}
                        <Flex
                          direction="column"
                          align="center"
                          gap="1"
                          mb="4"
                          px="1"
                        >
                          <Text
                            fontWeight="800"
                            color="var(--fg-1)"
                            textAlign="center"
                            letterSpacing="-0.02em"
                            style={{ fontSize: isFirst ? "15px" : "12px" }}
                          >
                            {winner.first_name}
                            {"\n"}
                            {winner.last_name}
                          </Text>
                          <Text
                            fontWeight="600"
                            letterSpacing="0.04em"
                            style={{
                              color: c.accent,
                              fontSize: isFirst ? "11px" : "10px",
                            }}
                          >
                            {WINNER_LABELS[winnerIdx]}
                          </Text>
                          <Text
                            fontWeight="500"
                            color="var(--fg-4)"
                            style={{ fontSize: "10px" }}
                          >
                            {winner.total_points} pts
                          </Text>
                        </Flex>

                        {/* Podium block */}
                        <Box
                          w="full"
                          h={podiumH}
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
                          {/* Shimmer line at top of podium */}
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
                          {/* Rank number centered in block */}
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
                                fontSize: isFirst ? "52px" : "36px",
                                opacity: 0.12,
                                lineHeight: 1,
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {rankNum}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </motion.div>
                  );
                })}
              </Flex>
            </Flex>
          </motion.div>
        )}

        {/* ── Action Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            paddingBottom: "80px",
            alignItems: "stretch",
          }}
        >
          {cards.map((card) => (
            <ActionCard key={card.href} card={card} />
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}

/* ── ActionCard ─────────────────────────────────────────────────── */

function ActionCard({ card }: { card: ActionCard }) {
  const [hovered, setHovered] = useState(false);
  const { href, label, sublabel, description, Icon, enabled, disabledReason } =
    card;

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        enabled
          ? {
              y: -10,
              scale: 1.025,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }
          : { scale: 1.01, transition: { duration: 0.15 } }
      }
      whileTap={enabled ? { scale: 0.975 } : {}}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        cursor: enabled ? "pointer" : "not-allowed",
        opacity: enabled ? 1 : 0.5,
        transition: "opacity 0.3s",
        height: "100%",
      }}
    >
      <Link
        href={enabled ? href : "#"}
        style={{
          pointerEvents: enabled ? "auto" : "none",
          display: "block",
          height: "100%",
        }}
        tabIndex={enabled ? 0 : -1}
      >
        <Box
          borderRadius="20px"
          borderWidth="1px"
          borderColor={hovered && enabled ? card.accentBorder : "var(--bdr-2)"}
          bg="var(--sur-1)"
          p="7"
          position="relative"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          height="100%"
          style={{
            backdropFilter: "blur(18px)",
            boxShadow:
              hovered && enabled
                ? `0 20px 60px -12px ${card.glowColor}, 0 4px 16px -4px rgba(0,0,0,0.4), 0 0 0 1px ${card.accentBorder}`
                : "0 4px 20px -4px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
            transition:
              "box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease",
            background:
              hovered && enabled
                ? `linear-gradient(145deg, ${card.accentMuted} 0%, var(--sur-1) 60%)`
                : "var(--sur-1)",
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="10%"
            right="10%"
            h="1px"
            style={{
              background:
                hovered && enabled
                  ? `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`
                  : "linear-gradient(90deg, transparent, var(--bdr-2), transparent)",
              transition: "background 0.28s ease",
            }}
          />

          <Flex
            w="52px"
            h="52px"
            borderRadius="14px"
            align="center"
            justify="center"
            mb="5"
            style={{
              background: card.accentMuted,
              border: `1px solid ${card.accentBorder}`,
              boxShadow:
                hovered && enabled ? `0 0 24px -4px ${card.glowColor}` : "none",
              transition: "box-shadow 0.28s ease",
            }}
          >
            <motion.div
              animate={
                hovered && enabled
                  ? {
                      rotate: [0, -8, 8, 0],
                      transition: { duration: 0.45, ease: "easeInOut" },
                    }
                  : { rotate: 0 }
              }
              style={{ display: "flex", color: card.accentColor }}
            >
              <Icon size={22} />
            </motion.div>
          </Flex>

          <Text
            fontSize="sm"
            fontWeight="500"
            color="var(--fg-3)"
            letterSpacing="0.04em"
            textTransform="uppercase"
            mb="1"
          >
            {label}
          </Text>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            letterSpacing="-0.02em"
            mb="3"
            style={{
              color: hovered && enabled ? card.accentColor : "var(--fg-1)",
              transition: "color 0.22s",
            }}
          >
            {sublabel}
          </Text>

          <Text
            fontSize="sm"
            color="var(--fg-3)"
            lineHeight="1.7"
            mb="6"
            flex="1"
          >
            {!enabled && disabledReason ? disabledReason : description}
          </Text>

          <Flex align="center" justify="space-between">
            <Flex
              align="center"
              gap="1.5"
              px="3"
              py="1"
              borderRadius="full"
              style={{
                background: enabled ? card.accentMuted : "var(--sur-2)",
                border: `1px solid ${enabled ? card.accentBorder : "var(--bdr-1)"}`,
              }}
            >
              {enabled ? (
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  style={{
                    background: card.accentColor,
                    animation: "pulseDot 2s ease-in-out infinite",
                  }}
                />
              ) : (
                <LuLock size={9} style={{ color: "var(--fg-4)" }} />
              )}
              <Text
                fontSize="10px"
                fontWeight="600"
                letterSpacing="0.05em"
                textTransform="uppercase"
                style={{ color: enabled ? card.accentColor : "var(--fg-4)" }}
              >
                {enabled ? "Available" : "Locked"}
              </Text>
            </Flex>

            <motion.div
              animate={hovered && enabled ? { x: 4 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  hovered && enabled ? card.accentMuted : "var(--sur-2)",
                border: `1px solid ${hovered && enabled ? card.accentBorder : "var(--bdr-1)"}`,
                color: hovered && enabled ? card.accentColor : "var(--fg-3)",
                transition: "background 0.22s, border-color 0.22s, color 0.22s",
              }}
            >
              <LuArrowRight size={14} />
            </motion.div>
          </Flex>
        </Box>
      </Link>
    </motion.div>
  );
}
