import * as React from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { SvgIcon } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  Checkbox,
  ListItemText,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { postAsync } from "src/utils/utils";
import SnackbarAlert from "src/components/alert";
import { useAuth } from "src/hooks/use-auth";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function RepoAdd({ onAddFile }) {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);

  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const onTriggerSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [type, setType] = React.useState([]);
  const [instrument, setInstrument] = React.useState([]);
  const [grade, setGrade] = React.useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleInstrumentChange = (event) => {
    const {
      target: { value },
    } = event;
    setInstrument(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleGradeChange = (event) => {
    const {
      target: { value },
    } = event;
    setGrade(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setType([]);
    setInstrument([]);
    setGrade([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation or any other pre-submission logic here
    const submitData = async () => {
      try {
        const newMaterial = {
          title: title,
          description: description,
          type: type,
          instrument: instrument,
          grade: grade,
          teacherId: user.userId,
          teacherName: user.name,
          status: "Approved",
        };
        console.log("Material data:", newMaterial);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("material_repository", JSON.stringify(newMaterial));
        const response = await postAsync(
          "material-repository/create",
          formData,
          user.idToken,
          true
        );
        if (!response.ok) {
          onTriggerSnackbar("Failed to add material", "error");
          console.error("Server error:", response.status, response.statusText);
          throw new Error("Server error");
        }
        const data = await response.json();
        console.log("Server response:", data);
        console.log("Form submitted successfully");
        onTriggerSnackbar("Student added successfully", "success");
        onAddFile(data);
        setOpen(false); // Close the modal on successful submission
      } catch (error) {
        console.error("Form submission error:", error);
        onTriggerSnackbar("Failed to add material", "error");
      } finally {
        // Reset the form fields
        setTitle("");
        setDescription("");
        setSelectedFile(null);
        setType([]);
        setInstrument([]);
        setGrade([]);
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
        <DialogTitle>{"Add New Material"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a teaching material, please enter the material's details.
          </DialogContentText>
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"} py={2}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Material Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleTitleChange} // Add onChange
              value={title} // Control the component
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Material Description"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleDescriptionChange} // Add onChange
              value={description} // Control the component
            />
            <FormControl required fullWidth variant="standard" margin="dense">
              <InputLabel id="instrument-label" sx={{ paddingLeft: 2 }}>
                Instrument
              </InputLabel>
              <Select
                labelId="instrument-label"
                multiple
                id="instrument"
                name="instrument"
                value={instrument}
                onChange={handleInstrumentChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                <MenuItem key="Piano" value="Piano">
                  <Checkbox checked={instrument.indexOf("Piano") > -1} />
                  <ListItemText primary="Piano" />
                </MenuItem>
                <MenuItem value="Guitar" key="Guitar">
                  <Checkbox checked={instrument.indexOf("Guitar") > -1} />
                  <ListItemText primary="Guitar" />
                </MenuItem>
                <MenuItem value="Ukulele" key="Ukulele">
                  <Checkbox checked={instrument.indexOf("Ukulele") > -1} />
                  <ListItemText primary="Ukulele" />
                </MenuItem>
                <MenuItem value="Violin" key="Violin">
                  <Checkbox checked={instrument.indexOf("Violin") > -1} />
                  <ListItemText primary="Violin" />
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl required fullWidth variant="standard" margin="dense">
              <InputLabel id="grade-label" sx={{ paddingLeft: 2 }}>
                Grade
              </InputLabel>
              <Select
                labelId="grade-label"
                id="grade"
                name="grade"
                value={grade}
                onChange={handleGradeChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                multiple
              >
                <MenuItem value="1" key="1">
                  <Checkbox checked={grade.indexOf("1") > -1} />
                  <ListItemText primary="1" />
                </MenuItem>
                <MenuItem value="2" key="2">
                  <Checkbox checked={grade.indexOf("2") > -1} />
                  <ListItemText primary="2" />
                </MenuItem>
                <MenuItem value="3" key="3">
                  <Checkbox checked={grade.indexOf("3") > -1} />
                  <ListItemText primary="3" />
                </MenuItem>
                <MenuItem value="4" key="4">
                  <Checkbox checked={grade.indexOf("4") > -1} />
                  <ListItemText primary="4" />
                </MenuItem>
                <MenuItem value="5" key="5">
                  <Checkbox checked={grade.indexOf("5") > -1} />
                  <ListItemText primary="5" />
                </MenuItem>
                <MenuItem value="6" key="6">
                  <Checkbox checked={grade.indexOf("6") > -1} />
                  <ListItemText primary="6" />
                </MenuItem>
                <MenuItem value="7" key="7">
                  <Checkbox checked={grade.indexOf("7") > -1} />
                  <ListItemText primary="7" />
                </MenuItem>
                <MenuItem value="8" key="8">
                  <Checkbox checked={grade.indexOf("8") > -1} />
                  <ListItemText primary="8" />
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl required fullWidth variant="standard" margin="dense">
              <InputLabel id="type-label" sx={{ paddingLeft: 2 }}>
                Type
              </InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={type}
                onChange={handleTypeChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                multiple
              >
                <MenuItem value="Sight Reading" key="Sight Reading">
                  <Checkbox checked={type.indexOf("Sight Reading") > -1} />
                  <ListItemText primary="Sight Reading" />
                </MenuItem>
                <MenuItem value="Theory" key="Theory">
                  <Checkbox checked={type.indexOf("Theory") > -1} />
                  <ListItemText primary="Theory" />
                </MenuItem>
                <MenuItem value="Music Sheet" key="Music Sheet">
                  <Checkbox checked={type.indexOf("Music Sheet") > -1} />
                  <ListItemText primary="Music Sheet" />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"} mt={1} alignItems={"center"}>
            {selectedFile && (
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Typography sx={{ flexGrow: 1, mr: 2, fontWeight: "bold" }}>Filename:</Typography>
                <Typography sx={{ flexGrow: 1, mr: 2 }}>{selectedFile.name}</Typography>
              </Box>
            )}
            <input
              accept="*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="success" component="span" sx={{ minHeight: 55 }}>
                Choose File
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={
              !title ||
              !description ||
              grade.length === 0 ||
              instrument.length === 0 ||
              type.length === 0 ||
              !selectedFile
            }
          >
            Create Material
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
