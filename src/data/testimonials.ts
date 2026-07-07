export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "Alex Gaming",
    role: "Content Creator",
    content:
      "The thumbnail designs completely transformed my channel. Engagement went up 40% in the first month. Highly recommended!",
    rating: 5,
  },
  {
    id: "2",
    author: "BuildCraft Studios",
    role: "Game Developer",
    content:
      "Professional, creative, and incredibly responsive. The texture packs are pixel-perfect and optimized.",
    rating: 5,
  },
  {
    id: "3",
    author: "Luna Streams",
    role: "Twitch Streamer",
    content:
      "Amazing work on our branding. The logo design perfectly captures our studio's vision and aesthetic.",
    rating: 5,
  },
  {
    id: "4",
    author: "Pixel Network",
    role: "YouTube Network Manager",
    content:
      "Worked with them on multiple projects. Consistent quality, excellent communication, and always delivers on time.",
    rating: 5,
  },
  {
    id: "5",
    author: "Creative Minds",
    role: "Design Agency",
    content:
      "Their attention to detail is remarkable. Every banner and graphic exceeds expectations.",
    rating: 5,
  },
];
