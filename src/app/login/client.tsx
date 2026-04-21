"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import {
  LuSparkles,
  LuThumbsUp,
  LuTrophy,
  LuShieldCheck,
} from "react-icons/lu";

/* ─── Feature bullets for left panel ────────────────────────────── */
const FEATURES = [
  {
    Icon: LuSparkles,
    title: "Submit a recognition",
    desc: "Nominate a colleague who went the extra mile this month.",
  },
  {
    Icon: LuThumbsUp,
    title: "Cast your vote",
    desc: "Review nominees and choose the standout performer.",
  },
  {
    Icon: LuTrophy,
    title: "Live leaderboard",
    desc: "See who's leading the cycle in real time.",
  },
];

/* ─── Framer variants ────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 28 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" as const },
  },
};

/* ─── Page ───────────────────────────────────────────────────────── */
export default function LoginClient() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="stretch"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      style={{ background: "var(--app-gradient)" }}
    >
      {/* ── Full-screen background layer ──────────────────────── */}
      {/* Gradient mesh */}
      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        zIndex="0"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 15% 40%, rgba(200,152,46,0.11) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 70% at 85% 70%, rgba(59,130,246,0.07) 0%, transparent 55%), " +
            "radial-gradient(ellipse 40% 50% at 60% 10%, rgba(200,152,46,0.06) 0%, transparent 55%)",
        }}
      />
      {/* Animated orbs */}
      {[
        {
          w: 600,
          h: 600,
          top: "-10%",
          left: "-5%",
          dur: 11,
          c: "rgba(200,152,46,0.09)",
        },
        {
          w: 500,
          h: 500,
          bottom: "-8%",
          right: "-4%",
          dur: 15,
          c: "rgba(59,130,246,0.07)",
        },
        {
          w: 350,
          h: 350,
          top: "40%",
          left: "45%",
          dur: 19,
          c: "rgba(200,152,46,0.06)",
        },
      ].map((orb, i) => (
        <Box
          key={i}
          position="fixed"
          borderRadius="full"
          pointerEvents="none"
          zIndex="0"
          style={{
            width: orb.w,
            height: orb.h,
            top: (orb as { top?: string }).top,
            left: (orb as { left?: string }).left,
            bottom: (orb as { bottom?: string }).bottom,
            right: (orb as { right?: string }).right,
            background: `radial-gradient(circle, ${orb.c} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: `floatOrb${i % 2 === 0 ? "1" : "2"} ${orb.dur}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Dot grid */}
      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        zIndex="0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--bdr-1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Max-width shell ────────────────────────────────────── */}
      <Box
        w="full"
        maxW="1300px"
        display="flex"
        position="relative"
        zIndex="1"
        justifyContent="center"
      >
        {/* ══════════════════════════════════════════════════════════
          LEFT PANEL  —  brand / feature showcase  (desktop only)
      ══════════════════════════════════════════════════════════ */}
        <Box
          flex="1"
          display={{ base: "none", lg: "flex" }}
          flexDirection="column"
          position="relative"
          p="12"
        >
          {/* Content — logo at top, main body centered */}
          <Flex direction="column" h="full" position="relative" zIndex="1">
            {/* ── Logo ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Flex align="center" gap="2.5" mb="auto">
                <Flex
                  w="38px"
                  h="38px"
                  borderRadius="8px"
                  overflow="hidden"
                  position="relative"
                  flexShrink={0}
                >
                  <Image
                    src="/fj_logo_white.png"
                    alt="FJ"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Flex>
                <Text
                  className="font-heading"
                  fontWeight="700"
                  fontSize="xl"
                  letterSpacing="-0.01em"
                  color="var(--fg-1)"
                >
                  FJ Applaud
                </Text>
              </Flex>
            </motion.div>

            {/* ── Main content — vertically centered ────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                paddingTop: "24px",
                paddingBottom: "24px",
              }}
            >
              <motion.div variants={fadeUp}>
                <Flex
                  align="center"
                  gap="1.5"
                  mb="5"
                  px="3"
                  py="1"
                  borderRadius="full"
                  display="inline-flex"
                  borderWidth="1px"
                  borderColor="var(--app-accent-border)"
                  bg="var(--app-accent-muted)"
                >
                  <Box
                    w="5px"
                    h="5px"
                    borderRadius="full"
                    bg="var(--app-accent)"
                    style={{ animation: "pulseDot 2s ease-in-out infinite" }}
                  />
                  <Text
                    fontSize="10px"
                    fontWeight="600"
                    color="var(--app-accent)"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                  >
                    FISCHERJORDAN APPLAUD
                  </Text>
                </Flex>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Text
                  className="font-heading"
                  fontSize={{ lg: "34px", xl: "42px" }}
                  fontWeight="800"
                  letterSpacing="-0.02em"
                  lineHeight="1.12"
                  color="var(--fg-1)"
                  maxW="400px"
                  mb="4"
                >
                  Recognize the people{" "}
                  <Box as="span" className="text-gradient">
                    who make a difference
                  </Box>
                </Text>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Text
                  fontSize="sm"
                  color="var(--fg-3)"
                  lineHeight="1.8"
                  maxW="340px"
                  mb="8"
                >
                  Celebrate the colleagues who go the extra mile. Submit a
                  recognition, vote for your nominee, or see who&apos;s leading
                  this month.
                </Text>
              </motion.div>

              {/* Feature bullets */}
              <Flex direction="column" gap="4">
                {FEATURES.map((f) => (
                  <motion.div key={f.title} variants={fadeUp}>
                    <Flex align="flex-start" gap="3.5">
                      <Flex
                        w="32px"
                        h="32px"
                        borderRadius="9px"
                        flexShrink={0}
                        bg="var(--app-accent-muted)"
                        borderWidth="1px"
                        borderColor="var(--app-accent-border)"
                        align="center"
                        justify="center"
                        fontSize="13px"
                        color="var(--app-accent)"
                      >
                        <f.Icon size={14} />
                      </Flex>
                      <Box pt="0.5">
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="var(--fg-1)"
                          mb="1"
                        >
                          {f.title}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="var(--fg-3)"
                          lineHeight="1.65"
                        >
                          {f.desc}
                        </Text>
                      </Box>
                    </Flex>
                  </motion.div>
                ))}
              </Flex>
            </motion.div>
          </Flex>
        </Box>

        {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL  —  auth card
      ══════════════════════════════════════════════════════════ */}
        <Box
          w={{ base: "full", lg: "480px" }}
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: "6", md: "10" }}
          position="relative"
        >
          {/* Mobile-only background orb */}
          <Box
            display={{ base: "block", lg: "none" }}
            position="absolute"
            w="500px"
            h="500px"
            borderRadius="full"
            pointerEvents="none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(200,152,46,0.1) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            style={{
              width: "100%",
              maxWidth: "400px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── Card ──────────────────────────────────────────── */}
            <Box
              borderRadius="20px"
              borderWidth="1px"
              borderColor="var(--bdr-2)"
              overflow="hidden"
              style={{
                background: "var(--sur-login)",
                backdropFilter: "blur(32px)",
                boxShadow: "var(--shadow-login)",
              }}
            >
              {/* Top accent shimmer */}
              <Box
                h="1px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 5%, var(--app-accent-border) 35%, var(--app-accent) 50%, var(--app-accent-border) 65%, transparent 95%)",
                }}
              />

              <Box px="9" py="9">
                <motion.div variants={stagger} initial="hidden" animate="show">
                  {/* ── Brand mark ──────────────────────────── */}
                  <motion.div variants={fadeUp}>
                    <Flex direction="column" align="center" gap="3" mb="7">
                      {/* Logo + wordmark */}
                      <Flex
                        w="56px"
                        h="56px"
                        borderRadius="14px"
                        overflow="hidden"
                        position="relative"
                        flexShrink={0}
                      >
                        <Image
                          src="/fj_logo_white.png"
                          alt="FJ Applaud"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Flex>
                      <Flex direction="column" align="center" gap="1">
                        <Text
                          className="font-heading"
                          fontSize="20px"
                          fontWeight="800"
                          letterSpacing="-0.02em"
                          color="var(--fg-1)"
                          lineHeight="1"
                        >
                          FJ Applaud
                        </Text>
                        <Text
                          fontSize="11px"
                          color="var(--fg-3)"
                          letterSpacing="0.05em"
                          textTransform="uppercase"
                          fontWeight="500"
                        >
                          Employee Recognition
                        </Text>
                      </Flex>
                    </Flex>
                  </motion.div>

                  {/* ── Divider ──────────────────────────────── */}
                  <motion.div
                    variants={fadeUp}
                    style={{
                      height: "1px",
                      background: "var(--bdr-1)",
                      marginBottom: "28px",
                    }}
                  />

                  {/* ── Copy ─────────────────────────────────── */}
                  <motion.div variants={fadeUp}>
                    <Flex
                      direction="column"
                      align="center"
                      gap="1.5"
                      mb="6"
                      textAlign="center"
                    >
                      <Text
                        className="font-heading"
                        fontSize="17px"
                        fontWeight="700"
                        letterSpacing="-0.01em"
                        color="var(--fg-1)"
                        lineHeight="1.2"
                      >
                        Welcome back
                      </Text>
                      <Text
                        fontSize="13px"
                        color="var(--fg-2)"
                        lineHeight="1.65"
                        maxW="280px"
                      >
                        Sign in to recognize your colleagues and cast your vote
                        for this cycle.
                      </Text>
                    </Flex>
                  </motion.div>

                  {/* ── Google button ─────────────────────────── */}
                  <motion.div variants={fadeUp}>
                    <motion.button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                      whileTap={!loading ? { scale: 0.975 } : {}}
                      style={{
                        width: "100%",
                        height: "50px",
                        borderRadius: "12px",
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow:
                          "0 1px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)",
                        opacity: loading ? 0.72 : 1,
                        transition: "box-shadow 0.2s",
                        marginBottom: "14px",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid rgba(0,0,0,0.12)",
                                borderTopColor: "#4285F4",
                                borderRadius: "50%",
                                animation: "spin 0.7s linear infinite",
                                flexShrink: 0,
                                display: "inline-block",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#3c4043",
                              }}
                            >
                              Signing in…
                            </span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <FcGoogle size={18} />
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#3c4043",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              Continue with Google
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>

                  {/* ── Domain hint ───────────────────────────── */}
                  <motion.div variants={fadeUp}>
                    <Flex align="center" gap="2" justify="center" mb="7">
                      <Box
                        w="4px"
                        h="4px"
                        borderRadius="full"
                        bg="var(--app-accent)"
                        style={{
                          animation: "pulseDot 2.5s ease-in-out infinite",
                          flexShrink: 0,
                        }}
                      />
                      <Text
                        fontSize="11px"
                        color="var(--fg-3)"
                        letterSpacing="0.01em"
                      >
                        Use your{" "}
                        <Box as="span" color="var(--fg-1)" fontWeight="600">
                          @fischerjordan.com
                        </Box>{" "}
                        account
                      </Text>
                    </Flex>
                  </motion.div>

                  {/* ── Fine print ────────────────────────────── */}
                  <motion.div variants={fadeUp}>
                    <Text
                      fontSize="11px"
                      color="var(--fg-4)"
                      textAlign="center"
                      lineHeight="1.8"
                    >
                      By signing in you agree to Fischer Jordan&apos;s internal
                      use policy.
                      <br />© 2026 Fischer Jordan. All rights reserved.
                    </Text>
                  </motion.div>
                </motion.div>
              </Box>
            </Box>

            {/* ── Security note below card ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              <Flex align="center" justify="center" gap="1.5" mt="5">
                <LuShieldCheck
                  size={11}
                  style={{ flexShrink: 0, color: "var(--fg-3)" }}
                />
                <Text
                  fontSize="11px"
                  color="var(--fg-3)"
                  letterSpacing="0.01em"
                >
                  Secured via Google OAuth · Internal use only
                </Text>
              </Flex>
            </motion.div>
          </motion.div>
        </Box>
      </Box>
      {/* end max-width shell */}
    </Box>
  );
}
