import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import { SvgIcon } from "@mui/material";
import { putAsync } from "src/utils/utils";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "src/hooks/use-auth";

export default function TeachersEditModal({ teacher, onEditTeacher }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [phone, setPhone] = React.useState(""); // New state for phone number

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success"); // can be 'error', 'warning', 'info', 'success'

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submitData = async () => {
      try {
        const response = await putAsync(`teachers/${teacher.id}/update-phone?phone=${phone}`, user.idToken);
        if (!response.ok) {
          console.error(
            "Server error when updating phone:",
            response.status,
            response.statusText
          );
          throw new Error("Server error");
        }
        const updatedTeacher = { ...teacher, phoneNumber: phone };
        console.log("Form submitted successfully");
        setSnackbarMessage("Information updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        onEditTeacher(updatedTeacher); // Perform any action on successful submission here
        setOpen(false);
      } catch (error) {
        console.error("Error updating phone:", error);
        setSnackbarMessage("Failed to update teacher's information. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      finally {
        setPhone("");
      }
    }
    submitData();

    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <PencilSquareIcon />
          </SvgIcon>
        }
        variant="outlined"
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Teacher's Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the teacher's details below.</DialogContentText>
          {/* Student Details Form Fields */}
          <TextField
            margin="dense"
            id="tchr-phone"
            name="tchr-phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="standard"
            value={phone}
            onChange={handlePhoneChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={phone === ""}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx= {{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
