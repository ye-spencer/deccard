import { useEffect } from "react";
import { fetchDecks } from "@/data/api";
import { useStore } from "@nanostores/react";
import { setDecks, $decks } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

function useQueryDecks() 
{
  const decks = useStore($decks);

  const loadDecks = async () => {
    try 
    {
      const fetchedDecks = await fetchDecks();
      setDecks([...fetchedDecks]);
    } 
    catch (error) 
    {
      const errorMessage = (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the decks 🙁",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  return { decks };
}

export default useQueryDecks;