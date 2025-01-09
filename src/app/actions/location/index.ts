'use server';

import prisma from "../../../../prisma/db";

export async function getCountriesAction() {
  const countries = await prisma.country.findMany();
  return countries.map((country) => ({
    code: country.code,
    name: country.name,
  }));
}

export async function getStatesByCountryCodeAction(countryCode: string) {
  const states = await prisma.state.findMany({
    where: {
      country: {
        code: countryCode,
      }
    },
  });
  return states.map((state) => ({
    code: state.code,
    name: state.name,
  }));
}