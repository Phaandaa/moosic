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
import generatePassword from "generate-password";
import emailjs from "emailjs-com";
import { useEffect } from "react";

export default function TeachersModal({ onAddTeacher }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [teacherName, setTeacherName] = React.useState("");
  const [teacherEmail, setTeacherEmail] = React.useState("");
  const [instrument, setInstrument] = React.useState("");
  const [teacherPhone, setTeacherPhone] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleClickOpen = () => {
    setOpen(true);
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

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation or any other pre-submission logic here
    if (!teacherName || !teacherEmail || !instrument || !teacherPhone) {
      console.error("Form validation failed");
      setSnackbarMessage("Validation failed. Please check the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    // Generate a random password for the teacher
    const generatedPassword = generatePassword.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      strict: true,
    });

    // Assuming postAsync is correctly defined elsewhere and handles the asynchronous POST request
    const submitData = async () => {
      try {
        console.log(teacherPhone);
        const response = await postAsync(
          "users/create",
          {
            name: teacherName,
            email: teacherEmail,
            role: "Teacher",
            password: generatedPassword,
            info: {
              instrument: instrument,
              phone: teacherPhone.toString(),
            },
          },
          user.idToken
        );
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        const data = await response.json();
        console.log("Server response:", data);
        onAddTeacher(data); // Call the callback function to update the teacher list

        // Send an email to the teacher with the generated password
        const emailParams = {
          to_email: teacherEmail,
          to_name: teacherName,
          email: teacherEmail,
          password: generatedPassword,
          from_name: "Learn2Play Moosic Admin"
        };

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

        emailjs.send(serviceId, templateId, emailParams)
        .then((response) => {
          console.log('Email sent to teacher!', response.status, response.text);
          // Handle email sent confirmation
        }, (error) => {
          console.log('Failed to send email to teacher.', error);
          // Handle email send failure
        });

        const passwordResetResponse = await postAsync(`api/auth/request-password-reset/${data.id}`, null, user.idToken, false);

        if (!passwordResetResponse.ok) {
          console.error("Server error:", passwordResetResponse.status, passwordResetResponse.statusText);
          throw new Error("Password reset function error");
        } else {
          console.log("Password reset email sent successfully");
        }

        console.log("Form submitted successfully");
        setSnackbarMessage("Teacher added successfully!");
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
        <DialogTitle>Teacher Details</DialogTitle>
        <DialogContent>
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
          <FormControl fullWidth variant="standard" margin="dense" required>
            <InputLabel id="instrument-label">Instrument</InputLabel>
            <Select
              labelId="instrument-label"
              id="instrument"
              name="instrument"
              value={instrument}
              onChange={handleInstrumentChange}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={!teacherName || !teacherEmail || !instrument || !teacherPhone}
          >
            Create
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
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
