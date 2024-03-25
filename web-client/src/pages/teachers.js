import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TeachersTable } from "src/sections/teachers/teachers-table";
import { TeachersSearch } from "src/sections/teachers/teachers-search";
import { applyPagination } from "src/utils/apply-pagination";
import TeachersModal from "src/sections/teachers/teachers-modal";
import { getAsync } from "src/utils/utils";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { convertArrayToCSV } from "src/utils/utils";
import AccConfirmDeletionModal from "src/sections/teachers/teacher-confirm-delete";
import { deleteAsync } from "src/utils/utils";
import SnackbarAlert from "src/components/alert";
import { alpha } from '@mui/material/styles';

const Page = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // confirm deletion modal states
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [teachersToDelete, setTeachersToDelete] = useState([]);

  // snackbar alert states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDeleteConfirmationOpen = () => {
    setTeachersToDelete(teachersSelection.selected);
    setConfirmModalOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setConfirmModalOpen(false);
  };

  const onTriggerSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteConfirmed = async (accounts) => {
    console.log("Deleting teachers:", accounts);
    // Promise.all will execute all delete requests in parallel
    const deletePromises = accounts.map((teacherId) =>
      deleteAsync(`teachers/${teacherId}`)
    );

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);
      
      // Filter out the deleted teachers from the state.
      setTeacherData((currentTeacherData) =>
        currentTeacherData.filter((teacher) => !accounts.includes(teacher.id))
      );

      // Clear the selection state and close the modal
      teachersSelection.handleDeselectAll();
      // Show a success message
      // Assuming you have a method to show toast notifications
      onTriggerSnackbar("Teachers deleted successfully.", "success");
    } catch (error) {
      // If any request fails, you may decide to stop the deletion process
      // and show an error message
      // Or handle the individual failures accordingly
      console.error("Error deleting teachers:", error);
      onTriggerSnackbar("Failed to delete teachers.", "error");
    } finally {
      // Close the modal
      setConfirmModalOpen(false);
      setTeachersToDelete([]);
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAsync(`teachers`);
        const data = await response.json();
        setTeacherData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeacherData([]);
      }
    };

    fetchTeachers();
  }, []);

  console.log("teacherData", teacherData);

  const useTeachers = (page, rowsPerPage) => {
    return useMemo(() => {
      const filteredData = searchTerm
        ? teacherData.filter(
            (teacher) =>
              teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : teacherData;

      return applyPagination(filteredData, page, rowsPerPage);
    }, [teacherData, page, rowsPerPage, searchTerm]);
  };

  const useTeacherIds = (teachers) => {
    return useMemo(() => {
      return teachers.map((teacher) => teacher.id);
    }, [teachers]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const teachers = useTeachers(page, rowsPerPage);
  const teachersIds = useTeacherIds(teachers);
  const teachersSelection = useSelection(teachersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTeacher = (newTeacher) => {
    setTeacherData((prevTeachers) => [newTeacher, ...prevTeachers]);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeacherData((prevTeachers) =>
      prevTeachers.map((teacher) => (teacher.id === updatedTeacher.id ? updatedTeacher : teacher))
    );
  };

  const handleExport = () => {
    const csvData = convertArrayToCSV(teacherData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "teachers-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Teachers</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Teachers</Typography>
              </Stack>
              <div>
                <TeachersModal onAddTeacher={handleAddTeacher} />
              </div>
            </Stack>
            <Card sx={{ p: 2, display: "flex", width: "100%" }}>
              <TeachersSearch handleSearchChange={handleSearchChange} />
              <Button
                color="inherit"
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowUpOnSquareIcon />
                  </SvgIcon>
                }
                onClick={handleExport}
                style={{ marginLeft: "15px" }}
              >
                Export
              </Button>
              {teachersSelection.selected.length !== 0 && (
                <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <TrashIcon />
                  </SvgIcon>
                }
                onClick={handleDeleteConfirmationOpen}
                style={{ marginLeft: "15px" }}
                disabled={teachersSelection.selected.length === 0}
                sx={{
                  backgroundColor: "#EE4242",
                  color: "#ffffff",
                  '&:hover': {
                    backgroundColor: alpha("#EE4242",0.2), // lighter red on hover
                    color: "#000000", // black font color on hover
                  },
                  marginLeft: "15px"
                }}
              >
                Delete
              </Button>
              )}
              
            </Card>

            <TeachersTable
              count={teacherData.length}
              items={teachers}
              onDeselectAll={teachersSelection.handleDeselectAll}
              onDeselectOne={teachersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={teachersSelection.handleSelectAll}
              onSelectOne={teachersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={teachersSelection.selected}
              onEditTeacher={handleEditTeacher}
            />
          </Stack>
        </Container>
      </Box>
      <AccConfirmDeletionModal
        open={isConfirmModalOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleDeleteConfirmed}
        accounts={teachersToDelete}
      />
      <SnackbarAlert
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        handleClose={handleCloseSnackbar}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
