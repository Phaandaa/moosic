import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { SvgIcon } from "@mui/material";
import { Box } from "@mui/material";
import { postAsync } from "src/utils/utils";
import SnackbarAlert from "src/components/alert";

export default function AddItem({ onAddItem }) {
  const [open, setOpen] = React.useState(false);

  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [stock, setStock] = React.useState(0);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success"); // can be 'error', 'warning', 'info', 'success'

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handlePointsChange = (event) => {
    setPoints(event.target.value);
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation or any other pre-submission logic here
    if (!description || !type || !points || !limit || !stock) {
      console.error("Form validation failed");
      setSnackbarMessage("Validation failed. Please check the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Assuming postAsync is correctly defined elsewhere and handles the asynchronous POST request
    const submitData = async () => {
      try {
        const newItem = {
          description: description,
          type: type,
          points: points,
          limit: limit,
          stock: stock,
        };
        const response = await postAsync("reward-shop/create/without-image", newItem);
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        onAddItem(newItem); // Call the callback function to update the student list
        console.log("Form submitted successfully");
        setSnackbarMessage("Item added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Perform any action on successful submission here
        setOpen(false); // Close the modal on successful submission
        // Reset form fields or perform other cleanup tasks here
      } catch (error) {
        console.error("Form submission error:", error);
        setSnackbarMessage("Failed to add item. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // Handle submission errors (e.g., display error message)
      } finally {
        // Perform any cleanup tasks here
        setDescription("");
        setType("");
        setPoints(0);
        setLimit(0);
        setStock(0);
      }
    };

    submitData();
    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleClickOpen}
      >
        Add
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>To create an item, please enter the item details.</DialogContentText>
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"} py={2}>
            <TextField
              label="Item Name/Description"
              id="name"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={description}
              placeholder="e.g. Capo, Guitar Strings, etc."
              onChange={handleDescriptionChange}
            />
            <TextField
              label="Item Type"
              id="type"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={type}
              placeholder="physical/digital"
              onChange={handleTypeChange}
            />
            <TextField
              label="Points Required"
              id="points"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={points}
              onChange={handlePointsChange}
            />
            <TextField
              label="Limit Per Student"
              id="limit"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={limit}
              onChange={handleLimitChange}
            />
            <TextField
              label="No of Stock Available"
              id="name"
              variant="filled"
              fullWidth
              value={stock}
              onChange={handleStockChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={!description || !type || !points || !limit || !stock}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarAlert
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        handleClose={handleCloseSnackbar}
      />
    </React.Fragment>
  );
}
