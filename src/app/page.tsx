"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <Box minH="100vh" color="gray.50">
      <Header />
      <Container maxW="4xl" py="20" px="6">
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          gap="10"
          py="16"
        >
          <Heading
            size="2xl"
            fontWeight="700"
            letterSpacing="tight"
            maxW="2xl"
            lineHeight="1.2"
          >
            Recognize the people who make a difference
          </Heading>
          <Text color="gray.400" fontSize="xl" maxW="lg">
            FJ Applaud helps teams celebrate contributions. Submit a review or
            see who’s leading the pack.
          </Text>
          <Flex gap="4" flexWrap="wrap" justify="center">
            <Link href="/review">
              <Button
                size="lg"
                variant="solid"
                bg="var(--app-accent)"
                color="white"
                borderRadius="xl"
                px="8"
                py="6"
                fontWeight="600"
                _hover={{
                  bg: "var(--app-accent-hover)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px -5px rgba(197, 151, 43, 0.35)",
                }}
                transition="all 0.2s"
              >
                ⭐ Submit recognition
              </Button>
            </Link>
            <Link href="/vote">
              <Button
                size="lg"
                variant="outline"
                borderColor="white/20"
                color="gray.200"
                borderRadius="xl"
                px="8"
                py="6"
                fontWeight="600"
                _hover={{
                  borderColor: "var(--app-accent)",
                  color: "var(--app-accent)",
                  bg: "var(--app-accent-muted)",
                }}
                transition="all 0.2s"
              >
                🗳️ Vote
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                borderColor="white/20"
                color="gray.200"
                borderRadius="xl"
                px="8"
                py="6"
                fontWeight="600"
                _hover={{
                  borderColor: "var(--app-accent)",
                  color: "var(--app-accent)",
                  bg: "var(--app-accent-muted)",
                }}
                transition="all 0.2s"
              >
                👥 View leaderboard
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
