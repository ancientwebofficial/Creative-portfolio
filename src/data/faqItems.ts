export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What file formats do you provide?",
    answer:
      "I provide all standard formats: PNG (transparent), JPEG, PSD, and SVG. For texture packs, formats include .zip ready for Minecraft.",
  },
  {
    id: "2",
    question: "How long does a project take?",
    answer:
      "Turnaround times depend on the plan selected. Starter plans typically take 24 hours, Professional 48 hours, and Premium projects receive priority scheduling.",
  },
  {
    id: "3",
    question: "Can I use these designs commercially?",
    answer:
      "Yes! Professional and Premium plans include full commercial use rights. Starter plans are personal use only unless otherwise agreed.",
  },
  {
    id: "4",
    question: "How many revisions are included?",
    answer:
      "Starter includes 2 revisions, Professional has unlimited, and Premium includes unlimited with direct communication.",
  },
  {
    id: "5",
    question: "Do you work with custom briefs?",
    answer:
      "Absolutely! All custom designs start with a detailed brief. I'll work with you to ensure the final product matches your vision.",
  },
  {
    id: "6",
    question: "What about texture pack compatibility?",
    answer:
      "All texture packs are tested on the latest Minecraft versions and are compatible with both Java and Bedrock editions.",
  },
  {
    id: "7",
    question: "Can I request custom texture packs?",
    answer:
      "Yes! Custom texture packs can be created for specific themes, mods, or server requirements. Contact me for a custom quote.",
  },
  {
    id: "8",
    question: "How do I place an order?",
    answer:
      "All orders are placed through Discord. Click the order button to join our Discord server and connect with me directly.",
  },
];
