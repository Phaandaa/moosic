import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/students/customers-table";
import { CustomersSearch } from "src/sections/students/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import CustomersModal from "src/sections/students/customers-modal";
import { getAsync } from "src/utils/utils";

const now = new Date();

// const { userData } = useAuth();

const Page = () => {
  const [teacherData, setTeacherData] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAsync(`users`);
        const data = await response.json();
        setTeacherData(data.filter((user) => user.role === "Teacher"));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  console.log("teacherData", teacherData);

  const useTeachers = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(teacherData, page, rowsPerPage);
    }, [teacherData, page, rowsPerPage]);
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

  const handleAdd = useCallback(() => {
    alert("Add");
  }, []);


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
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <CustomersModal />
              </div>
            </Stack>
            <CustomersSearch />
            <CustomersTable
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
