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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useAuth } from "src/hooks/use-auth";

export default function AddItem({ onAddItem }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState("");
  const [subtype, setSubtype] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [stock, setStock] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState(null);
  // You can define the options for the select dropdown
  const itemTypeOptions = ["PHYSICAL", "DIGITAL"];
  const itemSubtypeOptions = ["badge", "frame", "avatar"];

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success"); // can be 'error', 'warning', 'info', 'success'

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleSubtypeChange = (event) => {
    setSubtype(event.target.value);
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
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset the selectedFile to null when the modal is closed
    setSelectedFile(null);
    // Reset other form fields if necessary
    setDescription("");
    setType("");
    setPoints(0);
    setLimit(0);
    setStock(0);
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
          subtype: subtype,
          points: points,
          limitation: limit,
          stock: stock,
        };
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("reward-shop-item", JSON.stringify(newItem));
        // console.log("formData", formData.get("files"), formData.get("reward-shop-item"));
        let response = null;
        if (!selectedFile) {
          response = await postAsync("reward-shop/create/without-image", newItem, user.idToken, false);
        } else {
          response = await postAsync("reward-shop/create/with-image", formData, user.idToken, true);
        }
        const data = await response.json();
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        onAddItem(data); // Call the callback function to update the student list
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
        setSelectedFile(null);
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
              required
            />
            <FormControl variant="filled" sx={{ mb: 2 }} fullWidth required>
              <InputLabel id="type-label">Item Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={handleTypeChange}
                label="Item Type"
              >
                {itemTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0) + option.slice(1).toLowerCase()}{" "}
                    {/* Capitalize the first letter */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {type === "DIGITAL" && (
              <FormControl variant="filled" sx={{ mb: 2 }} fullWidth required>
                <InputLabel id="subtype-label">Item Subtype</InputLabel>
                <Select
                  labelId="subtype-label"
                  id="subtype"
                  value={subtype}
                  onChange={handleSubtypeChange}
                  label="Item Subtype"
                >
                  {itemSubtypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}{" "}
                      {/* Capitalize the first letter */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Points Required"
              id="points"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={points}
              onChange={handlePointsChange}
              required
            />
            <TextField
              label="Limit Per Student"
              id="limit"
              variant="filled"
              fullWidth
              sx={{ mb: 2 }}
              value={limit}
              onChange={handleLimitChange}
              required
            />
            <TextField
              label="No of Stock Available"
              id="name"
              variant="filled"
              fullWidth
              value={stock}
              onChange={handleStockChange}
              required
            />
          </Box>
          <Box display={"flex"} justifyContent={"space-between"} mt={1} alignItems={"center"}>
            {selectedFile && (
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Typography sx={{ flexGrow: 1, mr: 2, fontWeight: "bold" }}>Filename:</Typography>
                <Typography sx={{ flexGrow: 1, mr: 2 }}>{selectedFile.name}</Typography>
              </Box>
            )}
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="success" component="span" sx={{ minHeight: 55 }}>
                Choose Image
              </Button>
            </label>
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
