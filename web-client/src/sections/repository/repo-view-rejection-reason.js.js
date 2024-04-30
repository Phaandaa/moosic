import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  SvgIcon,
  Box,
} from "@mui/material";
import { figmaColors } from "src/theme/colors";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const ViewRejectionReasonModal = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      
    >
      <Box display="flex" justifyContent="space-between">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <Button onClick={onClose}><SvgIcon><XMarkIcon /></SvgIcon></Button>
      </Box>
      <DialogContent sx={{minWidth: "400px"}}>
        <DialogContentText id="alert-dialog-description" sx={{color: figmaColors.fontPrimary}}>{children}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
