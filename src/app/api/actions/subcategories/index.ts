'use server';

import prisma from "../../../../../prisma/db";

export const getSubCategoriesAction = async (categoryId: string) => {
  return await prisma.subCategory.findMany({
    where: {
      categoryId: categoryId,
    },
  });
};
