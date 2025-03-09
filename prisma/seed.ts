import prisma from "./db";
import PRODUCTS from '../src/mocks/MOCK_PRODUCTS.json';
import CATEGORIES from '../src/mocks/MOCK_CATEGORIES.json';
import SUBCATEGORIES from '../src/mocks/MOCK_SUBCATEGORIES.json';
import COUNTRIES from '../src/mocks/MOCK_COUNTRIES.json';

// Define the product type to match our schema
type ProductCreate = {
  sku: string;
  image: string;
  additionalImages?: string[];
  name: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  description: string;
  sizes?: string[];
  availableSizes?: string[];
  colors?: string[];
  availableColors?: string[];
  stock: number;
  isOutOfStock: boolean;
  discount?: number;
};

async function main() {
  await prisma.cart.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.review.deleteMany();
  await prisma.selectedProduct.deleteMany();
  await prisma.user.deleteMany();
  await prisma.state.deleteMany();
  await prisma.country.deleteMany();

  // Create categories
  const createdCategories = await prisma.category.createMany({
    data: CATEGORIES
  })

  console.log({ createdCategories })

  // Create subcategories
  const subcategories = await Promise.all(SUBCATEGORIES.map(async (sub) => ({
    name: sub.name,
    image: sub.image,
    categoryId: await prisma.category.findFirst({ where: { name: sub.category } }).then((category) => category?.id ?? ''),
  })))

  const createdSubcategories = await prisma.subCategory.createMany({
    data: subcategories
  })

  console.log({ createdSubcategories })

  // Create countries and states
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

  // Create products
  // First, get all categories and subcategories to validate relationships
  const allCategories = await prisma.category.findMany();
  const allSubcategories = await prisma.subCategory.findMany({
    include: { category: true }
  });

  // Create a map of valid subcategories for each category
  const validSubcategoriesByCategory = new Map();
  allCategories.forEach(category => {
    validSubcategoriesByCategory.set(
      category.name,
      allSubcategories
        .filter(sub => sub.categoryId === category.id)
        .map(sub => sub.name)
    );
  });

  // Filter out products with invalid category-subcategory relationships
  const validProducts: ProductCreate[] = [];

  for (const prod of PRODUCTS) {
    const category = await prisma.category.findFirst({ where: { name: prod.category } });

    if (!category) {
      console.log(`Skipping product "${prod.name}" - category "${prod.category}" not found`);
      continue;
    }

    // Check if this subcategory is valid for this category
    const validSubcategories = validSubcategoriesByCategory.get(prod.category) || [];
    if (!validSubcategories.includes(prod.subcategory)) {
      console.log(`Skipping product "${prod.name}" - subcategory "${prod.subcategory}" is not valid for category "${prod.category}"`);
      continue;
    }

    const subcategory = await prisma.subCategory.findFirst({
      where: {
        categoryId: category.id,
        name: prod.subcategory
      }
    });

    if (!subcategory) {
      console.log(`Skipping product "${prod.name}" - subcategory "${prod.subcategory}" not found for category "${prod.category}"`);
      continue;
    }

    const { category: _, subcategory: __, ...rest } = prod;

    validProducts.push({
      ...rest,
      categoryId: category.id,
      subcategoryId: subcategory.id,
    });
  }

  // Create products with valid relationships
  if (validProducts.length > 0) {
    const createdProducts = await prisma.product.createMany({
      data: validProducts
    });
    console.log({ createdProducts });
  } else {
    console.log("No valid products to create");
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