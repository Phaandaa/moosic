import Head from "next/head";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ShopCard } from "src/sections/shop/shop-card";
import { ShopSearch } from "src/sections/shop/shop-search";
import { useEffect, useState } from "react";
import { getAsync } from "src/utils/utils";
import SnackbarAlert from "src/components/alert";
import AddItem from "src/sections/shop/shop-add";
import { convertArrayToCSV } from "src/utils/utils";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust this value as needed
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAsync("reward-shop", user.idToken);
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on the search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = items.filter((item) =>
      // item.type.toLowerCase().includes(lowercasedQuery) ||
      item?.description?.toLowerCase().includes(lowercasedQuery) ||
      item?.type?.toLowerCase().includes(lowercasedQuery) ||
      item?.subtype?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchQuery, items]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const onTriggerSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteItem = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    setFilteredItems((currentFilteredItems) =>
      currentFilteredItems.filter((item) => item.id !== itemId)
    );
  };

  const handleEditItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleAddItem = (newItem) => {
    setItems((currentItems) => [newItem, ...currentItems]);
    //  to immediately see this in the filtered list (in case there's an active search filter)
    setFilteredItems((currentFilteredItems) => [newItem, ...currentFilteredItems]);
  };

  const handleExport = () => {
    const csvData = convertArrayToCSV(items);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reward-shop-items.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Shop</title>
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
                <Typography variant="h4">Shop</Typography>
              </Stack>
              <div>
                <AddItem onAddItem={handleAddItem} />
              </div>
            </Stack>

            <Card sx={{ p: 2, display: "flex", width: "100%" }}>
              <ShopSearch handleSearchChange={handleSearchChange} />
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
              {/* <Button                              // not sure about this import feature, dk if should implement now or not
                color="inherit"
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowDownOnSquareIcon />
                  </SvgIcon>
                }
                // onClick={handleExport}
                style={{ marginLeft: "15px" }}
              >
                Import
              </Button> */}
            </Card>
            <Grid container spacing={3}>
              {currentItems.map((item) => (
                <Grid xs={12} md={6} lg={4} key={item.id}>
                  <ShopCard
                    item={item}
                    onDeleteItem={handleDeleteItem}
                    triggerSnackbar={onTriggerSnackbar}
                    onEditItem={handleEditItem}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="small"
              />
            </Box>
          </Stack>
        </Container>
      </Box>
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
