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

  const countAccountsByCategory = (accounts, fieldName, category) => {
    return accounts.filter((account) => account[fieldName] === category).length;
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAsync(`students`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await getAsync(`teachers`);
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await getAsync(`reward-shop`);
        const data = await response.json();
        setItems(data);
        console.log("Items:", data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchItems();
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
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid>
            {/* <Grid xs={12} lg={4}>
              <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
            </Grid> */}
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
                orders={[
                  {
                    id: "f69f88012978187a6c12897f",
                    ref: "DEV1049",
                    amount: 30.5,
                    customer: {
                      name: "Ekaterina Tankova",
                    },
                    createdAt: 1555016400000,
                    status: "pending",
                  },
                  {
                    id: "9eaa1c7dd4433f413c308ce2",
                    ref: "DEV1048",
                    amount: 25.1,
                    customer: {
                      name: "Cao Yu",
                    },
                    createdAt: 1555016400000,
                    status: "delivered",
                  },
                  {
                    id: "01a5230c811bd04996ce7c13",
                    ref: "DEV1047",
                    amount: 10.99,
                    customer: {
                      name: "Alexa Richardson",
                    },
                    createdAt: 1554930000000,
                    status: "refunded",
                  },
                  {
                    id: "1f4e1bd0a87cea23cdb83d18",
                    ref: "DEV1046",
                    amount: 96.43,
                    customer: {
                      name: "Anje Keizer",
                    },
                    createdAt: 1554757200000,
                    status: "pending",
                  },
                  {
                    id: "9f974f239d29ede969367103",
                    ref: "DEV1045",
                    amount: 32.54,
                    customer: {
                      name: "Clarke Gillebert",
                    },
                    createdAt: 1554670800000,
                    status: "delivered",
                  },
                  {
                    id: "ffc83c1560ec2f66a1c05596",
                    ref: "DEV1044",
                    amount: 16.76,
                    customer: {
                      name: "Adam Denisov",
                    },
                    createdAt: 1554670800000,
                    status: "delivered",
                  },
                ]}
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
