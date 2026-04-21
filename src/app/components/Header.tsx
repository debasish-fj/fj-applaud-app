"use client";

import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuSun,
  LuMoon,
  LuMenu,
  LuX,
  LuSparkles,
  LuThumbsUp,
  LuTrophy,
  LuLogOut,
  LuUser,
} from "react-icons/lu";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "../context/theme";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const NAV_LINKS = [
  { href: "/review", label: "Recognize", Icon: LuSparkles },
  { href: "/vote", label: "Vote", Icon: LuThumbsUp },
  { href: "/leaderboard", label: "Leaderboard", Icon: LuTrophy },
];

/* ─── Component ──────────────────────────────────────────────────── */
export function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;
  const initials = getInitials(userName);

  // Close user menu on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [userMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname === "/login") return null;

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="100"
        bg={scrolled || mobileOpen ? "var(--sur-header)" : "transparent"}
        backdropFilter={scrolled || mobileOpen ? "blur(22px)" : "none"}
        borderBottomWidth={scrolled || mobileOpen ? "1px" : "0"}
        borderColor="var(--bdr-1)"
        boxShadow={scrolled ? "var(--shadow-header)" : "none"}
        style={{
          transition:
            "background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <Container maxW="5xl" py="0">
          <Flex justify="space-between" align="center" h="62px">
            {/* ── Logo ─────────────────────────────────────────── */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <Flex
                  w="34px"
                  h="34px"
                  position="relative"
                  borderRadius="7px"
                  overflow="hidden"
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
                  fontWeight="800"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="-0.02em"
                  color="var(--fg-1)"
                  style={{ transition: "none" }}
                >
                  FJ{" "}
                  <Box as="span" className="text-gradient">
                    Applaud
                  </Box>
                </Text>
              </motion.div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────── */}
            <HStack
              gap="1"
              display={{ base: "none", md: "flex" }}
              px="2"
              py="1.5"
              borderRadius="13px"
              borderWidth="1px"
              borderColor="var(--bdr-2)"
              bg="var(--sur-1)"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {NAV_LINKS.map(({ href, label, Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link href={href} key={href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Box
                        position="relative"
                        px="4"
                        py="2"
                        borderRadius="10px"
                        cursor="pointer"
                        borderWidth="1px"
                        borderColor={
                          isActive ? "var(--app-accent-border)" : "transparent"
                        }
                        bg={
                          isActive ? "var(--app-accent-muted)" : "transparent"
                        }
                        _hover={{
                          bg: isActive
                            ? "var(--app-accent-muted)"
                            : "var(--sur-2)",
                          borderColor: isActive
                            ? "var(--app-accent-border)"
                            : "var(--bdr-2)",
                        }}
                        style={{
                          transition:
                            "background 0.18s ease, border-color 0.18s ease",
                          boxShadow: isActive
                            ? "0 0 0 1px rgba(212,168,61,0.12), 0 2px 12px -4px rgba(212,168,61,0.2)"
                            : "none",
                        }}
                      >
                        <Flex align="center" gap="2">
                          <Box
                            style={{
                              color: isActive
                                ? "var(--app-accent)"
                                : "var(--fg-3)",
                              transition: "color 0.18s, transform 0.18s",
                              display: "flex",
                              alignItems: "center",
                            }}
                            _groupHover={{ color: "var(--fg-1)" }}
                          >
                            <Icon size={14} />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight={isActive ? "700" : "500"}
                            letterSpacing={isActive ? "-0.01em" : "0"}
                            color={
                              isActive ? "var(--app-accent)" : "var(--fg-2)"
                            }
                            _hover={{
                              color: isActive
                                ? "var(--app-accent)"
                                : "var(--fg-1)",
                            }}
                            style={{ transition: "color 0.18s" }}
                          >
                            {label}
                          </Text>
                          {isActive && (
                            <Box
                              w="5px"
                              h="5px"
                              borderRadius="full"
                              bg="var(--app-accent)"
                              flexShrink={0}
                              style={{
                                boxShadow: "0 0 6px rgba(212,168,61,0.6)",
                                animation: "pulseDot 2.5s ease-in-out infinite",
                              }}
                            />
                          )}
                        </Flex>
                      </Box>
                    </motion.div>
                  </Link>
                );
              })}
            </HStack>

            {/* ── Right controls ───────────────────────────────── */}
            <HStack gap="2">
              {/* Theme toggle */}
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.86 }}
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: "1px solid var(--bdr-2)",
                  background: "var(--sur-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--fg-3)",
                  flexShrink: 0,
                }}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.span
                      key="moon"
                      initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 40, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex" }}
                    >
                      <LuMoon size={14} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ rotate: 40, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -40, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex" }}
                    >
                      <LuSun size={15} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User avatar / auth */}
              {status === "authenticated" ? (
                <Box position="relative" ref={userMenuRef}>
                  <motion.div
                    onClick={() => setUserMenuOpen((v) => !v)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={userName ?? userEmail ?? ""}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: "var(--app-accent-muted)",
                      border: "1px solid var(--app-accent-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={userName ?? "User"}
                        width={34}
                        height={34}
                        style={{ objectFit: "cover", borderRadius: 9 }}
                      />
                    ) : (
                      <Text
                        fontSize="10px"
                        fontWeight="800"
                        color="var(--app-accent)"
                        letterSpacing="0.04em"
                        style={{ transition: "none" }}
                      >
                        {initials}
                      </Text>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        key="user-menu"
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          right: 0,
                          minWidth: 210,
                          borderRadius: 12,
                          border: "1px solid var(--bdr-2)",
                          background: "var(--sur-header)",
                          backdropFilter: "blur(22px)",
                          boxShadow:
                            "0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.04) inset",
                          zIndex: 200,
                          overflow: "hidden",
                        }}
                      >
                        {/* User info */}
                        <Box
                          px="4"
                          py="3.5"
                          borderBottomWidth="1px"
                          borderColor="var(--bdr-1)"
                        >
                          <Flex align="center" gap="2.5">
                            <Flex
                              w="32px"
                              h="32px"
                              borderRadius="8px"
                              flexShrink={0}
                              bg="var(--app-accent-muted)"
                              border="1px solid var(--app-accent-border)"
                              align="center"
                              justify="center"
                              overflow="hidden"
                            >
                              {userImage ? (
                                <Image
                                  src={userImage}
                                  alt={userName ?? "User"}
                                  width={32}
                                  height={32}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              ) : (
                                <Text
                                  fontSize="9px"
                                  fontWeight="800"
                                  color="var(--app-accent)"
                                  letterSpacing="0.04em"
                                >
                                  {initials}
                                </Text>
                              )}
                            </Flex>
                            <Box minW="0">
                              <Text
                                fontSize="13px"
                                fontWeight="600"
                                color="var(--fg-1)"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {userName ?? "User"}
                              </Text>
                              {userEmail && (
                                <Text
                                  fontSize="11px"
                                  color="var(--fg-3)"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {userEmail}
                                </Text>
                              )}
                            </Box>
                          </Flex>
                        </Box>

                        {/* Sign out */}
                        <Box px="2" py="2">
                          <motion.button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            whileHover={{ x: 2 }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              background: "transparent",
                              border: "none",
                              color: "var(--fg-2)",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "var(--sur-2)";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "var(--fg-1)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "transparent";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "var(--fg-2)";
                            }}
                          >
                            <LuLogOut size={13} />
                            Sign out
                          </motion.button>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              ) : status === "unauthenticated" ? (
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      height: 34,
                      paddingLeft: 12,
                      paddingRight: 12,
                      borderRadius: 9,
                      background: "var(--sur-1)",
                      border: "1px solid var(--bdr-2)",
                      cursor: "pointer",
                      color: "var(--fg-2)",
                      flexShrink: 0,
                    }}
                  >
                    <LuUser size={13} />
                    <Text
                      fontSize="13px"
                      fontWeight="500"
                      color="var(--fg-2)"
                      style={{ transition: "none" }}
                    >
                      Sign in
                    </Text>
                  </motion.div>
                </Link>
              ) : (
                /* loading skeleton */
                <Box
                  w="34px"
                  h="34px"
                  borderRadius="9px"
                  bg="var(--sur-2)"
                  border="1px solid var(--bdr-1)"
                  flexShrink={0}
                  style={{ animation: "pulse 1.5s ease-in-out infinite" }}
                />
              )}

              {/* Hamburger — mobile only */}
              <Box display={{ base: "flex", md: "none" }}>
                <motion.button
                  onClick={() => setMobileOpen((v) => !v)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    border: "1px solid var(--bdr-2)",
                    background: mobileOpen
                      ? "var(--app-accent-muted)"
                      : "var(--sur-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: mobileOpen ? "var(--app-accent)" : "var(--fg-2)",
                    flexShrink: 0,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.span
                        key="close"
                        initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                        style={{ display: "flex" }}
                      >
                        <LuX size={16} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                        style={{ display: "flex" }}
                      >
                        <LuMenu size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Box>
            </HStack>
          </Flex>
        </Container>

        {/* ── Mobile menu dropdown ─────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
              style={{ overflow: "hidden" }}
            >
              <Box
                borderTopWidth="1px"
                borderColor="var(--bdr-1)"
                px="4"
                pb="4"
                pt="2"
              >
                {NAV_LINKS.map(({ href, label, Icon }, idx) => {
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * 0.06,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <Link href={href}>
                        <Flex
                          align="center"
                          justify="space-between"
                          px="4"
                          py="3.5"
                          borderRadius="12px"
                          bg={
                            isActive ? "var(--app-accent-muted)" : "transparent"
                          }
                          borderWidth="1px"
                          borderColor={
                            isActive
                              ? "var(--app-accent-border)"
                              : "transparent"
                          }
                          cursor="pointer"
                          mt={idx === 0 ? "1" : "1.5"}
                          _hover={{
                            bg: isActive
                              ? "var(--app-accent-muted)"
                              : "var(--sur-2)",
                            borderColor: isActive
                              ? "var(--app-accent-border)"
                              : "var(--bdr-1)",
                          }}
                          style={{ transition: "all 0.15s ease" }}
                        >
                          <Flex align="center" gap="3">
                            <Icon
                              size={15}
                              style={{
                                color: isActive
                                  ? "var(--app-accent)"
                                  : "var(--fg-3)",
                              }}
                            />
                            <Text
                              fontSize="sm"
                              fontWeight={isActive ? "700" : "500"}
                              color={
                                isActive ? "var(--app-accent)" : "var(--fg-1)"
                              }
                            >
                              {label}
                            </Text>
                          </Flex>
                          {isActive && (
                            <Box
                              w="6px"
                              h="6px"
                              borderRadius="full"
                              bg="var(--app-accent)"
                            />
                          )}
                        </Flex>
                      </Link>
                    </motion.div>
                  );
                })}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(10, 18, 24, 0.5)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
