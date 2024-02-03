import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StudentsTable } from "src/sections/students/students-table";
import { StudentsSearch } from "src/sections/students/students-search";
import { applyPagination } from "src/utils/apply-pagination";
import StudentsModal from "src/sections/students/students-modal";
import { getAsync } from "src/utils/utils";
import * as XLSX from 'xlsx';

const now = new Date();

// const { userData } = useAuth();
// const [students, setStudents] = useState([]);

const Page = () => {
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAsync(`students`);
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
  
    fetchStudents();
  }, []);

  console.log("studentData", studentData);

  const useStudents = (page, rowsPerPage) => {
    return useMemo(() => {
      const filteredData = searchTerm
        ? studentData.filter((student) => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAdd = useCallback(() => {
    alert("Add");
  }, []);

  const handleExport = useCallback(() => {
    // Define a workbook and a worksheet
    const wb = XLSX.utils.book_new();
    const wsName = 'StudentsData';
    
    // Convert your student data into a format suitable for a worksheet
    const wsData = [
      ['Name', 'Email', 'Instrument', 'Grade', 'Points'], // Header row
      ...studentData.map(student => [
        student.name,
        student.email,
        student.instrument,
        student.grade,
        student.pointsCounter,
      ]),
    ];
  
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, wsName);
  
    // Generate XLSX file and trigger download
    XLSX.writeFile(wb, 'StudentsData.xlsx');
  }, [studentData]);


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
                <Stack alignItems="center" direction="row" spacing={1}>
                  {/* <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button> */}
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <StudentsModal />
              </div>
            </Stack>
            <StudentsSearch handleSearchChange={handleSearchChange} />
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
