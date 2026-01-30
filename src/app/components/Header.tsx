"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="white/10"
      bg="rgba(38, 56, 68, 0.85)"
      backdropFilter="blur(12px)"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Container maxW="4xl" py="4">
        <Flex justify="space-between" align="center">
          <Link href="/">
            <HStack gap="3" cursor="pointer" _hover={{ opacity: 0.9 }}>
              <Flex w={10} h={10} position="relative" borderRadius="full" overflow="hidden">
                <Image
                  src="https://fischerjordan.com/wp-content/uploads/2019/10/FJ-logo-vertical-blue-xl-cropped.jpg"
                  alt="FJ Applaud"
                  fill
                />
              </Flex>
              <Heading size="lg" fontWeight="700" letterSpacing="tight">
                FJ Applaud
              </Heading>
            </HStack>
          </Link>
          <HStack gap="2">
            <Link href="/review">
              <Button
                size="sm"
                variant={pathname === "/review" ? "solid" : "ghost"}
                bg={pathname === "/review" ? "var(--app-accent)" : undefined}
                color={pathname === "/review" ? "white" : "gray.400"}
                _hover={
                  pathname === "/review"
                    ? { bg: "var(--app-accent-hover)" }
                    : { color: "gray.50", bg: "white/5" }
                }
                borderRadius="lg"
                px="4"
              >
                ⭐ Review
              </Button>
            </Link>
            <Link href="/vote">
              <Button
                size="sm"
                variant={pathname === "/vote" ? "solid" : "ghost"}
                bg={pathname === "/vote" ? "var(--app-accent)" : undefined}
                color={pathname === "/vote" ? "white" : "gray.400"}
                _hover={
                  pathname === "/vote"
                    ? { bg: "var(--app-accent-hover)" }
                    : { color: "gray.50", bg: "white/5" }
                }
                borderRadius="lg"
                px="4"
              >
                🗳️ Vote
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="sm"
                variant={pathname === "/leaderboard" ? "solid" : "ghost"}
                bg={pathname === "/leaderboard" ? "var(--app-accent)" : undefined}
                color={pathname === "/leaderboard" ? "white" : "gray.400"}
                _hover={
                  pathname === "/leaderboard"
                    ? { bg: "var(--app-accent-hover)" }
                    : { color: "gray.50", bg: "white/5" }
                }
                borderRadius="lg"
                px="4"
              >
                👥 Leaderboard
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
