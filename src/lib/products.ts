export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  detail: string;
  slots: number;
  colors: string[];
  sizes: string[];
  category: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Product 1",
    price: 3.66,
    image: "/images/product1.png",
    detail:
      "Handmade crochet product crafted with care and soft yarn. This piece is designed to feel cozy, cute, and giftable, making it perfect for collections, displays, or heartfelt presents.",
    slots: 5,
    colors: ["yellow", "pink", "blue"],
    sizes: ["small", "medium", "large"],
    category: "category 1",
  },
  {
    id: "2",
    name: "Product 2",
    price: 4.44,
    image: "/images/product2.png",
    detail:
      "A soft handmade crochet creation with charming details and a warm handmade finish. Great for display, gifting, and collecting.",
    slots: 4,
    colors: ["pink", "white", "red"],
    sizes: ["small", "medium", "large"],
    category: "category 1",
  },
  {
    id: "3",
    name: "Product 3",
    price: 4.44,
    image: "/images/product3.png",
    detail:
      "Thoughtfully crocheted with a cute and playful look. A lovely handmade item that brings personality to any setup.",
    slots: 3,
    colors: ["pink", "blue", "cream"],
    sizes: ["small", "medium", "large"],
    category: "category 1",
  },
  {
    id: "4",
    name: "Product 4",
    price: 4.44,
    image: "/images/product2.png",
    detail:
      "A carefully stitched crochet piece with a sweet handmade charm and a clean, gift-ready look.",
    slots: 6,
    colors: ["pink", "green", "white"],
    sizes: ["small", "medium", "large"],
    category: "category 1",
  },
];