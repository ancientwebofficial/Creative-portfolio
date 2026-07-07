export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  highlighted?: boolean;
  orderUrl?: string;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small projects",
    price: 50,
    currency: "USD",
    features: [
      "1 custom design",
      "2 revisions",
      "24-hour turnaround",
      "Discord support",
      "High resolution files",
    ],
    orderUrl: "/contact",
  },
  {
    id: "professional",
    name: "Professional",
    description: "For serious creators",
    price: 150,
    currency: "USD",
    highlighted: true,
    features: [
      "3 custom designs",
      "Unlimited revisions",
      "48-hour turnaround",
      "Priority Discord support",
      "High resolution + source files",
      "Commercial use rights",
      "Custom animations",
    ],
    orderUrl: "/contact",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Full creative package",
    price: 400,
    currency: "USD",
    features: [
      "Unlimited designs per month",
      "Unlimited revisions",
      "24-hour turnaround",
      "Direct communication",
      "All file formats",
      "Full commercial rights",
      "Custom animations & effects",
      "Monthly strategy consultation",
    ],
    orderUrl: "/contact",
  },
];
