import { z } from "zod";

export const FlightSchema = z.object({
  origin: z.string().min(3, "Origin must be a valid airport code"),
  destination: z.string().min(3, "Destination must be a valid airport code"),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type FlightParams = z.infer<typeof FlightSchema>;
