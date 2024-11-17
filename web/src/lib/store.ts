import { atom } from "nanostores";
import { DeckType } from "@/data/types";

export const $decks = atom<DeckType[]>([]);

export function setDecks(decks: DeckType[]) 
{
    $decks.set(decks);
}
  
export function addDeck(deck: DeckType) 
{
    $decks.set([deck, ...$decks.get()]);
}
  
export function removeDeck(id: string) 
{
    $decks.set($decks.get().filter((deck) => deck.id !== id));
}
  
export function updateDeckTitle(id: string, title: string) 
{
    $decks.set(
        $decks.get().map((deck) => {
        if (deck.id === id) 
        {
            return { ...deck, title: title };
        }
        return deck;
        }),
    );
}