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
  DialogContentText,
  TextField,
  Divider,
  InputAdornment,
  Grid,
} from "@mui/material";
import { deleteAsync } from "src/utils/utils";
import { putAsync } from "src/utils/utils";
import { useState } from "react";
import Lottie from "react-lottie";
import noImage from "public/assets/noImage.json";

export const ItemDetailModal = ({
  open,
  handleClose,
  item,
  onDeleteItem,
  triggerSnackbar,
  onEditItem,
}) => {
  const [studentId, setStudentId] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      triggerSnackbar("No file selected.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await putAsync(`reward-shop/image-update/${item.id}`, formData, null, true);

      if (response.ok) {
        triggerSnackbar("Image updated successfully!", "success");
        const updatedItem = { ...item }; // Construct the updated item
        onEditItem(updatedItem); // Update the item in the parent state
        // You may want to update the state to reflect the new image, if necessary
      } else {
        console.log("response", response);
        triggerSnackbar("Failed to update image.", "error");
      }
    } catch (error) {
      triggerSnackbar("Error updating image.", "error");
      console.error("Error updating image:", error);
    } finally {
      setSelectedFile(null);
    }
  };

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
          <DialogContentText>Item Image</DialogContentText>
          <Box display={"flex"} justifyContent={"center"} my={2} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"center"}>
              {item.imageLink ? (
                <img
                  src={item?.imageLink || ""}
                  alt={item?.description || "N/A"}
                  style={{ maxHeight: "300px", maxWidth: "100%", height: "auto", width: "auto" }}
                />
              ) : (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: noImage,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={300}
                  width={300}
                />
              )}
            </Box>

            <Box display={"flex"} justifyContent={"space-between"} mt={1} alignItems={"center"}>
              <TextField
                id="image"
                label="Image Link"
                value={selectedFile ? selectedFile.name : item?.imageLink || ""}
                sx={{ flexGrow: 1, mr: 2 }}
                disabled
              />
              {/* <Button variant="contained" color="success" onClick={handleChooseImage}>
                Choose Image
              </Button> */}
              <input
                accept="image/*"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="raised-button-file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="success" component="span">
                  Choose Image
                </Button>
              </label>
              <Button
                variant="contained"
                color="success"
                onClick={handleUploadImage}
                sx={{ ml: 2 }}
                disabled={!selectedFile}
              >
                Upload Image
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mt={2}>
            <DialogContentText>Item Details</DialogContentText>
          </Box>
          <Grid container spacing={2} sx={{ my: 2, justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Type"
                id="type"
                sx={{ width: "26ch" }}
                variant="filled"
                disabled={disabled}
                value={item?.type || "N/A"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Points"
                id="points"
                sx={{ width: "26ch" }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">pts</InputAdornment>,
                }}
                variant="filled"
                disabled={disabled}
                value={item?.points || 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="In Stock"
                id="stock"
                sx={{ width: "26ch" }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">pts</InputAdornment>,
                }}
                variant="filled"
                disabled={disabled}
                value={item?.stock || 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Limit"
                id="limit"
                sx={{ width: "26ch" }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">/student</InputAdornment>,
                }}
                variant="filled"
                disabled={disabled}
                value={item?.limitation || 0}
              />
            </Grid>
          </Grid>
          <Divider />
          <DialogContentText sx={{ my: 2 }}>Redeem Points</DialogContentText>
          <Box display={"flex"} justifyContent={"space-between"}>
            <TextField
              id="stu-id"
              label="Student ID"
              value={studentId}
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <Button variant="contained" color="success">
              Redeem Points
            </Button>
          </Box>
          {/* Placeholder for buttons */}
        </DialogContent>
        <DialogActions sx={{ padding: "20px" }}>
          <Button variant="contained" color="primary">
            Edit Details
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteItem}>
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
