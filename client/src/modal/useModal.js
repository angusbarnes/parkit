import { useState } from "react";

export function useModal() {
  const [isOpen, toggleIsOpen] = useState(false);
  return {
    status: isOpen,
    close: () => {
      toggleIsOpen(false);
    },
    open: () => {
      console.log("Modal opened");
      toggleIsOpen(true);
    },
  };
}
