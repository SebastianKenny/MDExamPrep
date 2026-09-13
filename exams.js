// ─── EXAM CATALOG ────────────────────────────────────────────────────────────
// This is the ONLY file you need to touch to add, remove, or reorder exams on
// the homepage. index.html reads this list and builds the page automatically.
//
// To add a new exam:
//   1. Upload its .html file to this same repo folder.
//   2. Copy one of the objects below, paste it into the EXAMS array, and edit
//      the fields to match your new quiz. That's it — no HTML editing needed.
//
// To remove an exam: delete its object from the array below (or comment it
// out by wrapping it in /* ... */ if you just want to hide it temporarily).
//
// Fields:
//   section        — group heading the card appears under (reuse an existing
//                    section name to add another card to that same group)
//   icon           — one emoji shown next to the section heading
//   title          — card title
//   description    — one or two sentences shown on the card
//   file           — exact filename of the quiz's .html file in this repo
//   questionCount  — number shown in the pill on the card

const EXAMS = [
  {
    section: "Renal & Endocrine",
    icon: "🩺",
    title: "INDE 222 — Renal & Endocrine",
    description: "Second-order thinking questions across 18 topics, from sodium handling to pituitary feedback.",
    file: "Renal_Endo_Quiz.html",
    questionCount: 284,
  },
  {
    section: "Cardiology",
    icon: "❤️",
    title: "INDE 221 — Cardiology",
    description: "Comprehensive cardiology question bank covering blood flow, heart failure, ischemic and valvular disease.",
    file: "quiz_cardio.html",
    questionCount: 447,
  },
  {
    section: "Pulmonary & MSK",
    icon: "🫁",
    title: "Pulmonary & MSK",
    description: "Integrated question bank spanning musculoskeletal topics (fractures, joints, back pain) and pulmonary topics (PE, lung cancer, transplant).",
    file: "PulmMSK_Quiz.html",
    questionCount: 230,
  },
  {
    section: "Pulmonary & MSK",
    icon: "🫁",
    title: "Early Lung Physiology",
    description: "Foundational pulmonary physiology — mechanics, ventilation, diffusion, airflow obstruction, and histology.",
    file: "EarlyLungPhysiology_Quiz.html",
    questionCount: 60,
  },
  {
    section: "Microbiology & Pharmacology",
    icon: "🦠",
    title: "Microbiology & Pharmacology",
    description: "Antibiotics, antifungals, anti-TB/antiparasitic therapy, biologics, and core microbiology.",
    file: "MicroPharm_Quiz.html",
    questionCount: 204,
  },
];
