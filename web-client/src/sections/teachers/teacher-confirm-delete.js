import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AccConfirmDeletionModal = ({ open, onClose, onConfirm, accounts }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete the selected {accounts?.length ? accounts.length : 0} teacher(s)?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{color: "#8193AB"}}>
                    Cancel
                </Button>
                <Button onClick={() => onConfirm(accounts)} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccConfirmDeletionModal;
