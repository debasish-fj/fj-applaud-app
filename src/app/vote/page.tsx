"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Portal,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Dialog, CloseButton } from "@chakra-ui/react";

const CANDIDATES = [
  { id: "person-a", name: "Person A", icon: "👥" },
  { id: "person-b", name: "Person B", icon: "👩‍💼" },
  { id: "person-c", name: "Person C", icon: "💡" },
  { id: "person-d", name: "Person D", icon: "📱" },
  { id: "person-e", name: "Person E", icon: "👔" },
];

type TeamFeedback = {
  combinedFeedback: string;
  impact: string;
  collaboration: string;
  initiatives: string;
  values: string;
};

const TEAM_FEEDBACK: Record<string, TeamFeedback> = {
  "person-a": {
    combinedFeedback:
      "Person A consistently unblocked the team during the last release. They coordinated across squads, ran standups, and made sure everyone had what they needed. Multiple teammates called out their availability and willingness to jump in on any task.",
    impact: "High — directly enabled the on-time launch by removing blockers.",
    collaboration: "Excellent cross-team coordination and clear communication.",
    initiatives: "Led the release coordination and volunteered for overflow tasks.",
    values: "Teamwork, reliability, and inclusivity.",
  },
  "person-b": {
    combinedFeedback:
      "Person B kept stakeholders aligned and drove client communication throughout the project. Very organized and detail-oriented, which helped the team stay on track and avoid rework.",
    impact: "High — prevented misalignment and kept the project on schedule.",
    collaboration: "Strong stakeholder management and documentation.",
    initiatives: "Owned client updates and created the project status dashboard.",
    values: "Excellence, accountability, and clarity.",
  },
  "person-c": {
    combinedFeedback:
      "Person C came up with the solution that saved the launch. They provided strong technical leadership and mentoring, and consistently went above and beyond—often staying late to unblock others and share knowledge.",
    impact: "Game-changing — prevented failure and unlocked major outcome.",
    collaboration: "Mentored 3 engineers and led the technical design review.",
    initiatives: "Proposed and implemented the fix that unblocked production.",
    values: "Innovation, growth, and going the extra mile.",
  },
  "person-d": {
    combinedFeedback:
      "Person D drove the mobile initiative to completion with a strong focus on quality and UX. Great collaboration with design and product, and always advocated for the end user.",
    impact: "High — delivered the mobile release on time with strong adoption.",
    collaboration: "Close partnership with design and product; ran user testing sessions.",
    initiatives: "Led the mobile roadmap and quality improvements.",
    values: "Quality, user focus, and collaboration.",
  },
  "person-e": {
    combinedFeedback:
      "Person E was reliable and professional in every interaction. A steady contributor and team player who brought clarity to ambiguous requirements and helped others stay focused.",
    impact: "Moderate — meaningful contribution to progress and team morale.",
    collaboration: "Dependable partner; often helped clarify scope and requirements.",
    initiatives: "Improved our requirements template and ran retro facilitation.",
    values: "Integrity, consistency, and respect.",
  },
};

export default function VotePage() {
  const [selected, setSelected] = useState<string>("person-c");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPersonId, setFeedbackPersonId] = useState<string | null>(null);

  const openFeedback = (personId: string) => {
    setFeedbackPersonId(personId);
    setFeedbackOpen(true);
  };
  const closeFeedback = () => {
    setFeedbackOpen(false);
    setFeedbackPersonId(null);
  };

  const feedback = feedbackPersonId
    ? TEAM_FEEDBACK[feedbackPersonId] ?? TEAM_FEEDBACK["person-c"]
    : null;
  const feedbackPersonName =
    CANDIDATES.find((c) => c.id === feedbackPersonId)?.name ?? "";

  return (
    <Box minH="100vh" color="gray.50">
      <Header />
      <Container maxW="2xl" py="10" px="6">
        <Box mb="6">
          <Heading size="xl" fontWeight="600" mb="2">
            Hi Rachael,
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Let&apos;s vote!
          </Text>
        </Box>

        <Box
          h="1px"
          bg="white/10"
          mb="8"
          aria-hidden
        />

        <RadioGroup.Root
          value={selected}
          onValueChange={(e) => setSelected(e.value ?? "person-c")}
          gap="4"
        >
          <VStack gap="4" align="stretch">
            {CANDIDATES.map((candidate) => (
              <Box
                key={candidate.id}
                bg="rgba(30, 45, 54, 0.8)"
                borderWidth="1px"
                borderColor={
                  selected === candidate.id
                    ? "var(--app-accent)"
                    : "white/15"
                }
                borderRadius="xl"
                px="5"
                py="4"
                _hover={{ borderColor: "var(--app-accent)" }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" gap="4">
                  <RadioGroup.Item
                    value={candidate.id}
                    cursor="pointer"
                    flex="1"
                  >
                    <HStack gap="4">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <Box
                        w="10"
                        h="10"
                        borderRadius="lg"
                        bg="gray.700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xl"
                        flexShrink={0}
                      >
                        {candidate.icon}
                      </Box>
                      <Text fontWeight="500" fontSize="lg">
                        {candidate.name}
                      </Text>
                    </HStack>
                  </RadioGroup.Item>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="var(--app-accent)"
                    color="var(--app-accent)"
                    bg="var(--app-accent-muted)"
                    borderRadius="lg"
                    _hover={{
                      borderColor: "var(--app-accent-hover)",
                      bg: "rgba(197, 151, 43, 0.25)",
                      color: "var(--app-accent-hover)",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openFeedback(candidate.id);
                    }}
                    flexShrink={0}
                  >
                    View team&apos;s feedback
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>
        </RadioGroup.Root>

        <Flex justify="flex-end" mt="8">
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
            Submit
          </Button>
        </Flex>
      </Container>

      {/* Modal: Team feedback — How did they help + Impact, Collaboration, Initiatives, Values */}
      <Dialog.Root
        open={feedbackOpen}
        onOpenChange={(e) => !e.open && closeFeedback()}
        size="lg"
        lazyMount
        scrollBehavior="inside"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="linear-gradient(to right, #263844, #1e2d36)"
              borderColor="rgba(197, 151, 43, 0.3)"
              borderRadius="xl"
              maxH="90vh"
              display="flex"
              flexDirection="column"
            >
              <Dialog.CloseTrigger
                position="absolute"
                top="3"
                right="3"
                zIndex="10"
                asChild
              >
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body overflowY="auto" py="8" px="8" pt="10">
                {feedback && (
                  <VStack align="stretch" gap="6">
                    <Heading size="lg" fontWeight="600" color="gray.50">
                      Team&apos;s feedback — {feedbackPersonName}
                    </Heading>

                    <Box>
                      <Text
                        fontWeight="600"
                        color="gray.200"
                        mb="3"
                        fontSize="md"
                      >
                        How did they help
                      </Text>
                    <Box
                      bg="rgba(30, 45, 54, 0.9)"
                      borderWidth="1px"
                      borderColor="rgba(197, 151, 43, 0.25)"
                      borderRadius="lg"
                      p="4"
                    >
                        <Text color="gray.300" lineHeight="tall">
                          {feedback.combinedFeedback}
                        </Text>
                      </Box>
                    </Box>

                    <Box>
                      <Text
                        fontWeight="600"
                        color="gray.200"
                        mb="2"
                        fontSize="md"
                      >
                        Impact
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {feedback.impact}
                      </Text>
                    </Box>

                    <Box>
                      <Text
                        fontWeight="600"
                        color="gray.200"
                        mb="2"
                        fontSize="md"
                      >
                        Collaboration
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {feedback.collaboration}
                      </Text>
                    </Box>

                    <Box>
                      <Text
                        fontWeight="600"
                        color="gray.200"
                        mb="2"
                        fontSize="md"
                      >
                        Initiatives
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {feedback.initiatives}
                      </Text>
                    </Box>

                    <Box>
                      <Text
                        fontWeight="600"
                        color="gray.200"
                        mb="2"
                        fontSize="md"
                      >
                        Values
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {feedback.values}
                      </Text>
                    </Box>
                  </VStack>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
