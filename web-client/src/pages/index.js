import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useAuth } from "src/hooks/use-auth";
import { useEffect, useState } from "react";
import { getAsync } from "src/utils/utils";

const now = new Date();

const Page = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [items, setItems] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvals, setApprovals] = useState([]);

  const countAccountsByCategory = (accounts, fieldName, category) => {
    return accounts.filter((account) => account[fieldName] === category).length;
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAsync(`students`, user.idToken);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await getAsync(`teachers`, user.idToken);
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await getAsync(`reward-shop`, user.idToken);
        const data = await response.json();
        setItems(data);
        console.log("Items:", data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchApprovals = async () => {
      try {
        const response = await getAsync(`material-repository/admin`, user.idToken);
        const data = await response.json();
        console.log("Pending Approvals:", data);
        setPendingApprovals(data.filter((item) => item.status === "Pending"));
        setApprovals(data.slice(-5));
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchItems();
    fetchApprovals();
  }, []);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box>
            <h1>Welcome, {user?.name?.split(" ")[0]}!</h1>
          </Box>
          <Grid container spacing={3}>
            {/* <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value="$24k"
            />
          </Grid> */}
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                // difference={16}
                // positive={false}
                sx={{ height: "100%" }}
                value={students?.length ? students.length : 0}
                title="Students"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                // difference={16}
                // positive={false}
                sx={{ height: "100%" }}
                value={teachers?.length ? teachers.length : 0}
                title="Teachers"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                // difference={16}
                // positive={false}
                sx={{ height: "100%" }}
                value={items?.length ? items.length : 0}
                title="Reward Items"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                // difference={16}
                // positive={false}
                sx={{ height: "100%" }}
                value={pendingApprovals?.length ? pendingApprovals.length : 0}
                title="Pending Approvals"
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                title="Students by Instrument"
                chartSeries={[
                  countAccountsByCategory(students, "instrument", "Piano"),
                  countAccountsByCategory(students, "instrument", "Guitar"),
                  countAccountsByCategory(students, "instrument", "Ukulele"),
                  countAccountsByCategory(students, "instrument", "Violin"),
                ]}
                labels={["Piano", "Guitar", "Ukulele", "Violin"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                title="Teachers by Instrument"
                chartSeries={[
                  countAccountsByCategory(teachers, "instrument", "Piano"),
                  countAccountsByCategory(teachers, "instrument", "Guitar"),
                  countAccountsByCategory(teachers, "instrument", "Ukulele"),
                  countAccountsByCategory(teachers, "instrument", "Violin"),
                ]}
                labels={["Piano", "Guitar", "Ukulele", "Violin"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                title="Items by Type"
                chartSeries={[
                  countAccountsByCategory(items, "type", "DIGITAL"),
                  countAccountsByCategory(items, "type", "PHYSICAL"),
                ]}
                labels={["Digital", "Physical"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts
                products={items}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders
                orders={approvals}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
