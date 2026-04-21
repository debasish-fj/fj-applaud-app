"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSun, LuMoon, LuLogOut, LuUser } from "react-icons/lu";
import { useTheme } from "../context/theme";
import { useSession, signOut } from "next-auth/react";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function LogoBar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;
  const initials = getInitials(userName);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/login") return null;

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      bg={scrolled ? "var(--sur-header)" : "transparent"}
      backdropFilter={scrolled ? "blur(22px)" : "none"}
      borderBottomWidth={scrolled ? "1px" : "0"}
      borderColor="var(--bdr-1)"
      boxShadow={scrolled ? "var(--shadow-header)" : "none"}
      style={{
        transition:
          "background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s, border-color 0.3s",
      }}
    >
      <Flex
        maxW="5xl"
        mx="auto"
        px="6"
        h="58px"
        align="center"
        justify="space-between"
      >
        {/* Logo — links home on every screen */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <Flex
              w="32px"
              h="32px"
              position="relative"
              borderRadius="8px"
              overflow="hidden"
              flexShrink={0}
            >
              <Image
                src="/fj_logo_white.png"
                alt="FJ Applaud"
                fill
                style={{ objectFit: "cover" }}
              />
            </Flex>
            <Text
              className="font-heading"
              fontWeight="800"
              fontSize="lg"
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

        <Flex align="center" gap="2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.86 }}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
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

          {/* User avatar */}
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
                  overflow: "hidden",
                  flexShrink: 0,
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
                        "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)",
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
                              style={{ objectFit: "cover", borderRadius: 8 }}
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
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--fg-1)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--fg-2)";
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
            <Box
              w="34px"
              h="34px"
              borderRadius="9px"
              bg="var(--sur-2)"
              border="1px solid var(--bdr-1)"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
