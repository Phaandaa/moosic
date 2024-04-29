import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StudentsTable } from "src/sections/students/students-table";
import { StudentsSearch } from "src/sections/students/students-search";
import { applyPagination } from "src/utils/apply-pagination";
import StudentsModal from "src/sections/students/students-modal";
import { getAsync, deleteAsync } from "src/utils/utils";
import { Card } from "@mui/material";
import { convertArrayToCSV } from "src/utils/utils";
import { useAuth } from "src/hooks/use-auth";
import AccConfirmDeletionModal from "src/sections/students/students-confirm-delete";
import SnackbarAlert from "src/components/alert";
import { alpha } from '@mui/material/styles';

const Page = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // confirm deletion modal states
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [studentsToDelete, setStudentsToDelete] = useState([]);

  // snackbar alert states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDeleteConfirmationOpen = () => {
    setStudentsToDelete(studentsSelection.selected);
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
    console.log("Deleting students:", accounts);
    // Promise.all will execute all delete requests in parallel
    const deletePromises = accounts.map((studentId) =>
      deleteAsync(`students/${studentId}/delete`, user.idToken)
    );

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);
      
      // Filter out the deleted students from the state.
      setStudentData((currentStudentData) =>
        currentStudentData.filter((student) => !accounts.includes(student.id))
      );

      // Clear the selection state and close the modal
      studentsSelection.handleDeselectAll();
      // Show a success message
      // Assuming you have a method to show toast notifications
      onTriggerSnackbar("Students deleted successfully.", "success");
    } catch (error) {
      // If any request fails, you may decide to stop the deletion process
      // and show an error message
      // Or handle the individual failures accordingly
      console.error("Error deleting students:", error);
      onTriggerSnackbar("Failed to delete students.", "error");
    } finally {
      // Close the modal
      setConfirmModalOpen(false);
      setStudentsToDelete([]);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAsync(`students`, user.idToken);
        const data = await response.json();
        setStudentData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudentData([]);
      }
    };

    fetchStudents();
  }, []);

  console.log("studentData", studentData);

  const useStudents = (page, rowsPerPage) => {
    return useMemo(() => {
      const filteredData = searchTerm
        ? studentData.filter(
            (student) =>
              student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.tuitionDay?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.instrument?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : studentData;

      return applyPagination(filteredData, page, rowsPerPage);
    }, [studentData, page, rowsPerPage, searchTerm]);
  };

  const useStudentIds = (students) => {
    return useMemo(() => {
      return students.map((student) => student.id);
    }, [students]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const students = useStudents(page, rowsPerPage);
  const studentsIds = useStudentIds(students);
  const studentsSelection = useSelection(studentsIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = (newStudent) => {
    setStudentData((prevStudents) => [newStudent, ...prevStudents]);
  };

  const handleEditStudent = (updatedStudent) => {
    setStudentData((prevStudents) =>
      prevStudents.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
    );
  };

  const handleExport = () => {
    const csvData = convertArrayToCSV(studentData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Students</title>
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
                <Typography variant="h4">Students</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <StudentsModal onAddStudent={handleAddStudent} />
              </div>
            </Stack>

            <Card sx={{ p: 2, display: "flex", width: "100%" }}>
              <StudentsSearch handleSearchChange={handleSearchChange} />
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
              {studentsSelection.selected.length !== 0 && (
                <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <TrashIcon />
                  </SvgIcon>
                }
                onClick={handleDeleteConfirmationOpen}
                style={{ marginLeft: "15px" }}
                disabled={studentsSelection.selected.length === 0}
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

            <StudentsTable
              count={studentData.length}
              items={students}
              onDeselectAll={studentsSelection.handleDeselectAll}
              onDeselectOne={studentsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={studentsSelection.handleSelectAll}
              onSelectOne={studentsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={studentsSelection.selected}
              onEditStudent={handleEditStudent}
            />
          </Stack>
        </Container>
      </Box>
      <AccConfirmDeletionModal
        open={isConfirmModalOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleDeleteConfirmed}
        accounts={studentsToDelete}
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
