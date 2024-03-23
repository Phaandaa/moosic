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
import { getAsync } from "src/utils/utils";
import * as XLSX from "xlsx";
import { Card } from "@mui/material";
import { convertArrayToCSV } from "src/utils/utils";

const Page = () => {
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAsync(`students`);
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
              student.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
    setStudentData((prevStudents) => [newStudent,...prevStudents]);
  };

  const handleEditStudent = (updatedStudent) => {
    setStudentData((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleExport = () => {
    const csvData = convertArrayToCSV(studentData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students-data.csv');
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
                <StudentsModal onAddStudent={handleAddStudent}/>
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
              <Button
                color="inherit"
                startIcon={
                  <SvgIcon fontSize="small">
                    <TrashIcon />
                  </SvgIcon>
                }
                onClick={handleExport}
                style={{ marginLeft: "15px" }}
              >
                Delete
              </Button>
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
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
