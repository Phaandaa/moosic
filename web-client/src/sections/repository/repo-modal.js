import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { figmaColors } from 'src/theme/colors';

// Modal component for rejection with a reason
export const RejectionModal = ({ open, onClose, onSubmit, reason, setReason }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Reason for Rejection</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Rejection Reason"
        type="text"
        fullWidth
        multiline  // Allows for multiple lines of text
        rows={4}   // Sets the number of lines the textbox will display
        variant="standard"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        sx={{ width: "500px"}}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{color: figmaColors.fontQuaternary}}>Cancel</Button>
      <Button onClick={() => {
        onSubmit(reason);
        onClose();
      }}>Confirm Rejection</Button>
    </DialogActions>
  </Dialog>
);

// Modal component for approval confirmation
export const ApprovalModal = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Approval</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to approve this material?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{color: figmaColors.fontQuaternary}}>Cancel</Button>
      <Button onClick={() => {
        onConfirm();
        onClose();
      }}>Approve</Button>
    </DialogActions>
  </Dialog>
);
