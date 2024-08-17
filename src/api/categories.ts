import { Category } from "./types";

const categories = [
  {
    name: "dogs",
    image: "/castle-t-shirt.jpg",
  },
  {
    name: "cats",
    image: "/castle-t-shirt.jpg",
  },
  {
    name: "birds",
    image: "/castle-t-shirt.jpg",
  },
  {
    name: "fishes",
    image: "/castle-t-shirt.jpg",
  },
  {
    name: "reptiles",
    image: "/castle-t-shirt.jpg",
  },
  {
    name: "others",
    image: "/castle-t-shirt.jpg",
  },
];
export const getCategories = async (): Promise<Category[]> => categories;