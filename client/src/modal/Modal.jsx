import React, { useState } from 'react';
import './model.css'; // Import your modal styles
import { useModal } from './useModal';

const Modal = ({ modalState, onClose = null, children }) => {
  if (!modalState.status) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={() => {modalState.close(); onClose?.()}}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
