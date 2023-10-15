import React, { useState } from "react";
import "./model.css"; // Import your modal styles
import { useModal } from "./useModal";

const Modal = ({ modalState, initial=false, onClose = null, style, children }) => {
  if (!modalState.status && initial === false) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={style} onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={() => {
            modalState.close();
            onClose?.();
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
