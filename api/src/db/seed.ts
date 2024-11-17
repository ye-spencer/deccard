import { db, connection } from "./index";
import { cards, decks } from "./schema";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(cards);
  await db.delete(decks);

  // Reset the auto-increment counters
  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('decks', 'cards')`,
  );

  console.log("Inserting new seed data...");

  const sampleKeywords = [
    "javascript",
    "typescript",
    "react",
    "development",
    "programming",
    "software",
    "API",
    "AI",
    "machine learning",
    "hono",
    "fullstack",
    "madooei",
    "ali",
    "drizzle-orm",
    "syntax"
  ];

  // Insert 50 sample decks
  for (let i = 0; i < 50; i++) {
    const randomKeywords = faker.helpers.arrayElements(sampleKeywords, { min: 2, max: 5 });

    const title = `${faker.lorem.sentence({ min: 5, max: 15 })} ${randomKeywords.join(" ")}`;

    const deck = await db
      .insert(decks)
      .values({
        title
      })
      .returning()
      .get();

    // Insert 1-10 cards for each deck
    const numCards = faker.number.int({ min: 0, max: 10 });
    for (let j = 0; j < numCards; j++) 
    {
      const randomKeywords = faker.helpers.arrayElements(sampleKeywords, { min: 2, max: 5 });

      await db.insert(cards).values({
        front : `${faker.lorem.sentence({ min: 5, max: 75 })} ${randomKeywords.join(" ")}`,
        back : `${faker.lorem.sentence({ min: 5, max: 75 })} ${randomKeywords.join(" ")}`,
        deckId: deck.id,
      });
    }
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });