import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import "../../styles/modal.css";


const AppModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth, // 👈 optional
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="app-modal"
      overlayClassName="app-modal-overlay"
      style={{
        content: {
          maxWidth: maxWidth ?? "auto", // ✅ auto by default
        },
      }}
    >
      <div className="app-modal-header">
        <h2>{title}</h2>
        <button className="app-modal-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>

      <div className="app-modal-body">
        {children}
      </div>
    </Modal>
  );
};

export default AppModal;
