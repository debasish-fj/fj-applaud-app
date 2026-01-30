"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Header } from "../components/Header";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Person A", recognitions: 12, impact: "High" },
  { rank: 2, name: "Person B", recognitions: 10, impact: "High" },
  { rank: 3, name: "Person C", recognitions: 8, impact: "Moderate" },
  { rank: 4, name: "Person D", recognitions: 7, impact: "High" },
  { rank: 5, name: "Person E", recognitions: 5, impact: "Moderate" },
  { rank: 6, name: "Person F", recognitions: 4, impact: "Moderate" },
];

export default function LeaderboardPage() {
  return (
    <Box minH="100vh" color="gray.50">
      <Header />
      <Container maxW="3xl" py="10" px="6">
        <Box mb="10">
          <Heading size="xl" fontWeight="600" mb="2">
            Leaderboard
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Top recognized colleagues this month
          </Text>
        </Box>

        <VStack gap="3" align="stretch">
          {LEADERBOARD_DATA.map((person, index) => (
            <Box
              key={person.name}
              bg="rgba(30, 45, 54, 0.8)"
              borderWidth="1px"
              borderColor={
                index < 3 ? "rgba(197, 151, 43, 0.4)" : "white/10"
              }
              borderRadius="xl"
              px="6"
              py="4"
              _hover={{
                borderColor: "var(--app-accent)",
                bg: "rgba(30, 45, 54, 0.95)",
              }}
              transition="all 0.2s"
            >
              <Flex justify="space-between" align="center">
                <HStack gap="4">
                  <Box
                    w="10"
                    h="10"
                    borderRadius="full"
                    bg={
                      index === 0
                        ? "var(--app-accent-muted)"
                        : index === 1
                          ? "rgba(255,255,255,0.08)"
                          : index === 2
                            ? "rgba(197, 151, 43, 0.2)"
                            : "rgba(255,255,255,0.06)"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                    color={index < 3 ? "var(--app-accent)" : "gray.400"}
                  >
                    {person.rank}
                  </Box>
                  <VStack align="start" gap="0">
                    <Text fontWeight="600" fontSize="lg">
                      {person.name}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {person.recognitions} recognition
                      {person.recognitions !== 1 ? "s" : ""}
                    </Text>
                  </VStack>
                </HStack>
                <Box
                  px="3"
                  py="1"
                  borderRadius="full"
                  bg="var(--app-accent-muted)"
                  borderWidth="1px"
                  borderColor="rgba(197, 151, 43, 0.35)"
                >
                  <Text fontSize="sm" fontWeight="500" color="var(--app-accent)">
                    {person.impact} impact
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
