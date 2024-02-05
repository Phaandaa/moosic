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
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { postAsync } from "src/utils/utils";

export default function StudentsModal({ onAddStudent }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1); // New state for tracking the step

  const [studentName, setStudentName] = React.useState("");
  const [studentEmail, setStudentEmail] = React.useState("");
  const [instrument, setInstrument] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordCfm, setPasswordCfm] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success"); // can be 'error', 'warning', 'info', 'success'

  const handleNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setStudentEmail(event.target.value);
  };

  const handleInstrumentChange = (event) => {
    setInstrument(event.target.value);
  };

  const handleGradeLevelChange = (event) => {
    setGradeLevel(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordCfmChange = (event) => {
    setPasswordCfm(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setStep(1); // Reset to step 1 when opening the modal
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation or any other pre-submission logic here
    if (step !== 2 || !password || !passwordCfm || password !== passwordCfm) {
      console.error("Form validation failed");
      setSnackbarMessage("Validation failed. Please check the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Assuming postAsync is correctly defined elsewhere and handles the asynchronous POST request
    const submitData = async () => {
      try {
        const response = await postAsync("users/create", {
          name: studentName,
          email: studentEmail,
          role: "Student",
          password: password, // Make sure your API expects this structure
          info: {
            instrument: instrument,
            grade: gradeLevel,
          },
        });
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        const data = await response.json();
        console.log("Server response:", data);
        onAddStudent(data); // Call the callback function to update the student list

        console.log("Form submitted successfully");
        setSnackbarMessage("Student added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Perform any action on successful submission here
        setOpen(false); // Close the modal on successful submission
        // Reset form fields or perform other cleanup tasks here
      } catch (error) {
        console.error("Form submission error:", error);
        setSnackbarMessage("Failed to add student. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // Handle submission errors (e.g., display error message)
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
        <DialogTitle>{step === 1 ? "Student Details" : "Login Details"}</DialogTitle>
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
                onChange={handleNameChange} // Add onChange
                value={studentName} // Control the component
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="stu-email"
                name="stu-email"
                label="Student Email Address"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleEmailChange} // Add onChange
                value={studentEmail} // Control the component
              />
              <FormControl fullWidth variant="standard" margin="dense">
                <InputLabel id="instrument-label">Instrument</InputLabel>
                <Select
                  labelId="instrument-label"
                  id="instrument"
                  name="instrument"
                  value={instrument}
                  onChange={handleInstrumentChange}
                  required
                >
                  <MenuItem value="Piano">Piano</MenuItem>
                  <MenuItem value="Guitar">Guitar</MenuItem>
                  <MenuItem value="Ukulele">Ukulele</MenuItem>
                  <MenuItem value="Violin">Violin</MenuItem>
                </Select>
              </FormControl>

              <TextField
                autoFocus
                required
                margin="dense"
                id="age"
                name="age"
                label="Grade Level"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleGradeLevelChange} // Add onChange
                value={gradeLevel} // Control the component
              />
            </>
          )}

          {step === 2 && (
            // Step 2: Parent Details
            <>
              <DialogContentText>Please enter the password details.</DialogContentText>
              {/* Parent Details Form Fields */}
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
                onChange={handlePasswordChange} // Add onChange
                value={password} // Control the component
              />
              <TextField
                required
                margin="dense"
                id="password-cfm"
                name="password-cfm"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={handlePasswordCfmChange} // Add onChange
                value={passwordCfm} // Control the component
              />
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                {password !== passwordCfm ? "Passwords do not match" : ""}
              </span>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {step === 1 && (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!studentName || !studentEmail || !instrument || !gradeLevel}
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button
                type="submit"
                disabled={!password || !passwordCfm || password !== passwordCfm}
              >
                Create
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
