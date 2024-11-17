"use client";
import { useState } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons"; // NEED TO CHANGE TO ELLIPSE
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import EditDeckDialog from "./edit-deck-dialog";
import { DeckType } from "@/data/types";
import useMutationDecks from "@/hooks/use-mutation-decks";


type DeckActionProps = {
  deck: DeckType;
};

const DeckActions = ({ deck } : DeckActionProps) => {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false); // State for Edit Dialog
  const {deleteDeckById} = useMutationDecks();

  const handleDelete = () => {
    deleteDeckById(deck.id);
  };
  return (
    
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <DotsVerticalIcon className="w-4 h-4 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <EditDeckDialog isEditDialogOpen={isEditDialogOpen} setEditDialogOpen={setEditDialogOpen} deck={deck}/>

    </div>
  );
};

export default DeckActions;
