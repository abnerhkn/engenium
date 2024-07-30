import React from 'react';
import '../styles/Modal.css'; 

const Modal = ({ isOpen, onClose, onDelete, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Continuar</button>
          <button onClick={onDelete}>Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
