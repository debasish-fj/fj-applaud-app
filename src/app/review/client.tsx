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
  Text,
  Textarea,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Link from "next/link";
import { LuSparkles, LuCheck, LuPencil, LuChevronRight } from "react-icons/lu";
import { useTheme } from "../context/theme";
import { useSession } from "next-auth/react";
import {
  getCurrentWeek,
  getEligibleNominees,
  getNominationFormSchema,
  submitNomination,
} from "../lib/api";
import type {
  CurrentWeek,
  EligibleNominee,
  NominationFormSchema,
  RatingScore,
} from "../lib/api-types";

/* ─── Constants ───────────────────────────────────────────────── */

const CONFETTI_COLORS = [
  "#c8982e",
  "#e8c870",
  "#ffd700",
  "#daa83c",
  "#86efac",
  "#6ee7b7",
  "#ffffff",
  "#f0f4f8",
];

/* ─── Helpers ─────────────────────────────────────────────────── */

function useWindowSize() {
  const [size, setSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function getDarkStyle(value: number) {
  if (value === 5)
    return {
      activeBg: "rgba(134,239,172,0.1)",
      activeBorder: "rgba(134,239,172,0.35)",
      activeColor: "#86efac",
    };
  if (value === 3)
    return {
      activeBg: "var(--app-accent-muted)",
      activeBorder: "var(--app-accent-border)",
      activeColor: "var(--app-accent)",
    };
  return {
    activeBg: "var(--sur-2)",
    activeBorder: "var(--bdr-2)",
    activeColor: "var(--fg-3)",
  };
}

function getLightStyle(value: number) {
  if (value === 5)
    return {
      activeBg: "rgba(4,120,87,0.08)",
      activeBorder: "rgba(4,120,87,0.28)",
      activeColor: "#065f46",
    };
  if (value === 3)
    return {
      activeBg: "var(--app-accent-muted)",
      activeBorder: "var(--app-accent-border)",
      activeColor: "var(--app-accent)",
    };
  return {
    activeBg: "var(--sur-2)",
    activeBorder: "var(--bdr-2)",
    activeColor: "var(--fg-3)",
  };
}

function getRatingLabel(
  options: { value: number; label: string }[],
  value: number,
): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

const MIN_NOTE_WORDS = 25;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/* ─── Animated check SVG ──────────────────────────────────────── */

function AnimatedCheck() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      style={{ overflow: "visible" }}
    >
      <motion.circle
        cx="28"
        cy="28"
        r="27"
        fill="rgba(134,239,172,0.06)"
        stroke="rgba(134,239,172,0.15)"
        strokeWidth="1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.25, 1], opacity: [0, 0.4, 0] }}
        transition={{ delay: 0.5, duration: 1.2, repeat: 2 }}
      />
      <motion.circle
        cx="28"
        cy="28"
        r="24"
        fill="rgba(134,239,172,0.1)"
        stroke="#86efac"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        style={{ pathLength: 1 }}
      />
      <motion.path
        d="M16 28 L24 36 L40 20"
        fill="none"
        stroke="#86efac"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.38, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ─── Thread UI primitives ────────────────────────────────────── */

function ThreadDot({
  n,
  isActive,
  isCompleted,
}: {
  n: number;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <Box
      w="30px"
      h="30px"
      borderRadius="full"
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isCompleted || isActive ? "var(--app-accent-muted)" : "var(--sur-2)"}
      style={{
        border: `1.5px solid ${isCompleted || isActive ? "var(--app-accent-border)" : "var(--bdr-1)"}`,
        boxShadow: isActive
          ? "0 0 0 5px var(--app-accent-muted), 0 0 18px -4px rgba(212,168,61,0.25)"
          : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            style={{ display: "flex", color: "var(--app-accent)" }}
          >
            <LuCheck size={13} />
          </motion.div>
        ) : (
          <motion.div
            key={`n${n}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              lineHeight="1"
              style={{
                color: isActive ? "var(--app-accent)" : "var(--fg-4)",
                transition: "color 0.3s",
              }}
            >
              {n}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

function ThreadLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <Box
      w="2px"
      flex="1"
      minH="20px"
      mx="auto"
      mt="1"
      mb="1"
      borderRadius="full"
      overflow="hidden"
      position="relative"
      bg="var(--bdr-1)"
    >
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isCompleted ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, var(--app-accent), rgba(212,168,61,0.45))",
          transformOrigin: "top",
        }}
      />
    </Box>
  );
}

/* ─── Rubric picker (used inside rubric steps) ────────────────── */

function RubricPicker({
  options,
  value,
  onChange,
  theme: t,
}: {
  options: { value: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
  theme: string;
}) {
  return (
    <RadioGroup.Root
      value={String(value)}
      onValueChange={(e) => onChange(Number(e.value ?? value))}
      display="flex"
      flexDirection="column"
      gap="2.5"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const style =
          t === "dark"
            ? getDarkStyle(option.value)
            : getLightStyle(option.value);
        return (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.975 }}
            style={{ borderRadius: "12px" }}
          >
            <RadioGroup.Item
              value={String(option.value)}
              bg={
                isSelected
                  ? style.activeBg
                  : t === "dark"
                    ? "var(--sur-2)"
                    : "white"
              }
              borderWidth="1px"
              borderColor={isSelected ? style.activeBorder : "var(--bdr-1)"}
              borderRadius="12px"
              px="4"
              py="3.5"
              cursor="pointer"
              transition="all 0.18s ease"
              _hover={{ borderColor: style.activeBorder, bg: style.activeBg }}
            >
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <Box ml="1">
                <Text
                  fontWeight="700"
                  fontSize="sm"
                  color={isSelected ? style.activeColor : "var(--fg-1)"}
                  style={{ transition: "color 0.18s" }}
                >
                  {option.label}
                </Text>
              </Box>
            </RadioGroup.Item>
          </motion.div>
        );
      })}
    </RadioGroup.Root>
  );
}

/* ─── Page-header (reused across states) ─────────────────────── */

function PageHeader({ subtitle }: { subtitle: string }) {
  return (
    <Container maxW="xl" px="6" pt={{ base: "10", md: "14" }} pb="2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Flex align="center" gap="4">
          <Flex
            w="46px"
            h="46px"
            borderRadius="14px"
            bg="var(--app-accent-muted)"
            borderWidth="1px"
            borderColor="var(--app-accent-border)"
            align="center"
            justify="center"
            flexShrink={0}
            style={{ color: "var(--app-accent)" }}
          >
            <LuSparkles size={20} />
          </Flex>
          <Box>
            <Heading
              fontSize={{ base: "22px", md: "28px" }}
              fontWeight="800"
              letterSpacing="-0.03em"
              color="var(--fg-1)"
              lineHeight="1.15"
              mb="0.5"
            >
              Submit Recognition
            </Heading>
            <Text
              color="var(--fg-3)"
              fontSize="sm"
              lineHeight="1.5"
              fontWeight="500"
            >
              {subtitle}
            </Text>
          </Box>
        </Flex>
      </motion.div>
    </Container>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export default function ReviewClient() {
  const { theme } = useTheme();
  const { data: session } = useSession();

  /* ── Data state ── */
  const [currentWeek, setCurrentWeek] = useState<CurrentWeek | null>(null);
  const [nominees, setNominees] = useState<EligibleNominee[]>([]);
  const [formSchema, setFormSchema] = useState<NominationFormSchema | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [nominationNotOpen, setNominationNotOpen] = useState(false);
  const [noActiveWeek, setNoActiveWeek] = useState(false);

  /* ── Form state ── */
  const [selectedNomineeId, setSelectedNomineeId] = useState<string>("");
  const [justification, setJustification] = useState("");
  const [ratings, setRatings] = useState({
    impact: 3,
    collaboration: 3,
    initiative: 3,
    values: 3,
  });
  const [notes, setNotes] = useState({
    impact: "",
    collaboration: "",
    initiative: "",
    values: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  /* ── Wizard state ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const windowSize = useWindowSize();

  useEffect(() => {
    async function load() {
      try {
        const week = await getCurrentWeek();
        setCurrentWeek(week);
        if (week.status !== "NOMINATION_OPEN") {
          setNominationNotOpen(true);
          return;
        }
        if (week.has_user_submitted_nomination) {
          setAlreadySubmitted(true);
          return;
        }
        const [nomineeList, schema] = await Promise.all([
          getEligibleNominees(),
          getNominationFormSchema(),
        ]);
        setNominees(nomineeList);
        setFormSchema(schema);
        if (nomineeList.length > 0)
          setSelectedNomineeId(String(nomineeList[0].id));
      } catch (err: unknown) {
        const e = err as { response?: { status: number } };
        if (e.response?.status === 404) setNoActiveWeek(true);
        else setPageError("Could not load the form. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async () => {
    if (!currentWeek || !selectedNomineeId) return;
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await submitNomination({
        week_id: currentWeek.week_id,
        nominee_id: Number(selectedNomineeId),
        justification,
        impact_rating: ratings.impact as RatingScore,
        impact_note: notes.impact,
        collaboration_rating: ratings.collaboration as RatingScore,
        collaboration_note: notes.collaboration,
        initiative_rating: ratings.initiative as RatingScore,
        initiative_note: notes.initiative,
        values_rating: ratings.values as RatingScore,
        values_note: notes.values,
      });
      setShowConfetti(true);
      setSubmitted(true);
      setTimeout(() => setShowConfetti(false), 6000);
    } catch (err: unknown) {
      const e = err as {
        response?: { status: number; data?: Record<string, string[]> };
      };
      if (e.response?.status === 400 && e.response.data)
        setFieldErrors(e.response.data);
      else
        setFieldErrors({
          __general__: ["Submission failed. Please try again."],
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setShowConfetti(false);
    setJustification("");
    setCurrentStep(0);
    setStepError("");
    setRatings({ impact: 3, collaboration: 3, initiative: 3, values: 3 });
    setNotes({ impact: "", collaboration: "", initiative: "", values: "" });
    setFieldErrors({});
    if (nominees.length > 0) setSelectedNomineeId(String(nominees[0].id));
  };

  const selectedNominee = nominees.find(
    (n) => String(n.id) === selectedNomineeId,
  );
  const selectedLabel = selectedNominee
    ? `${selectedNominee.first_name} ${selectedNominee.last_name}`
    : "your colleague";
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const nomineesCollection = createListCollection({
    items: nominees.map((n) => ({
      label: `${n.first_name} ${n.last_name}`,
      value: String(n.id),
    })),
  });

  /* ── Wizard step definitions ── */
  type RubricKey = "impact" | "collaboration" | "initiative" | "values";

  interface WizardStep {
    id: string;
    question: string;
    summary: string;
    type: "nominee" | "justification" | "rubric";
    rubricKey?: RubricKey;
    rubricOptions?: { value: number; label: string }[];
    notePlaceholder?: string;
  }

  const wizardSteps: WizardStep[] = [
    {
      id: "nominee",
      question: formSchema?.q1_prompt ?? "Who are you recognizing?",
      summary: selectedNominee
        ? `${selectedNominee.first_name} ${selectedNominee.last_name}`
        : "",
      type: "nominee",
    },
    {
      id: "justification",
      question: formSchema?.q2_prompt ?? "How did they help?",
      summary:
        justification.length > 72
          ? justification.slice(0, 72) + "…"
          : justification,
      type: "justification",
    },
    {
      id: "impact",
      question: formSchema?.impact_rubric.prompt ?? "Rate their impact",
      summary: formSchema
        ? getRatingLabel(formSchema.impact_rubric.options, ratings.impact)
        : "",
      type: "rubric",
      rubricKey: "impact",
      rubricOptions: formSchema?.impact_rubric.options ?? [],
      notePlaceholder: "Share a specific example of their impact…",
    },
    {
      id: "collaboration",
      question:
        formSchema?.collaboration_rubric.prompt ?? "Rate their collaboration",
      summary: formSchema
        ? getRatingLabel(
            formSchema.collaboration_rubric.options,
            ratings.collaboration,
          )
        : "",
      type: "rubric",
      rubricKey: "collaboration",
      rubricOptions: formSchema?.collaboration_rubric.options ?? [],
      notePlaceholder: "Describe how they collaborated with the team…",
    },
    {
      id: "initiative",
      question: formSchema?.initiative_rubric.prompt ?? "Rate their initiative",
      summary: formSchema
        ? getRatingLabel(
            formSchema.initiative_rubric.options,
            ratings.initiative,
          )
        : "",
      type: "rubric",
      rubricKey: "initiative",
      rubricOptions: formSchema?.initiative_rubric.options ?? [],
      notePlaceholder: "Describe an initiative they took…",
    },
    {
      id: "values",
      question:
        formSchema?.values_rubric.prompt ?? "Rate their values alignment",
      summary: formSchema
        ? getRatingLabel(formSchema.values_rubric.options, ratings.values)
        : "",
      type: "rubric",
      rubricKey: "values",
      rubricOptions: formSchema?.values_rubric.options ?? [],
      notePlaceholder: "How did they demonstrate company values…",
    },
  ];

  const rubricKeys: RubricKey[] = [
    "impact",
    "collaboration",
    "initiative",
    "values",
  ];

  function getStepError(step: number): string {
    if (step === 0 && !selectedNomineeId)
      return "Please select a colleague first.";
    if (step === 1 && !justification.trim())
      return "Please write something before continuing.";
    const rubricKey = rubricKeys[step - 2];
    if (rubricKey) {
      const wc = wordCount(notes[rubricKey]);
      if (wc < MIN_NOTE_WORDS)
        return `Please write at least ${MIN_NOTE_WORDS} words (${wc}/${MIN_NOTE_WORDS}).`;
    }
    return "";
  }

  function handleContinue(step: number) {
    const err = getStepError(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError("");
    if (step < wizardSteps.length - 1) {
      setCurrentStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  /* ── Non-form render states ── */

  if (loading) {
    return (
      <>
        <PageHeader subtitle="Loading form…" />
        <Container maxW="xl" px="6" py="8">
          <Flex direction="column" gap="5" style={{ opacity: 0.45 }}>
            {[1, 2, 3].map((i) => (
              <Flex key={i} align="center" gap="4">
                <Box
                  w="30px"
                  h="30px"
                  borderRadius="full"
                  bg="var(--bdr-1)"
                  flexShrink={0}
                />
                <Box
                  flex="1"
                  h="44px"
                  borderRadius="10px"
                  bg="var(--bdr-1)"
                  style={{ animation: "pulse 1.5s ease-in-out infinite" }}
                />
              </Flex>
            ))}
          </Flex>
        </Container>
      </>
    );
  }

  if (noActiveWeek || nominationNotOpen || pageError) {
    return (
      <>
        <PageHeader
          subtitle={noActiveWeek ? "No active week" : "Not currently open"}
        />
        <Container maxW="xl" px="6" py="6">
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="var(--bdr-1)"
            borderRadius="18px"
            px={{ base: "5", md: "8" }}
            py={{ base: "8", md: "10" }}
            textAlign="center"
          >
            <Text fontSize="32px" mb="4">
              ✨
            </Text>
            <Text fontWeight="700" fontSize="md" color="var(--fg-1)" mb="2">
              {pageError
                ? "Something went wrong"
                : noActiveWeek
                  ? "No active polls right now"
                  : "Nominations aren't open yet"}
            </Text>
            <Text
              fontSize="sm"
              color="var(--fg-3)"
              lineHeight="1.7"
              maxW="320px"
              mx="auto"
            >
              {pageError ??
                (noActiveWeek
                  ? "Check back soon — a new cycle will begin shortly."
                  : "Nominations will open at the start of the next cycle.")}
            </Text>
            <Link href="/">
              <Button
                mt="6"
                h="40px"
                px="6"
                borderRadius="10px"
                variant="outline"
                borderColor="var(--bdr-2)"
                color="var(--fg-2)"
                fontSize="sm"
                fontWeight="600"
                _hover={{
                  borderColor: "var(--app-accent-border)",
                  color: "var(--app-accent)",
                  bg: "var(--app-accent-muted)",
                }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
        </Container>
      </>
    );
  }

  if (alreadySubmitted) {
    return (
      <>
        <PageHeader
          subtitle={`Hi ${firstName} — you've already nominated someone this week`}
        />
        <Container maxW="xl" px="6" py="6">
          <Box
            bg="var(--sur-1)"
            borderWidth="1px"
            borderColor="rgba(134,239,172,0.3)"
            borderRadius="18px"
            px={{ base: "5", md: "8" }}
            py={{ base: "8", md: "10" }}
            textAlign="center"
            style={{ background: "var(--sur-modal-green)" }}
          >
            <Flex justify="center" mb="5">
              <AnimatedCheck />
            </Flex>
            <Text
              fontSize="10px"
              fontWeight="700"
              color="rgba(134,239,172,0.75)"
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb="2"
            >
              Already Submitted!
            </Text>
            <Text
              fontSize="20px"
              fontWeight="700"
              letterSpacing="-0.02em"
              color="var(--fg-1)"
              lineHeight="1.25"
              mb="3"
            >
              Thanks for nominating!
            </Text>
            <Text
              fontSize="13px"
              color="var(--fg-2)"
              lineHeight="1.75"
              mb="7"
              maxW="300px"
              mx="auto"
            >
              Your nomination has been recorded and will be considered during
              this week&apos;s vote.
            </Text>
            <Link
              href="/leaderboard"
              style={{ display: "block", maxWidth: 320, margin: "0 auto" }}
            >
              <Button
                w="full"
                h="44px"
                bg="rgba(134,239,172,0.15)"
                color="#86efac"
                borderWidth="1px"
                borderColor="rgba(134,239,172,0.3)"
                borderRadius="10px"
                fontWeight="600"
                fontSize="sm"
                _hover={{
                  bg: "rgba(134,239,172,0.22)",
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "scale(0.97)" }}
                transition="all 0.2s"
              >
                View Leaderboard →
              </Button>
            </Link>
          </Box>
        </Container>
      </>
    );
  }

  /* ── Main wizard form ── */
  return (
    <Box minH="100vh" color="var(--fg-1)">
      <PageHeader
        subtitle={`Hi ${firstName} — let's recognize someone great`}
      />

      <Container maxW="xl" px="6" pt="8" pb="20">
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Flex align="center" gap="3" mb="8">
            <Box
              flex="1"
              h="3px"
              borderRadius="full"
              bg="var(--bdr-1)"
              overflow="hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentStep / wizardSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: "100%",
                  borderRadius: "99px",
                  background:
                    "linear-gradient(90deg, var(--app-accent), rgba(212,168,61,0.6))",
                }}
              />
            </Box>
            <Text
              fontSize="12px"
              fontWeight="600"
              color="var(--fg-4)"
              letterSpacing="0.04em"
              style={{ whiteSpace: "nowrap" }}
            >
              {currentStep} / {wizardSteps.length}
            </Text>
          </Flex>
        </motion.div>

        {/* Thread steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          {wizardSteps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isLocked = idx > currentStep;
            const isLast = idx === wizardSteps.length - 1;

            return (
              <Flex key={step.id} align="stretch" gap="0">
                {/* ── Left: dot + connector ── */}
                <Flex
                  direction="column"
                  align="center"
                  w="30px"
                  flexShrink={0}
                  mr="4"
                >
                  <ThreadDot
                    n={idx + 1}
                    isActive={isActive}
                    isCompleted={isCompleted}
                  />
                  {!isLast && <ThreadLine isCompleted={isCompleted} />}
                </Flex>

                {/* ── Right: content ── */}
                <Box
                  flex="1"
                  pb={isLast ? "0" : isActive ? "8" : "2"}
                  pt="1px"
                  style={{ transition: "padding 0.3s ease" }}
                >
                  {/* ── COMPLETED: collapsed summary ── */}
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Flex
                        align="flex-start"
                        justify="space-between"
                        gap="3"
                        pb={isLast ? "0" : "6"}
                      >
                        <Box flex="1" minW="0">
                          <Text
                            fontSize="11px"
                            fontWeight="600"
                            color="var(--fg-4)"
                            letterSpacing="0.04em"
                            textTransform="uppercase"
                            mb="1"
                          >
                            {step.question}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="500"
                            color="var(--fg-2)"
                            lineHeight="1.5"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {step.summary}
                          </Text>
                        </Box>
                        <motion.button
                          onClick={() => {
                            setCurrentStep(idx);
                            setStepError("");
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit this answer"
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "var(--sur-2)",
                            border: "1px solid var(--bdr-1)",
                            color: "var(--fg-4)",
                            cursor: "pointer",
                          }}
                        >
                          <LuPencil size={11} />
                        </motion.button>
                      </Flex>
                    </motion.div>
                  )}

                  {/* ── ACTIVE: expanded form ── */}
                  {isActive && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`active-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.38,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {/* Question label */}
                        <Text
                          fontSize="sm"
                          fontWeight="700"
                          color="var(--fg-1)"
                          mb="4"
                          lineHeight="1.5"
                        >
                          {step.question}
                        </Text>

                        {/* Step-specific input */}
                        {step.type === "nominee" && (
                          <Box mb="4">
                            <Select.Root
                              collection={nomineesCollection}
                              size="md"
                              value={
                                selectedNomineeId ? [selectedNomineeId] : []
                              }
                              onValueChange={(d) => {
                                setSelectedNomineeId(d.value[0] ?? "");
                                setStepError("");
                              }}
                            >
                              <Select.HiddenSelect />
                              <Select.Control
                                bg={theme === "dark" ? "var(--sur-2)" : "white"}
                                borderColor={
                                  stepError ? "red.400" : "var(--bdr-2)"
                                }
                                borderRadius="12px"
                                _hover={{
                                  borderColor: "var(--app-accent-border)",
                                }}
                                _focusVisible={{
                                  borderColor: "var(--app-accent)",
                                  boxShadow:
                                    "0 0 0 3px var(--app-accent-muted)",
                                }}
                                transition="all 0.2s ease"
                              >
                                <Select.Trigger py="3" px="4">
                                  <Select.ValueText
                                    placeholder="Select a colleague"
                                    fontSize="sm"
                                    color="var(--fg-2)"
                                  />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator color="var(--fg-4)" />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content
                                    backdropFilter="blur(20px)"
                                    borderColor="var(--bdr-1)"
                                    borderRadius="12px"
                                    py="1.5"
                                    boxShadow="var(--shadow-dropdown)"
                                    style={{
                                      background: "var(--sur-dropdown)",
                                    }}
                                  >
                                    {nomineesCollection.items.map((person) => (
                                      <Select.Item
                                        item={person}
                                        key={person.value}
                                        fontSize="sm"
                                        py="2.5"
                                        px="4"
                                        color="var(--fg-2)"
                                        borderRadius="8px"
                                        mx="1"
                                        _hover={{
                                          bg: "var(--sur-2)",
                                          color: "var(--fg-1)",
                                        }}
                                        _highlighted={{
                                          bg: "var(--app-accent-muted)",
                                          color: "var(--app-accent)",
                                        }}
                                      >
                                        {person.label}
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                            {fieldErrors.nominee_id && (
                              <Text fontSize="xs" color="red.400" mt="1">
                                {fieldErrors.nominee_id[0]}
                              </Text>
                            )}
                          </Box>
                        )}

                        {step.type === "justification" && (
                          <Box mb="4">
                            <Textarea
                              placeholder="Describe how this person made a difference…"
                              minH="28"
                              borderRadius="12px"
                              bg={theme === "dark" ? "var(--sur-2)" : "white"}
                              borderColor={
                                stepError || fieldErrors.justification
                                  ? "red.400"
                                  : "var(--bdr-2)"
                              }
                              fontSize="sm"
                              lineHeight="1.7"
                              color="var(--fg-1)"
                              _placeholder={{ color: "var(--fg-5)" }}
                              _hover={{
                                borderColor: "var(--app-accent-border)",
                              }}
                              _focus={{
                                borderColor: "var(--app-accent)",
                                boxShadow: "0 0 0 3px var(--app-accent-muted)",
                              }}
                              resize="vertical"
                              transition="all 0.2s ease"
                              value={justification}
                              onChange={(e) => {
                                setJustification(e.target.value);
                                setStepError("");
                              }}
                            />
                            {fieldErrors.justification && (
                              <Text fontSize="xs" color="red.400" mt="1">
                                {fieldErrors.justification[0]}
                              </Text>
                            )}
                          </Box>
                        )}

                        {step.type === "rubric" && step.rubricKey && (
                          <Box>
                            <RubricPicker
                              options={step.rubricOptions ?? []}
                              value={ratings[step.rubricKey]}
                              onChange={(v) =>
                                setRatings((r) => ({
                                  ...r,
                                  [step.rubricKey!]: v,
                                }))
                              }
                              theme={theme}
                            />
                            <Flex
                              align="center"
                              justify="space-between"
                              mt="4"
                              mb="1.5"
                            >
                              <Text
                                fontSize="11px"
                                fontWeight="600"
                                color="var(--fg-4)"
                                letterSpacing="0.04em"
                                textTransform="uppercase"
                              >
                                Add a note
                              </Text>
                              <Text
                                fontSize="10px"
                                fontWeight="500"
                                color="var(--app-accent)"
                                letterSpacing="0.03em"
                              >
                                required
                              </Text>
                            </Flex>
                            <Textarea
                              placeholder={
                                step.notePlaceholder ?? "Add a note…"
                              }
                              minH="20"
                              borderRadius="12px"
                              bg={theme === "dark" ? "var(--sur-2)" : "white"}
                              borderColor={
                                stepError && !notes[step.rubricKey].trim()
                                  ? "red.400"
                                  : "var(--bdr-2)"
                              }
                              fontSize="sm"
                              lineHeight="1.7"
                              color="var(--fg-1)"
                              _placeholder={{ color: "var(--fg-5)" }}
                              _hover={{
                                borderColor: "var(--app-accent-border)",
                              }}
                              _focus={{
                                borderColor: "var(--app-accent)",
                                boxShadow: "0 0 0 3px var(--app-accent-muted)",
                              }}
                              resize="vertical"
                              transition="all 0.2s ease"
                              value={notes[step.rubricKey]}
                              onChange={(e) => {
                                setNotes((n) => ({
                                  ...n,
                                  [step.rubricKey!]: e.target.value,
                                }));
                                setStepError("");
                              }}
                            />
                            {/* Word count indicator */}
                            {(() => {
                              const wc = wordCount(notes[step.rubricKey]);
                              const done = wc >= MIN_NOTE_WORDS;
                              return (
                                <Flex align="center" justify="flex-end" mt="1.5" gap="1.5">
                                  {done && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      style={{ display: "flex", color: "#86efac" }}
                                    >
                                      <LuCheck size={11} />
                                    </motion.div>
                                  )}
                                  <Text
                                    fontSize="11px"
                                    fontWeight="600"
                                    style={{
                                      color: done
                                        ? "#86efac"
                                        : wc > 0
                                          ? "var(--app-accent)"
                                          : "var(--fg-5)",
                                      transition: "color 0.2s",
                                    }}
                                  >
                                    {wc} / {MIN_NOTE_WORDS} words
                                  </Text>
                                </Flex>
                              );
                            })()}
                          </Box>
                        )}

                        {/* Step-level error */}
                        {stepError && (
                          <Text fontSize="xs" color="red.400" mb="3">
                            {stepError}
                          </Text>
                        )}
                        {fieldErrors.__general__ && (
                          <Text fontSize="xs" color="red.400" mb="3">
                            {fieldErrors.__general__[0]}
                          </Text>
                        )}

                        {/* Continue / Submit */}
                        <motion.div
                          whileHover={{ scale: 1.018 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            onClick={() => handleContinue(idx)}
                            bg="var(--app-accent)"
                            color="white"
                            borderRadius="11px"
                            h="46px"
                            px="6"
                            fontWeight="600"
                            fontSize="sm"
                            disabled={isSubmitting}
                            _hover={{
                              bg: "var(--app-accent-hover)",
                              boxShadow: "var(--shadow-accent)",
                            }}
                            _active={{ transform: "scale(0.97)" }}
                            transition="all 0.2s"
                          >
                            {isLast ? (
                              isSubmitting ? (
                                <Flex align="center" gap="2">
                                  <span className="spinner" />
                                  Submitting…
                                </Flex>
                              ) : (
                                "Submit Recognition ✦"
                              )
                            ) : (
                              <Flex align="center" gap="2">
                                Continue
                                <LuChevronRight size={15} />
                              </Flex>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* ── LOCKED: placeholder ── */}
                  {isLocked && (
                    <Box pb={isLast ? "0" : "6"} pt="1px">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="var(--fg-5)"
                        lineHeight="1.5"
                      >
                        {step.question}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Flex>
            );
          })}
        </motion.div>
      </Container>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={480}
          gravity={0.17}
          colors={CONFETTI_COLORS}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9998,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Success overlay */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--overlay-bg)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              key="success-card"
              initial={{ scale: 0.78, y: 48, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26,
                delay: 0.06,
              }}
              style={{
                background: "var(--sur-modal-green)",
                border: "1px solid rgba(134,239,172,0.3)",
                borderRadius: "22px",
                padding: "44px 40px",
                maxWidth: "420px",
                width: "90%",
                textAlign: "center",
                boxShadow: "var(--shadow-login)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "12%",
                  right: "12%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(134,239,172,0.5), transparent)",
                }}
              />
              <Flex justify="center" mb="5">
                <AnimatedCheck />
              </Flex>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color="rgba(134,239,172,0.75)"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="2"
                >
                  Recognition Submitted!
                </Text>
                <Text
                  fontSize="22px"
                  fontWeight="700"
                  letterSpacing="-0.02em"
                  color="var(--fg-1)"
                  lineHeight="1.25"
                  mb="3"
                >
                  You recognized
                  <br />
                  {selectedLabel}
                </Text>
                <Text
                  fontSize="13px"
                  color="var(--fg-2)"
                  lineHeight="1.75"
                  mb="7"
                >
                  Their contribution has been recorded and will be considered
                  during this week&apos;s vote.
                </Text>
                <VStack gap="3">
                  <Link href="/leaderboard" style={{ width: "100%" }}>
                    <Button
                      w="full"
                      h="44px"
                      bg="rgba(134,239,172,0.15)"
                      color="#86efac"
                      borderWidth="1px"
                      borderColor="rgba(134,239,172,0.3)"
                      borderRadius="10px"
                      fontWeight="600"
                      fontSize="sm"
                      _hover={{
                        bg: "rgba(134,239,172,0.22)",
                        transform: "translateY(-1px)",
                      }}
                      _active={{ transform: "scale(0.97)" }}
                      transition="all 0.2s"
                    >
                      View Leaderboard →
                    </Button>
                  </Link>
                  <Button
                    w="full"
                    h="40px"
                    variant="ghost"
                    color="var(--fg-4)"
                    borderRadius="10px"
                    fontSize="sm"
                    _hover={{ color: "var(--fg-2)", bg: "var(--sur-2)" }}
                    onClick={handleSubmitAnother}
                  >
                    Submit Another
                  </Button>
                </VStack>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
