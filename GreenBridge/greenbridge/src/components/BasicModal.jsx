import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './basicModal.css'

const style = {

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  
};

export default function BasicModal({open,setOpen,isConfirmModal,onConfirm,heading,content, customStyle}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={customStyle?customStyle:null}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {isConfirmModal?
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {heading}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
         {content}
        </Typography>
        <div className='modal-button-container'>
          <button onClick={handleClose} className='modal-cancel-button'>Cancel</button>
          <button onClick={onConfirm} className='modal-confirm-button'>Ok</button>
        </div>
      </Box>:
      <Box sx={{ ...style, ...customStyle }}>
        {content}
      </Box>}
        
      </Modal>
    </div>
  );
}