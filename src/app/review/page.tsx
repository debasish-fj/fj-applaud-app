"use client";

import {
  Box,
  Button,
  Container,
  Field,
  Flex,
  Heading,
  Portal,
  RadioGroup,
  Select,
  Separator,
  Text,
  Textarea,
  createListCollection,
} from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../components/Header";

const peopleCollection = createListCollection({
  items: [
    { label: "Person A", value: "person-a" },
    { label: "Person B", value: "person-b" },
    { label: "Person C", value: "person-c" },
    { label: "Person D", value: "person-d" },
    { label: "Person E", value: "person-e" },
    { label: "Person F", value: "person-f" },
  ],
});

export default function ReviewPage() {
  const [impact, setImpact] = useState("moderate");

  return (
    <Box minH="100vh" color="gray.50">
      <Header />
      <Container maxW="2xl" py="10" px="6">
        <Box mb="8">
          <Heading size="xl" fontWeight="600" mb="2">
            Hi Rachael,
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Share who helped you out this month!
          </Text>
        </Box>

        <Separator mb="8" borderColor="white/10" />

        <Flex direction="column" gap="8" as="form">
          <Field.Root>
            <Field.Label fontSize="md" fontWeight="500" color="gray.200">
              1. Who helped you this week?
            </Field.Label>
            <Select.Root
              collection={peopleCollection}
              size="md"
              defaultValue={["person-b"]}
              mt="2"
            >
              <Select.HiddenSelect />
              <Select.Control
                bg="rgba(30, 45, 54, 0.8)"
                borderColor="white/15"
                _hover={{ borderColor: "var(--app-accent)" }}
                _focusVisible={{
                  borderColor: "var(--app-accent)",
                  boxShadow: "0 0 0 1px var(--app-accent)",
                }}
              >
                <Select.Trigger borderRadius="lg" py="3" px="4">
                  <Select.ValueText placeholder="Select a colleague" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator color="gray.400" />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content
                    bg="rgba(38, 56, 68, 0.98)"
                    borderColor="white/15"
                    borderRadius="lg"
                    py="1"
                  >
                    {peopleCollection.items.map((person) => (
                      <Select.Item
                        item={person}
                        key={person.value}
                        _hover={{ bg: "white/10" }}
                        _highlighted={{ bg: "var(--app-accent-muted)" }}
                      >
                        {person.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Field.Root>

          <Field.Root required>
            <Field.Label fontSize="md" fontWeight="500" color="gray.200">
              2. How did they help? Describe their main contribution. *
            </Field.Label>
            <Field.HelperText color="gray.500" fontStyle="italic" mt="1" mb="2">
              E.g., Solved a technical problem / unblock; covered a task /
              shifted workload; gave helpful advice / mentoring; went
              above-and-beyond in another way
            </Field.HelperText>
            <Textarea
              placeholder="Describe how this person made a difference..."
              minH="32"
              borderRadius="lg"
              bg="rgba(30, 45, 54, 0.8)"
              borderColor="white/15"
              _placeholder={{ color: "gray.500" }}
              _hover={{ borderColor: "var(--app-accent)" }}
              _focus={{
                borderColor: "var(--app-accent)",
                boxShadow: "0 0 0 1px var(--app-accent)",
              }}
              resize="vertical"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label fontSize="md" fontWeight="500" color="gray.200" alignSelf="flex-start" alignItems="flex-start" justifyContent="flex-start">
              3.{" "}
              <Text as="span" fontWeight="600">
                Impact:
              </Text>{" "}
              How would you rate the measurable impact of this person&apos;s
              help on the outcome (project/customer/metric)? *
            </Field.Label>
            <RadioGroup.Root
              value={impact}
              onValueChange={(e) => setImpact(e.value ?? "moderate")}
              mt="4"
              display="flex"
              flexDirection="column"
              gap="3"
            >
              {[
                {
                  value: "game-changing",
                  label:
                    "Game-changing: prevented failure / unlocked major outcome",
                },
                {
                  value: "moderate",
                  label: "Moderate impact: meaningful contribution to progress",
                },
                {
                  value: "low",
                  label: "Low impact: helpful but limited effect on outcome",
                },
              ].map((option) => (
                <RadioGroup.Item
                  key={option.value}
                  value={option.value}
                  bg="rgba(30, 45, 54, 0.8)"
                  borderWidth="1px"
                  borderColor="white/15"
                  borderRadius="lg"
                  px="4"
                  py="3"
                  cursor="pointer"
                  _hover={{ borderColor: "var(--app-accent)" }}
                  _checked={{
                    borderColor: "var(--app-accent)",
                    bg: "var(--app-accent-muted)",
                  }}
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText color="gray.200">
                    {option.label}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </Field.Root>

          <Button
            type="submit"
            size="lg"
            variant="solid"
            bg="var(--app-accent)"
            color="white"
            borderRadius="xl"
            mt="4"
            py="6"
            fontWeight="600"
            _hover={{
              bg: "var(--app-accent-hover)",
              transform: "translateY(-1px)",
              boxShadow: "0 8px 25px -5px rgba(197, 151, 43, 0.35)",
            }}
            transition="all 0.2s"
          >
            Submit recognition
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
