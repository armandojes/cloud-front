import { Modal, Button } from "@mui/material"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmButtonText: string
  cancelButtonText: string
}

const ConfirmModal = (props: ConfirmModalProps) => (
  <Modal
    open={props.open}
    onClose={props.onClose}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className="modal"
      style={{
        color: 'black',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        textAlign: 'center',
      }}
    >
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <Button onClick={props.onConfirm}>{props.confirmButtonText}</Button>
      <Button onClick={props.onClose}>{props.cancelButtonText}</Button>
    </div>
  </Modal>
)

export default ConfirmModal