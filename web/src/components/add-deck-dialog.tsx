import { useState } from "react"
import { Button } from "./ui/button"
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import useMutationDecks from "@/hooks/use-mutation-decks"
import { toast } from "@/components/ui/use-toast";

type AddDeckProps = {
    isAddDialogOpen : boolean
    setAddDialogOpen : React.Dispatch<React.SetStateAction<boolean>> 
}

let AddDeckDialog = ({ isAddDialogOpen, setAddDialogOpen }: AddDeckProps) => {

    let [inputValue, setInputValue] = useState("");
    const {addNewDeck} = useMutationDecks();

    const handleAdd = () => 
    {
        if (inputValue === "")
        {  
            toast({
                variant: "destructive",
                title: "Error while adding the deck 🙁",
                description: "The deck name cannot be empty",
            });
        }
        else
        {
            addNewDeck(inputValue);
        }
        closeDialog(false);
    };

    const closeDialog = (value : boolean) => {
        setAddDialogOpen(value);
        setInputValue("");
    }


    return (
        <div> 
            <Dialog open={isAddDialogOpen} onOpenChange={closeDialog}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Deck</DialogTitle>
                    <DialogDescription>Add a deck here.</DialogDescription>
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
                    <Button variant="outline" onClick={handleAdd}>
                        Save
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddDeckDialog;