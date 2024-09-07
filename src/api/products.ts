import { getPaginatedProducts } from "../app/actions";
import { Product } from "./types";

const products: Product[] = [
  {
    id: "1",
    sku: "ABC123",
    image: "/castle-t-shirt.jpg",
    additionalImages: ["/elf-t-shirt.jpg", "/dragon-t-shirt.jpg"],
    name: "Castle T-Shirt",
    price: 25,
    category: "dogs",
    subcategory: "castle",
    description:
      "Beware the castle of the blue wizard of Bazmagar! It is said that he has a dragon!",
    reviews: [
      {
        id: "1",
        rating: 5,
        text: "This is the best t-shirt I've ever owned! The design is amazing and the quality is top-notch.",
        createdAt: "2024-09-01T12:00:00Z",
        userId: "XXXXX",
        productId: "a1s41v6d16v1"
      },
      {
        id: "2",
        rating: 4,
        text: "I really like this t-shirt, the design is cool and it's comfortable to wear. The only downside is that it shrunk a bit after washing.",
        createdAt: "2024-09-01T12:00:00Z",
        userId: "XXXXX",
        productId: "adfv8626ad5v1"
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    colors: ["black", "blue", "green"],
    availableColors: ["black", "blue"],
    isOutOfStock: false,
    createdAt: "2024-09-01T12:00:00Z",
  },
  {
    id: "2",
    sku: "ABC123",
    image: "/barbarian-t-shirt.jpg",
    name: "Organic Raw Dog Food",
    price: 45,
    category: "dogs",
    subcategory: "raw-food",
    description: "High-protein, organic raw food for dogs, packed with essential nutrients.",
    reviews: [
    ],
    sizes: ["1kg", "2kg", "5kg"],
    availableSizes: ["1kg", "5kg"],
    isOutOfStock: false,
    createdAt: "2024-09-01T12:00:00Z",
  },
  {
    id: "3",
    sku: "ABC123",
    image: "/dragon-t-shirt.jpg",
    name: "Grain-Free Wet Dog Food",
    price: 30,
    category: "dogs",
    subcategory: "wet-food",
    description: "Delicious grain-free wet food for dogs, perfect for sensitive stomachs.",
    reviews: [
    ],
    sizes: ["400g", "800g"],
    availableSizes: ["400g", "800g"],
    isOutOfStock: false,
    createdAt: "2024-08-25T10:30:00Z",
  },
  {
    id: "4",
    sku: "ABC123",
    image: "/elf-t-shirt.jpg",
    name: "Durable Dog Ball Toy",
    price: 12,
    category: "dogs",
    subcategory: "toys",
    description: "A durable ball toy for dogs, great for fetch and chew sessions.",
    reviews: [
    ],
    colors: ["red", "blue", "green"],
    availableColors: ["red", "green"],
    isOutOfStock: false,
    createdAt: "2024-08-20T08:15:00Z",
  },
  {
    id: "5",
    sku: "ABC123",
    image: "/wizard-t-shirt.jpg",
    name: "Grain-Free Dry Cat Food",
    price: 40,
    category: "cats",
    subcategory: "dry-food",
    description: "A nutritious grain-free dry food for cats, supporting overall health.",
    reviews: [
    ],
    sizes: ["2kg", "4kg"],
    availableSizes: ["2kg", "4kg"],
    isOutOfStock: false,
    createdAt: "2024-08-18T14:45:00Z",
  },
  {
    id: "6",
    sku: "ABC123",
    image: "/wizard-t-shirt-2.jpg",
    name: "Cozy Cat Bed",
    price: 50,
    category: "cats",
    subcategory: "beds",
    description: "A plush, cozy bed for cats, ensuring comfort and warmth.",
    reviews: [
    ],
    colors: ["grey", "brown", "white"],
    availableColors: ["grey", "white"],
    isOutOfStock: false,
    createdAt: "2024-08-15T09:00:00Z",
  },
  {
    id: "7",
    sku: "ABC123",
    image: "/pets.jpeg",
    name: "Premium Bird Seed Mix",
    price: 15,
    category: "birds",
    subcategory: "food",
    description: "A premium mix of seeds for a healthy and happy bird.",
    reviews: [
    ],
    sizes: ["500g", "1kg"],
    availableSizes: ["500g", "1kg"],
    isOutOfStock: false,
    createdAt: "2024-08-10T07:30:00Z",
  },
  {
    id: "8",
    sku: "ABC123",
    image: "/not-found.png",
    name: "Glass Fish Tank",
    price: 120,
    category: "fishes",
    subcategory: "tanks",
    description: "A crystal-clear glass tank for fish, with a sleek design.",
    reviews: [
    ],
    sizes: ["20L", "40L", "60L"],
    availableSizes: ["20L", "40L"],
    isOutOfStock: false,
    createdAt: "2024-08-05T16:00:00Z",
  },
  {
    id: "9",
    sku: "ABC123",
    image: "/arbol.jpg",
    name: "Reptile Terrarium",
    price: 150,
    category: "reptiles",
    subcategory: "terrariums",
    description: "A spacious terrarium for reptiles, with ample ventilation and space.",
    reviews: [
    ],
    sizes: ["Medium", "Large"],
    availableSizes: ["Medium", "Large"],
    isOutOfStock: false,
    createdAt: "2024-07-30T11:15:00Z",
  },
  {
    id: "10",
    sku: "ABC123",
    image: "/dados.png",
    name: "Reflective Dog Leash",
    price: 20,
    category: "dogs",
    subcategory: "leashes",
    description: "A durable, reflective leash for dogs, perfect for evening walks.",
    reviews: [
    ],
    colors: ["black", "yellow"],
    availableColors: ["black"],
    isOutOfStock: false,
    createdAt: "2024-07-25T12:45:00Z",
  },
  {
    id: "11",
    sku: "ABC123",
    image: "/doggies.jpg",
    name: "Quiet Hamster Wheel",
    price: 18,
    category: "others",
    subcategory: "hamster",
    description: "A silent spinning wheel for hamsters, ensuring hours of quiet exercise.",
    reviews: [
    ],
    sizes: ["Small", "Medium"],
    availableSizes: ["Small", "Medium"],
    isOutOfStock: false,
    createdAt: "2024-07-20T13:00:00Z",
  },
];

// export const getProducts = async (): Promise<Product[]> => products;
export const getProducts = async (): Promise<Product[]> => getPaginatedProducts();


export const getProductById = async (
  id: string
): Promise<Product | undefined> =>
  getProducts().then((products) => products.find((p) => p.id === id));


export const getProductsByCategory = async (
    category: string,
    // searchParams: { [key: string]: string | string[] | undefined }
    searchParams: { [key: string]: string | string[] | undefined }
  ): Promise<Product[] | undefined> => 
    getProducts().then((products) => products.filter((p) => p.category === category)).then(
      (products) => {
        // Needs improvement
        const size = searchParams["Size"];
        if (size) {
          return products.filter((p) => {
            if(size instanceof Array) {
              return size.some((s) => p.availableSizes?.includes(s));
            }
            return p.availableSizes?.includes(size);
          });
        }
        return products;
      }
    );


  export const getProductsBySubCategory = async (
    category: string,
    subcategory: string,
    searchParams: { [key: string]: string | string[] | undefined }
  ): Promise<Product[] | undefined> =>
    getProducts().then((products) => products.filter((p) => p.category === category && p.subcategory === subcategory));

