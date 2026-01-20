// src/components/ui/ConfirmModal.jsx
import React from "react";
import AppModal from "./modal"; // your existing modal
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "../../styles/modal.css";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  type = "delete", // default type
}) {
  // Choose icon based on type
  const Icon = type === "info" ? FaInfoCircle : FaExclamationTriangle;

  return (
    <AppModal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="400px">
      <div className="confirm-modal-content">
        <Icon className={`confirm-modal-icon ${type}`} />
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button
            onClick={onCancel}
            className="confirm-modal-button cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`confirm-modal-button ${type}`}
            disabled={loading}
          >
            {loading ? `${type === "delete" ? "Deleting..." : "Processing..."}` : type === "delete" ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </AppModal>
  );
}
