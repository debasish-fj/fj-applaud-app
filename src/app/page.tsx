"use client";

import { Box, Container, Flex, Text, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { LuSparkles, LuThumbsUp, LuTrophy, LuArrowRight, LuLock } from "react-icons/lu";
import type { IconType } from "react-icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentWeek } from "./lib/api";
import type { CurrentWeek, WeekStatus } from "./lib/api-types";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
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
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  };
}

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState<CurrentWeek | null>(null);
  const [weekLoading, setWeekLoading] = useState(true);
  const [noActiveWeek, setNoActiveWeek] = useState(false);

  useEffect(() => {
    getCurrentWeek()
      .then((week) => setCurrentWeek(week))
      .catch((err) => {
        if (err?.response?.status === 404) setNoActiveWeek(true);
      })
      .finally(() => setWeekLoading(false));
  }, []);

  const nominationEnabled =
    !weekLoading && currentWeek?.status === "NOMINATION_OPEN";
  const votingEnabled =
    !weekLoading &&
    (currentWeek?.status === "VOTING_OPEN" ||
      currentWeek?.status === "SHORTLIST_PUBLISHED");

  const badgeText = weekLoading
    ? "Loading…"
    : noActiveWeek
      ? "No Active Polls"
      : currentWeek
        ? getBadgeText(currentWeek.status)
        : "No Active Polls";

  const cards: ActionCard[] = [
    {
      href: "/review",
      label: "Submit",
      sublabel: "Recognition",
      description: "Nominate a colleague who went above and beyond this week.",
      Icon: LuSparkles,
      enabled: nominationEnabled,
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
      enabled: votingEnabled,
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
      description: "See who is leading the recognition cycle this month.",
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
        {/* ── Hero text ────────────────────────────────────────────── */}
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          gap="5"
          pt={{ base: "10", md: "14" }}
          pb={{ base: "12", md: "16" }}
        >
          {/* Status badge */}
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

          {/* Headline */}
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

          {/* Subtitle */}
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

        {/* ── Action Cards ─────────────────────────────────────────── */}
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
            <ActionCard key={card.href} card={card} loading={weekLoading} />
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}

function ActionCard({
  card,
  loading,
}: {
  card: ActionCard;
  loading: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { href, label, sublabel, description, Icon, enabled, disabledReason } =
    card;

  const isClickable = enabled && !loading;

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        isClickable
          ? { y: -10, scale: 1.025, transition: { type: "spring", stiffness: 380, damping: 22 } }
          : { scale: 1.01, transition: { duration: 0.15 } }
      }
      whileTap={isClickable ? { scale: 0.975 } : {}}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        cursor: isClickable ? "pointer" : "not-allowed",
        opacity: loading ? 0.6 : enabled ? 1 : 0.5,
        transition: "opacity 0.3s",
        height: "100%",
      }}
    >
      <Link
        href={isClickable ? href : "#"}
        style={{ pointerEvents: isClickable ? "auto" : "none", display: "block", height: "100%" }}
        tabIndex={isClickable ? 0 : -1}
      >
        <Box
          borderRadius="20px"
          borderWidth="1px"
          borderColor={
            hovered && isClickable ? card.accentBorder : "var(--bdr-2)"
          }
          bg="var(--sur-1)"
          p="7"
          position="relative"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          height="100%"
          style={{
            backdropFilter: "blur(18px)",
            boxShadow: hovered && isClickable
              ? `0 20px 60px -12px ${card.glowColor}, 0 4px 16px -4px rgba(0,0,0,0.4), 0 0 0 1px ${card.accentBorder}`
              : "0 4px 20px -4px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
            transition:
              "box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease",
            background: hovered && isClickable
              ? `linear-gradient(145deg, ${card.accentMuted} 0%, var(--sur-1) 60%)`
              : "var(--sur-1)",
          }}
        >
          {/* Top glow line */}
          <Box
            position="absolute"
            top="0"
            left="10%"
            right="10%"
            h="1px"
            style={{
              background: hovered && isClickable
                ? `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`
                : "linear-gradient(90deg, transparent, var(--bdr-2), transparent)",
              transition: "background 0.28s ease",
            }}
          />

          {/* Icon */}
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
              boxShadow: hovered && isClickable
                ? `0 0 24px -4px ${card.glowColor}`
                : "none",
              transition: "box-shadow 0.28s ease",
            }}
          >
            <motion.div
              animate={
                hovered && isClickable
                  ? { rotate: [0, -8, 8, 0], transition: { duration: 0.45, ease: "easeInOut" } }
                  : { rotate: 0 }
              }
              style={{ display: "flex", color: card.accentColor }}
            >
              <Icon size={22} />
            </motion.div>
          </Flex>

          {/* Label */}
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
            color="var(--fg-1)"
            mb="3"
            style={{ color: hovered && isClickable ? card.accentColor : "var(--fg-1)", transition: "color 0.22s" }}
          >
            {sublabel}
          </Text>

          {/* Description */}
          <Text
            fontSize="sm"
            color="var(--fg-3)"
            lineHeight="1.7"
            mb="6"
            flex="1"
          >
            {!enabled && disabledReason ? disabledReason : description}
          </Text>

          {/* Footer CTA */}
          <Flex align="center" justify="space-between">
            {/* Status pill */}
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
                {loading ? "Checking…" : enabled ? "Available" : "Locked"}
              </Text>
            </Flex>

            {/* Arrow */}
            <motion.div
              animate={
                hovered && isClickable ? { x: 4 } : { x: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                width: 32, height: 32, borderRadius: 9,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: hovered && isClickable ? card.accentMuted : "var(--sur-2)",
                border: `1px solid ${hovered && isClickable ? card.accentBorder : "var(--bdr-1)"}`,
                color: hovered && isClickable ? card.accentColor : "var(--fg-3)",
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
