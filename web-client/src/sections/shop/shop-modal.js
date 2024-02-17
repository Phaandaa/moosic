import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogContentText,
} from "@mui/material";
import { deleteAsync } from "src/utils/utils";
import SnackbarAlert from "src/components/alert";

export const ItemDetailModal = ({ open, handleClose, item, onDeleteItem, triggerSnackbar }) => {

  const handleDeleteItem = async () => {
    try {
      // Delete item logic
      const response = await deleteAsync(`reward-shop/${item.id}`);
      if (response.ok) {
        onDeleteItem(item.id);
        handleClose();
        triggerSnackbar("Item deleted successfully!", "success");
      } else {
        triggerSnackbar("Error deleting item", "error");
        console.error("Error deleting item:", response);
      }
    } catch (error) {
      triggerSnackbar("Error deleting item", "error");
      console.error("Error deleting item:", error);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="item-detail-modal-title">{item?.description || "N/A"}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>Item Details</DialogContentText>
          <Typography id="item-detail-description" sx={{ mt: 2 }}>
            Type: {item?.type || "N/A"}
          </Typography>
          <Typography sx={{ mt: 2 }}>Points: {item?.points || 0} Pts</Typography>
          <Typography sx={{ mt: 2, mb: 2 }}>Stock: {item?.stock || 0}</Typography>
          {/* Placeholder for buttons */}
        </DialogContent>
        <DialogActions sx={{ padding: "20px" }}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>
            Edit Details
          </Button>
          <Button variant="contained" color="success" sx={{ mr: 1 }}>
            Redeem Points
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteItem}>
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
