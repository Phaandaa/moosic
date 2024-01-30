import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { SvgIcon } from "@mui/material";

export default function CustomersModal() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1); // New state for tracking the step

  const handleClickOpen = () => {
    setOpen(true);
    setStep(1); // Reset to step 1 when opening the modal
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
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
        <DialogTitle>{step === 1 ? "Student Details" : "Parent Details"}</DialogTitle>
        <DialogContent>
          {step === 1 && (
            // Step 1: Student Details
            <>
              <DialogContentText>
                To create an account, please enter the student's details.
              </DialogContentText>
              {/* Student Details Form Fields */}
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Student Full Name"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="age"
                name="age"
                label="Student Age"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                // required
                margin="dense"
                id="stu-phone"
                name="stu-phone"
                label="Student Phone Number"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                // required
                margin="dense"
                id="stu-email"
                name="stu-email"
                label="Student Email Address"
                type="number"
                fullWidth
                variant="standard"
              />
            </>
          )}
          {step === 2 && (
            // Step 2: Parent Details
            <>
              <DialogContentText>Please enter the parent's details.</DialogContentText>
              {/* Parent Details Form Fields */}
              <TextField
                autoFocus
                // required
                margin="dense"
                id="parent-name"
                name="parent-name"
                label="Parent Full Name"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                // required
                margin="dense"
                id="parent-phone"
                name="parent-phone"
                label="Parent Phone Number"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                // required
                margin="dense"
                id="parent-email"
                name="parent-email"
                label="Parent Email Address"
                type="email"
                fullWidth
                variant="standard"
              />
            </>
          )}

          {step === 3 && (
            // Step 2: Parent Details
            <>
              <DialogContentText>Please enter the login details.</DialogContentText>
              {/* Parent Details Form Fields */}
              <TextField
                autoFocus
                required
                margin="dense"
                id="username"
                name="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="password-cfm"
                name="password-cfm"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {step === 1 && (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </>
          )}

          {step === 3 && (
            <>
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button type="submit">Create</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
