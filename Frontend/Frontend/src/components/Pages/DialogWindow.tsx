import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";

const DialogWindow = ({
  dialogTitle,
  isOpen,
  setIsOpen,
  children,
}: {
  dialogTitle: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  console.log(isOpen);

  return (

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-5/6">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {children}
          </DialogHeader>
        </DialogContent>
      </Dialog>
 
  );
};

export default DialogWindow;
