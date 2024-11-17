import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddDeckDialog from "./add-deck-dialog";

const Sidebar = () => {

  const [isAddDialogOpen, setAddDialogOpen] = useState(false); // State for Edit Dialog
  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button aria-label={"Home"} variant="ghost" size="icon">
        <HomeIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Search"} variant="ghost" size="icon">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Make a Post"} variant="default" size="icon" onClick={() => setAddDialogOpen(true)}>
        <PlusCircledIcon className="w-5 h-5" />
      </Button>
      <AddDeckDialog isAddDialogOpen={isAddDialogOpen} setAddDialogOpen={setAddDialogOpen} />
    </div>
  );
};

export default Sidebar;
