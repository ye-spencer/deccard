import { API_URL } from "@/env";
import { DeckType } from "./types";

// Fetch all decks
export const fetchDecks = async (): Promise<DeckType[]> => 
{
    const response = await fetch(`${API_URL}/decks`);
    if (!response.ok) 
    {
        throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data = await response.json();
    return data.decks; /** we gotta change this all */
};

// Delete a deck by id
export const deleteDeck = async (id: string): Promise<boolean> => 
{
    const response = await fetch(`${API_URL}/decks/${id}`, { method: "DELETE" });
    if (!response.ok) 
    {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    return true;
  };

// Create a deck
export const createDeck = async (title: string): Promise<DeckType> => 
{
    const response = await fetch(`${API_URL}/decks`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({title}),
    });

    if (!response.ok) 
    {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data : DeckType = await response.json();
    return data;
  };

// Edit a deck
export const editDeck = async (id: string, title: string,): Promise<DeckType> => {
    const response = await fetch(`${API_URL}/decks/${id}`, 
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) 
    {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: DeckType = await response.json();
    return data;
  };