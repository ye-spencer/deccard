import { DeckType } from "@/data/types";
import DeckActions from "./deck-actions";

type DeckProps = {
  deck: DeckType;
};

const Deck = ({ deck }: DeckProps) => {

  return (
    <div className="m-6 border-2 border-gray">
        <div className="flex items-center justify-between pl-4 pr-4 pt-3"> 
            <p>{deck.title}</p>
            <DeckActions deck={deck}/>
        </div>
        <div className="p-4 pt-12 text-xs text-muted-foreground">
            <span> 0 Cards </span>
        </div>
    </div>
  );
};

export default Deck;