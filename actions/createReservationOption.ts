"use server";
import { db } from "@/lib/db";
import * as z from "zod";

import { ReservationOptionSchema } from "@/schemas";
import { getRentalOptionByDuration } from "@/data/rentalOptionData";

const parseCurrencyValue = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.]/g, ""));
};

export const createReservationOption = async (
  values: z.infer<typeof ReservationOptionSchema>
) => {
  const validatedField = ReservationOptionSchema.safeParse(values);

  if (!validatedField.success) {
    return { error: "Invalid fields" };
  }

  const { rentalprice, rentaloption_description, duration } =
    validatedField.data;

  const isValidDuration = /^\d+$/.test(duration);
  if (!isValidDuration) {
    return { error: "Duration must contain only numbers" };
  }

  const rentalOption = await getRentalOptionByDuration(parseInt(duration));

  if (rentalOption && rentalOption.length > 0) {
    const duplicateOption = rentalOption.find(
      (option) => option.rentaloption_description === rentaloption_description
    );
    if (duplicateOption) {
      return {
        error:
          "Rental option with that description and duration already exists!",
      };
    }
  }

  if (
    rentaloption_description !== "SAFARI" &&
    rentaloption_description !== "REGULAR"
  ) {
    return { error: "Please select correct rental option type." };
  }

  const rentalpriceInt = parseCurrencyValue(rentalprice);

  if (rentalpriceInt < 0) {
    return { error: "We should not pay to the customers for the ride :)" };
  }

  await db.rentalOptions.create({
    data: {
      rentaloption_description,
      duration: parseInt(duration),
      rentalprice: rentalpriceInt,
    },
  });

  return {
    success: "Rental option has been added successfully!",
  };
};
