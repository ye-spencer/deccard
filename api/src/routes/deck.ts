import { Hono } from "hono";
import { db } from "../db";
import { decks } from "../db/schema";
import { eq, like, SQL, and, count } from "drizzle-orm";
import { createDeckSchema, deleteDeckSchema, getDeckSchema, getDeckQuerySchema, updateDeckParamSchema, updateDeckQuerySchema } from "../validators/schemas";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";



const decksRouter = new Hono();

// get all decks
decksRouter.get("/decks", 
  zValidator("query", getDeckQuerySchema),
  async (c) => {
    const { search, page = 1, limit = 20 } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];
    if (search) 
    {
      whereClause.push(like(decks.title, `%${search}%`));
    }

    const offset = (page - 1) * limit;

    const [allDecks, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(decks)
        .where(and(...whereClause))
        .limit(limit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(decks)
        .where(and(...whereClause)),
    ]);
   
    return c.json({
      decks: allDecks,
      page,
      limit,
      total: totalCount,
    });
  });

// get a deck by id
decksRouter.get("/decks/:id", 
  zValidator("param", getDeckSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    const deck = await db.select().from(decks).where(eq(decks.id, id)).get(); 

    if (!deck) 
    {
      throw new HTTPException(404, { message: "deck not found" });
    }
    return c.json(deck, 200);
  });

decksRouter.delete("/decks/:id", 
  zValidator("param", deleteDeckSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));

    const deletedDeck = await db
      .delete(decks)
      .where(eq(decks.id, id))
      .returning()
      .get();

    if (!deletedDeck) 
    {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    return c.json(deletedDeck);
});

// add a deck
decksRouter.post("/decks", 
  zValidator("json", createDeckSchema), 
    async (c) => {

    const { title } = await c.req.json();

    const newDeck = await db
      .insert(decks)
      .values({ title })
      .returning()
      .get();
    return c.json(newDeck, 201);
});

// update a deck by id
decksRouter.patch("/decks/:id", 
  zValidator("json", updateDeckQuerySchema),
  zValidator("param", updateDeckParamSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));
    const { title } = await c.req.json();
    const updatedDeck = await db
      .update(decks)
      .set({ title })
      .where(eq(decks.id, id))
      .returning()
      .get();

    if (!updatedDeck) 
    {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    
    return c.json(updatedDeck);
});

export default decksRouter;