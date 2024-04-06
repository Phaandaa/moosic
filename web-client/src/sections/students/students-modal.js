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
import { useAuth } from "src/hooks/use-auth";
import generatePassword from "generate-password";
import emailjs from 'emailjs-com';
import { useEffect } from "react";

export default function StudentsModal({ onAddStudent }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [studentName, setStudentName] = React.useState("");
  const [studentEmail, setStudentEmail] = React.useState("");
  const [instrument, setInstrument] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("");
  const [tuitionDay, setTuitionDay] = React.useState("");

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

  const handleTuitionDayChange = (event) => {
    setTuitionDay(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation or any other pre-submission logic here
    if (!studentName || !studentEmail || !instrument || !gradeLevel || !tuitionDay) {
      console.error("Form validation failed");
      setSnackbarMessage("Validation failed. Please check the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    // Generate a random password for the student
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
        const newData = {
          name: studentName,
          email: studentEmail,
          role: "Student",
          password: generatedPassword,
          info: {
            instrument: instrument,
            grade: gradeLevel,
            tuitionDay: tuitionDay,
          },
        };
        console.log("Submitting form data:", newData);
        const response = await postAsync("users/create", newData, user.idToken, false);
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        const data = await response.json();
        console.log("Server response:", data);
        onAddStudent(data); // Call the callback function to update the student list

        // Send an email to the student with the generated password
        const emailParams = {
          to_email: studentEmail,
          to_name: studentName,
          email: studentEmail,
          password: generatedPassword,
          from_name: "Learn2Play Moosic Admin"
        };

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

        emailjs.send(serviceId, templateId, emailParams)
        .then((response) => {
          console.log('Email sent to student!', response.status, response.text);
          // Handle email sent confirmation
        }, (error) => {
          console.log('Failed to send email to student.', error);
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
      } finally {
        // Perform any cleanup tasks here
        setStudentName("");
        setStudentEmail("");
        setInstrument("");
        setGradeLevel("");
        setTuitionDay("");
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
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
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
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="tuition-day-label">Tuition Day</InputLabel>
            <Select
              labelId="tuition-day-label"
              id="tuition-day"
              name="tuition-day"
              value={tuitionDay}
              onChange={handleTuitionDayChange}
              required
            >
              <MenuItem value="monday">Monday</MenuItem>
              <MenuItem value="tuesday">Tuesday</MenuItem>
              <MenuItem value="wednesday">Wednesday</MenuItem>
              <MenuItem value="thursday">Thursday</MenuItem>
              <MenuItem value="friday">Friday</MenuItem>
              <MenuItem value="saturday">Saturday</MenuItem>
              <MenuItem value="sunday">Sunday</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={!studentName || !studentEmail || !instrument || !gradeLevel || !tuitionDay}
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
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
