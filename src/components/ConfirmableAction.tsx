import { FC, useState } from "react";
import ConfirmModal from "./ConfirmModal";

type ChildButton = FC<{
  triggerModal: () => void;
}>;

interface ConfirmableActionProps {
  onConfirm: () => Promise<void> | void;
  RenderChild: ChildButton;
  modalContent?: string;
  modalTitle?: string;
  modalConfirmText?: string;
  modalCancelText?: string;
  waitActionCompletion?: boolean;
}

const ConfirmableAction = (props: ConfirmableActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleConfirm = async () => {
    const confirmPromise = props.onConfirm();
    if (confirmPromise instanceof Promise && props.waitActionCompletion) {
      setIsWaiting(true);
      await confirmPromise;
      setIsWaiting(false);
    }
    setIsModalOpen(false);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  }

  return (
    <>
      <ConfirmModal 
        onClose={handleClose}
        onConfirm={handleConfirm}
        open={isModalOpen}
        title={isWaiting ? 'Waiting...' : props.modalTitle || "Confirm Action"}
        message={props.modalContent || "Are you sure?"}
        cancelButtonText={props.modalCancelText || "Cancel"}
        confirmButtonText={props.modalConfirmText || "Confirm"}
      />
      <props.RenderChild
        triggerModal={handleOpen}
      />
    </>
  )
};

export default ConfirmableAction;