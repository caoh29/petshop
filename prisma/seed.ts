import prisma from "./db";
import PRODUCTS from '../src/mocks/MOCK_PRODUCTS.json';
import CATEGORIES from '../src/mocks/MOCK_CATEGORIES.json';
import COUNTRIES from '../src/mocks/MOCK_COUNTRIES.json';


async function main() {
  await prisma.cart.deleteMany();
  await prisma.category.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.review.deleteMany();
  await prisma.selectedProduct.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();
  await prisma.state.deleteMany();


  const createdProducts = await prisma.product.createMany({
    // data: [
    //   {
    //     sku: "ABC123",
    //     image: "/castle-t-shirt.jpg",
    //     additionalImages: ["/elf-t-shirt.jpg", "/dragon-t-shirt.jpg"],
    //     name: "Castle T-Shirt",
    //     price: 25,
    //     category: "dogs",
    //     subcategory: "castle",
    //     description:
    //       "Beware the castle of the blue wizard of Bazmagar! It is said that he has a dragon!",
    //     sizes: ["S", "M", "L", "XL"],
    //     availableSizes: ["S", "M", "L", "XL"],
    //     colors: ["black", "blue", "green"],
    //     availableColors: ["black", "blue"],
    //     isOutOfStock: false,
    //   },
    //   {
    //     sku: "DEF456",
    //     image: "/barbarian-t-shirt.jpg",
    //     name: "Organic Raw Dog Food",
    //     price: 45,
    //     category: "dogs",
    //     subcategory: "raw-food",
    //     description: "High-protein, organic raw food for dogs, packed with essential nutrients.",
    //     sizes: ["1kg", "2kg", "5kg"],
    //     availableSizes: ["1kg", "5kg"],
    //     isOutOfStock: false,
    //     createdAt: "2024-09-01T12:00:00Z",
    //   },
    // ]
    data: PRODUCTS
  });
  console.log({ createdProducts })

  const createdCategories = await prisma.category.createMany({
    data: CATEGORIES,
  })

  console.log({ createdCategories })

  for (const country of COUNTRIES) {
    await prisma.country.create({
      data: {
        name: country.name,
        code: country.code,
        states: {
          create: country.states.map((state) => ({
            name: state.name,
            code: state.code,
          })),
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })