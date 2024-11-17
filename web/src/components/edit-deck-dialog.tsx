import { useState } from "react"
import { Button } from "./ui/button"
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { DeckType } from "@/data/types"
import useMutationDecks from "@/hooks/use-mutation-decks"
import { toast } from "@/components/ui/use-toast";

type EditDeckProps = {
    isEditDialogOpen : boolean
    setEditDialogOpen : React.Dispatch<React.SetStateAction<boolean>> 
    deck : DeckType
}

let EditDeckDialog = ({ isEditDialogOpen, setEditDialogOpen, deck }: EditDeckProps) => {

    let [inputValue, setInputValue] = useState(deck.title);

    const {updateDeck} = useMutationDecks();

    const handleEdit = () => {
        if (inputValue === "")
        {  
            toast({
                variant: "destructive",
                title: "Sorry! There was an error editing the deck 🙁",
                description: "The deck name cannot be edited to be empty",
            });
        }
        else
        {
            updateDeck(deck.id, inputValue);
            deck.title = inputValue;
        }
        closeDialog(false);

    };

    const closeDialog = (value : boolean) => {
        setEditDialogOpen(value);
        setInputValue(deck.title);
    }

    return (
        <div> 
            <Dialog open={isEditDialogOpen} onOpenChange={closeDialog}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Deck</DialogTitle>
                    <DialogDescription>Make changes to your deck here.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)} 
                            placeholder="Enter deck name"
                        />                             
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => closeDialog(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={handleEdit}>Save Changes</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditDeckDialog;