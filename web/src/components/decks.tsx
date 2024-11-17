import Deck from "./deck";
import useQueryDecks from "@/hooks/use-query-decks";

const Decks = () => {
  const { decks } = useQueryDecks();

    return (
      <div>
        {decks.map((post) => 
        {
          return <Deck key={post.id} deck={post} />;
        })}
      </div>
    );
  };

export default Decks;