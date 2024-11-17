import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCardParamSchema, createCardQuerySchema, deleteCardSchema, getCardSchema, getCardsParamSchema, getCardsQuerySchema, updateCardParamSchema, updateCardQuerySchema } from "../validators/schemas";
import { db } from "../db";
import { decks, cards } from "../db/schema";
import { eq, and, SQL, like, or, count } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const cardsRouter = new Hono();

// get all cards in a deck by deck id
cardsRouter.get("/decks/:deckId/cards",
    zValidator("param", getCardsParamSchema),
    zValidator("query", getCardsQuerySchema),
    async (c) => {
      const { search, page = 1, limit = 20 } = c.req.valid("query");
      const { deckId } = c.req.valid("param");

      const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get(); 

      if (!deck) 
      {
        throw new HTTPException(404, { message: "deck not found" });
      }

      const whereClause: (SQL | undefined)[] = [];
      whereClause.push(eq(cards.deckId, deckId));
      if (search) 
      {
        whereClause.push(
            or(
              like(cards.front, `%${search}%`),
              like(cards.back, `%${search}%`)
            )
        );
      }

      const offset = (page - 1) * limit;
   
      const [allCards, [{ totalCount }]] = await Promise.all([
        db
          .select()
          .from(cards)
          .where(and(...whereClause))
          .limit(limit)
          .offset(offset),
        db
          .select({ totalCount: count() })
          .from(cards)
          .where(and(...whereClause)),
      ]);
   
      return c.json({
        cards: allCards,
        page,
        limit,
        total: totalCount,
      });
    },
  );

  // get a card by card id and deck id
  cardsRouter.get("/decks/:deckId/cards/:cardId",
  zValidator("param", getCardSchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .get();
    if (!card) 
    {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json(card);
  },
);

// delete a card from a deck by card id
cardsRouter.delete(
  "/decks/:deckId/cards/:cardId",
  zValidator("param", deleteCardSchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const deletedCard = await db
      .delete(cards)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .returning()
      .get();
    if (!deletedCard)
    {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json(deletedCard);
  },
);

// Add a card to a deck by deck id
cardsRouter.post(
  "/decks/:deckId/cards",
  zValidator("param", createCardParamSchema),
  zValidator("json", createCardQuerySchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const { front, back } = c.req.valid("json");

    const targetDeck = await db.select().from(decks).where(eq(decks.id, deckId)).get(); 

    if (!targetDeck) 
    {
      throw new HTTPException(404, { message: "deck not found" });
    }

    const newCard = await db
      .insert(cards)
      .values({
        front,
        back,
        deckId,
      })
      .returning()
      .get();
 
    return c.json(newCard);
  },
);

// Update a card in a deck by card and deck id
cardsRouter.patch(
  "/decks/:deckId/cards/:cardId",
  zValidator("param", updateCardParamSchema),
  zValidator("json", updateCardQuerySchema),
  async (c) => {
    const { deckId, cardId } = c.req.valid("param");
    const { front, back } = c.req.valid("json");

    const targetDeck = await db.select().from(decks).where(eq(decks.id, deckId)).get(); 

    if (!targetDeck) 
    {
      throw new HTTPException(404, { message: "deck not found" });
    }

    let toUpdate = {};
    if (!front && !back)
    {
      throw new HTTPException(400, { message : "front and back are both empty" })
    }
    else if (!front)
    {
      toUpdate = { back };
    }
    else if (!back)
    {
      toUpdate = { front };
    }
    else
    {
      toUpdate = { front, back };
    }

    const updatedCard = await db
      .update(cards)
      .set(toUpdate)
      .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
      .returning()
      .get();

    if (!updatedCard) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json(updatedCard);
  },
);

export default cardsRouter;