'use server';

import prisma from "../../../../../prisma/db";

export const getCategoriesAction = async () => {
  return await prisma.category.findMany();
};