import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { FormControl, InputLabel, Select, MenuItem, SvgIcon } from "@mui/material";
import { postAsync } from "src/utils/utils";
import { useAuth } from "src/hooks/use-auth";

export default function TeachersModal({ onAddTeacher }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [teacherName, setTeacherName] = React.useState("");
  const [teacherEmail, setTeacherEmail] = React.useState("");
  const [instrument, setInstrument] = React.useState("");
  const [teacherPhone, setTeacherPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordCfm, setPasswordCfm] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleClickOpen = () => {
    setOpen(true);
    setStep(1); // Start from first step
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (event) => {
    setTeacherName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setTeacherEmail(event.target.value);
  };

  const handleInstrumentChange = (event) => {
    setInstrument(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setTeacherPhone(event.target.value);
    console.log("Phone:", event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordCfmChange = (event) => {
    setPasswordCfm(event.target.value);
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
        console.log(teacherPhone);
        const response = await postAsync("users/create", {
          name: teacherName,
          email: teacherEmail,
          role: "Teacher",
          password: password, // Make sure your API expects this structure
          info: {
            instrument: instrument,
            phone: teacherPhone.toString(),
          },
        }, user.idToken);
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        const data = await response.json();
        console.log("Server response:", data);
        onAddTeacher(data); // Call the callback function to update the student list

        console.log("Form submitted successfully");
        setSnackbarMessage("Student added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Perform any action on successful submission here
        setOpen(false); // Close the modal on successful submission
        // Reset form fields or perform other cleanup tasks here
      } catch (error) {
        console.error("Form submission error:", error);
        setSnackbarMessage("Failed to add Teacher. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // Handle submission errors (e.g., display error message)
      } finally {
        // Perform any cleanup tasks here
        setTeacherName("");
        setTeacherEmail("");
        setInstrument("");
        setTeacherPhone("");
        setPassword("");
        setPasswordCfm("");
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
        Add Teacher
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>{step === 1 ? "Teacher Details" : "Login Details"}</DialogTitle>
        <DialogContent>
          {step === 1 && (
            // Step 1: Teacher Details
            <>
              <DialogContentText>
                To create a teacher account, please enter the teacher's details.
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="tchr-name"
                name="tchr-name"
                label="Full Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleNameChange}
                value={teacherName}
              />
              <TextField
                required
                margin="dense"
                id="tchr-email"
                name="tchr-email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={handleEmailChange}
                value={teacherEmail}
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
                margin="dense"
                id="tchr-phone"
                name="tchr-phone"
                label="Phone Number"
                type="tel"
                fullWidth
                variant="standard"
                onChange={handlePhoneChange}
                value={teacherPhone}
                required
              />
            </>
          )}
          {step === 2 && (
            // Step 2: Login Details
            <>
              <DialogContentText>Please enter the password details.</DialogContentText>

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
                disabled={!teacherName || !teacherEmail || !instrument || !teacherPhone}
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
