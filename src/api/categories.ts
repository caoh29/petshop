import { Category } from "./types";

const categories = [
  {
    id: "A5V34FGJ15",
    name: "dogs",
    image: "/castle-t-shirt.jpg",
  },
  {
    id: "XA08KL321",
    name: "cats",
    image: "/castle-t-shirt.jpg",
  },
  {
    id: "LKJ09UH45",
    name: "birds",
    image: "/castle-t-shirt.jpg",
  },
  {
    id: "PLO09876",
    name: "fishes",
    image: "/castle-t-shirt.jpg",
  },
  {
    id: "QWERTY123",
    name: "reptiles",
    image: "/castle-t-shirt.jpg",
  },
  {
    id: "ASDFGH456",
    name: "others",
    image: "/castle-t-shirt.jpg",
  },
];
export const getCategories = async (): Promise<Category[]> => categories;