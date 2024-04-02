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
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import { SvgIcon } from "@mui/material";
import { getAsync, putAsync } from "src/utils/utils"; // Assuming getAsync is a utility for making GET requests
import { useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { set } from "nprogress";

export default function StudentsEditModal({ student, onEditStudent }) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [teachers, setTeachers] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState({});
  const [grade, setGrade] = React.useState("");
  const [tuitionDay, setTuitionDay] = React.useState("");

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success"); // can be 'error', 'warning', 'info', 'success'


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher({});
    setGrade("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submitData = async () => {
      try {
        if (Object.keys(selectedTeacher).length > 0) {
          const responseTeacher = await putAsync(`students/${student.id}/update-teacher?teacherId=${selectedTeacher.id}`, null, user.idToken);
          if (!responseTeacher.ok) {
            console.error(
              "Server error when updating teacherId:",
              responseTeacher.status,
              responseTeacher.statusText
            );
            throw new Error("Server error");
          }
        }
        if (grade !== "") {
          const responseGrade = await putAsync(`students/${student.id}/update-grade?grade=${grade}`, null, user.idToken);
          if (!responseGrade.ok) {
            console.error(
              "Server error when updating grade:",
              responseGrade.status,
              responseGrade.statusText
            );
            throw new Error("Server error");
          }
        }

        if (tuitionDay !== "") {
          const responseTuitionDay = await putAsync(`students/${student.id}/update-tuition-day?tuitionDay=${tuitionDay}`, null, user.idToken);
          if (!responseTuitionDay.ok) {
            console.error(
              "Server error when updating tuition day:",
              responseTuitionDay.status,
              responseTuitionDay.statusText
            );
            throw new Error("Server error");
          }
        }

        const updatedStudent = {
          ...student, // Copy all existing student data
          teacherId: Object.keys(selectedTeacher).length != 0 ? selectedTeacher.id : student.teacherId, // Update with the new teacher ID
          teacherName: Object.keys(selectedTeacher).length != 0 ? selectedTeacher.name : student.teacherName, // Update with the new teacher name
          grade: grade != "" ? grade : student.grade, // Update with the new grade
          tuitionDay: tuitionDay != "" ? tuitionDay : student.tuitionDay, // Update with the new tuition day
        };

        console.log("Form submitted successfully");
        setSnackbarMessage("Information updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        onEditStudent(updatedStudent); // Perform any action on successful submission here

        // Perform any action on successful submission here
        setOpen(false); // Close the modal on successful submission
        // Reset form fields or perform other cleanup tasks here
      } catch (error) {
        console.error("Form submission error:", error);
        setSnackbarMessage("Failed to update student information. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        // Perform any cleanup tasks here
        setSelectedTeacher({});
        setGrade("");
        setTuitionDay("");
      }
    };

    submitData();

    handleClose();
  };

  const handleChangeTeacher = (event) => {
    const selectedTeacher = teachers.find((teacher) => teacher.id === event.target.value);
    setSelectedTeacher(selectedTeacher || {}); // Store the entire teacher object or an empty object if not found
  };

  const handleChangeGrade = (event) => {
    setGrade(event.target.value);
  };

  const handleTuitionDayChange = (event) => {
    setTuitionDay(event.target.value);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAsync("teachers", user.idToken);
        const data = await response.json();
        setTeachers(data.filter((teacher) => teacher.instrument === student.instrument));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

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
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          <>
            <DialogContentText>Edit the student's details below.</DialogContentText>
            {/* Student Details Form Fields */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="teacher-select-label">Teacher</InputLabel>
              <Select
                labelId="teacher-select-label"
                id="teacher"
                value={selectedTeacher.id || ""}
                label="Teacher"
                onChange={handleChangeTeacher}
                autoFocus
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="grade"
              name="grade"
              label="Student's Grade"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleChangeGrade}
              value={grade}
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
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit"
            disabled={Object.keys(selectedTeacher).length === 0 && grade === "" && tuitionDay === ""}
          >Submit</Button>
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
