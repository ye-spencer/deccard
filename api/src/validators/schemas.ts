import { z } from "zod";

export const createDeckSchema = z.object({
  title : z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
});

export const updateDeckQuerySchema = z.object({
  title : z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
});

export const updateDeckParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getDeckSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const deleteDeckSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getDeckQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const createCardQuerySchema = z.object({
  front: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be 500 characters or less"),
  back: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be 500 characters or less"),
});

export const createCardParamSchema = z.object({
  deckId: z.coerce.number().int().positive(),
});



export const updateCardParamSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  cardId: z.coerce.number().int().positive(),
});
  
export const updateCardQuerySchema = createCardQuerySchema.partial();
 

/** Start Build */

export const getCardsParamSchema = z.object({
  deckId: z.coerce.number().int().positive(),
});

export const getCardsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
  
export const getCardSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  cardId: z.coerce.number().int().positive(),
});

export const deleteCardSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  cardId: z.coerce.number().int().positive(),
});

/** possiblt coalesce these together for the ones that are identifcal */