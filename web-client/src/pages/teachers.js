import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";;
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TeachersTable } from "src/sections/teachers/teachers-table";
import { TeachersSearch } from "src/sections/teachers/teachers-search";
import { applyPagination } from "src/utils/apply-pagination";
import TeachersModal from "src/sections/teachers/teachers-modal";
import { getAsync } from "src/utils/utils";
import * as XLSX from "xlsx";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

const Page = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAsync(`teachers`);
        const data = await response.json();
        setTeacherData(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  console.log("teacherData", teacherData);

  const useTeachers = (page, rowsPerPage) => {
    return useMemo(() => {
      const filteredData = searchTerm
        ? teacherData.filter((teacher) => 
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
    setTeacherData((prevTeachers) => [...prevTeachers, newTeacher]);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeacherData((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      )
    );
  };

  const handleExport = useCallback(() => {
    // Define a workbook and a worksheet
    const wb = XLSX.utils.book_new();
    const wsName = "TeachersData";

    // Convert your student data into a format suitable for a worksheet
    const wsData = [
      ["Name", "Email"], // Header row
      ...teacherData.map((teacher) => [
        teacher.name,
        teacher.email,
      ]),
    ];

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, wsName);

    // Generate XLSX file and trigger download
    XLSX.writeFile(wb, "TeachersData.xlsx");
  }, [teacherData]);


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
                <TeachersModal onAddTeacher={handleAddTeacher}/>
              </div>
            </Stack>
            <Card sx={{ p: 2, display: "flex", width: "100%" }}>
              <TeachersSearch handleSearchChange={handleSearchChange}/>
              <Button
                  color="inherit"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowDownOnSquareIcon />
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
                // onClick={handleDelete}
                style={{ marginLeft: "15px" }}
              >
                Delete
              </Button>
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
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
