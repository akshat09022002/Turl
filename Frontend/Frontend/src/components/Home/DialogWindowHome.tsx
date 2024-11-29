import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import React from "react";

const DialogWindowHome = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-5/6 border-0 p-0 rounded-lg">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWindowHome;
