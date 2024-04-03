import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useCallback, useMemo, useState, useEffect, use } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  CardMedia,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Head from "next/head";
import RepoAdd from "src/sections/repository/repo-add";
import { RepoSearch } from "src/sections/repository/repo-search";
import { ArrowUpOnSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { alpha } from "@mui/material/styles";
import { RejectionModal } from "src/sections/repository/repo-modal";
import { ApprovalModal } from "src/sections/repository/repo-modal";
import { figmaColors } from "src/theme/colors";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilterDropdowns } from "src/sections/repository/repo-filter-dropdowns";
import { getAsync, putAsync, postAsync } from "src/utils/utils";
import { useAuth } from "src/hooks/use-auth";
import SnackbarAlert from "src/components/alert";

const ApproveMaterialsSection = ({ pendingMaterials, onApprove, onReject }) => {
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // States for pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 2; // You can adjust this number as needed
  const count = Math.ceil(pendingMaterials.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the current items to display
  const currentItems = pendingMaterials.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const openRejectionModal = (material) => {
    setCurrentMaterial(material);
    setRejectionModalOpen(true);
  };

  const openApprovalModal = (material) => {
    setCurrentMaterial(material);
    setApprovalModalOpen(true);
  };

  const handleReject = (reason) => {
    onReject(currentMaterial.id, reason);
    setRejectionModalOpen(false);
    setRejectionReason("");
  };

  const handleApprove = () => {
    onApprove(currentMaterial.id);
  };

  return (
    <>
      <Accordion defaultExpanded>
        {/* <Card sx={{ p: 2, display: "flex", width: "100%", flexDirection: "column" }}> */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ p: 2 }}
        >
          <Box display="flex" flexDirection="column" justifyContent="space-between">
            <Typography variant="h5">Pending Approvals</Typography>
            <Typography sx={{ fontSize: "14px", marginTop: 1, color: figmaColors.fontTertiary }}>
              You have {pendingMaterials.length} pending approvals
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {pendingMaterials.length === 0 ? (
            <Typography variant="body1">No pending materials to approve</Typography>
          ) : (
            <>
              <List>
                {currentItems.map((material) => (
                  <ListItem key={material.id} divider>
                    <ListItemText
                      primary={material.title}
                      secondary={`Instrument: ${material.instrument} - Grade: ${material.grade}`}
                    />
                    <Button
                      component="a"
                      href={material.fileLink}
                      startIcon={
                        <SvgIcon>
                          <ArrowUpOnSquareIcon />
                        </SvgIcon>
                      }
                    >
                      View Material
                    </Button>
                    <Button
                      onClick={() => openRejectionModal(material)}
                      sx={{
                        backgroundColor: figmaColors.accentRed,
                        color: figmaColors.bgWhite,
                        marginLeft: "10px",
                        "&:hover": {
                          backgroundColor: figmaColors.transparentRed, // lighter red on hover
                          color: "#000000", // black font color on hover
                        },
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => openApprovalModal(material)}
                      sx={{
                        backgroundColor: figmaColors.accentGreen,
                        color: figmaColors.bgWhite,
                        marginLeft: "10px",
                        "&:hover": {
                          backgroundColor: figmaColors.transparentGreen,
                          color: "#000000", // black font color on hover
                        },
                      }}
                    >
                      Approve
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Pagination
                count={count}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{ mt: 2, justifyContent: "center", display: "flex" }}
              />
            </>
          )}
        </AccordionDetails>
        <RejectionModal
          open={rejectionModalOpen}
          onClose={() => {
            setRejectionModalOpen(false);
            setRejectionReason("");
          }}
          onSubmit={handleReject}
          reason={rejectionReason}
          setReason={setRejectionReason}
        />
        <ApprovalModal
          open={approvalModalOpen}
          onClose={() => setApprovalModalOpen(false)}
          onConfirm={handleApprove}
        />
        {/* </Card> */}
      </Accordion>
    </>
  );
};

const Page = () => {
  const { user } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const onTriggerSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [materials, setMaterials] = useState([]);

  // When rendering approved materials:
  const approvedMaterials = materials.filter((material) => material.status === "Approved");

  // When rendering pending materials:
  const pendingMaterials = materials.filter((material) => material.status === "Pending");

  const [viewType, setViewType] = useState("icons"); // 'icons' or 'list'

  // SEARCH FUNCTION
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // FILTER FUNCTION
  const [filters, setFilters] = useState({
    type: "",
    instrument: "",
    grade: "",
  });

  // Unique values for types, instruments, and grades (you could derive these from your materials data)
  const types = ["Sight Reading", "Theory", "Music Sheet"];
  const instruments = ["Piano", "Guitar", "Ukulele", "Violin"];
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8"];

  // Update the state when filters are changed
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleRefreshFilters = () => {
    setFilters({
      type: "",
      instrument: "",
      grade: "",
    });
  };

  const handleApprove = async (materialId) => {
    // Implement the logic to approve the material
    try {
      const response = await putAsync(
        `material-repository/admin/${materialId}?status=Approved&reasonForStatus=Pass`,
        {},
        user.idToken
      );
      if (!response.ok) {
        onTriggerSnackbar("Error approving material", "error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Material approved successfully");
      onTriggerSnackbar("Material approved successfully", "success");
      // Fetch the materials again to update the UI
      fetchMaterials();
    } catch (error) {
      console.error("Error approving material:", error);
      onTriggerSnackbar("Error approving material", "error");
    }
  };

  const handleReject = async (materialId, reason) => {
    // Implement the logic to reject the material
    try {
      const response = await putAsync(
        `material-repository/admin/${materialId}?status=Rejected&reasonForStatus=${reason}`,
        {},
        user.idToken
      );
      if (!response.ok) {
        onTriggerSnackbar("Error rejecting material", "error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Material rejected successfully");
      onTriggerSnackbar("Material rejected successfully", "success");
      // Fetch the materials again to update the UI
      fetchMaterials();
    } catch (error) {
      console.error("Error rejecting material:", error);
      onTriggerSnackbar("Error rejecting material", "error");
    }
  };

  const filteredAndSearchedMaterials = approvedMaterials.filter((material) => {
    // Filter logic
    const filterMatch =
      (!filters.type || (material.type && material.type.includes(filters.type))) &&
      (!filters.instrument ||
        (material.instrument && material.instrument.includes(filters.instrument))) &&
      (!filters.grade || (material.grade && material.grade.includes(filters.grade)));

    // Search logic - checks if the search term is included in the material's title
    // You can extend this logic to search in other attributes as well
    const searchMatch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.instrument &&
        material.instrument.some((instrument) =>
          instrument.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
      (material.grade &&
        material.grade.some((grade) => grade.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (material.type &&
        material.type.some((type) => type.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      material.creationTime.toLowerCase().includes(searchTerm.toLowerCase());

    return filterMatch && searchMatch;
  });

  const fetchMaterials = async () => {
    try {
      const response = await getAsync("material-repository/admin", user.idToken);
      const data = await response.json();
      setMaterials(data);
      console.log("Materials fetched:", data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddFile = (data) => {
    console.log("File added:", data);
    if (data.status === "Pending") {
      setMaterials([...materials, data]);
    }
    if (data.status === "Approved") {
      setMaterials([...materials, data]);
    }
  };

  const MaterialCard = ({ material }) => (
    <Card sx={{ mt: 2, mb: 2, p: 2 }}>
      {material.type === "Image" ? (
        <CardMedia
          component="img"
          height="140" // Adjust the height accordingly
          image={material.fileLink}
          alt={`${material.title} preview`} // Provide a meaningful alt text
          sx={{ borderRadius: 1, mb: 2 }}
        />
      ) : (
        <Box
          height="140px"
          mb={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={1}
          backgroundColor={"#EEF0F7"}
        >
          <Typography variant="h4" align="center" sx={{ color: "#525F7F" }}>
            {material.type}
          </Typography>
        </Box>
      )}
      <Typography variant="h6">{material.title}</Typography>
      <Typography variant="subtitle2">Type: {material.type}</Typography>
      <Typography variant="subtitle2">Instrument: {material.instrument}</Typography>
      <Typography variant="subtitle2">Grade: {material.grade}</Typography>
      <Typography variant="subtitle2">Created: {material.creationTime}</Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          component="a"
          href={material.fileLink}
          startIcon={
            <SvgIcon>
              <ArrowUpOnSquareIcon />
            </SvgIcon>
          }
          fullWidth
          sx={{ backgroundColor: alpha("#6F66FF", 0.05), mt: 2 }}
        >
          View Material
        </Button>
      </Box>
    </Card>
  );
  // Component for icon view
  const MaterialsIconView = ({ materials }) => (
    <Grid container spacing={2}>
      {materials.map((material) => (
        <Grid item xs={12} sm={6} lg={3} key={material.id}>
          <MaterialCard key={material.id} material={material} />
        </Grid>
      ))}
    </Grid>
  );

  // Component for list view
  const MaterialsListView = ({ materials }) => (
    <List>
      {materials.map((material) => (
        <ListItem key={material.id} divider>
          <ListItemText
            primary={material.title}
            secondary={`Instrument: ${material.instrument} - Grade: ${material.grade}`}
          />
          <Button
            component="a"
            href={material.fileLink}
            startIcon={
              <SvgIcon>
                <ArrowUpOnSquareIcon />
              </SvgIcon>
            }
          >
            View Material
          </Button>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <Head>
        <title>Repository</title>
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
                <Typography variant="h4">Teaching Material Repository</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <RepoAdd onAddFile={handleAddFile} />
              </div>
            </Stack>
            <ApproveMaterialsSection
              onApprove={handleApprove}
              onReject={handleReject}
              pendingMaterials={pendingMaterials}
            />
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ p: 2 }}
              >
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                  <Typography variant="h5">Approved Materials</Typography>
                  <Typography
                    sx={{ fontSize: "14px", marginTop: 1, color: figmaColors.fontTertiary }}
                  >
                    You have {approvedMaterials.length} approved materials
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card sx={{ p: 2, display: "flex", width: "100%" }}>
                  <RepoSearch handleSearchChange={handleSearchChange} />
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <TrashIcon />
                      </SvgIcon>
                    }
                    //   onClick={handleExport}
                    style={{ marginLeft: "15px" }}
                  >
                    Delete
                  </Button>
                </Card>
                <Box>
                  <FilterDropdowns
                    filters={filters}
                    types={types}
                    instruments={instruments}
                    grades={grades}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleRefreshFilters}
                  />
                  <Box display={"flex"} justifyContent={"center"} mt={2}>
                    <ToggleButtonGroup
                      value={viewType}
                      exclusive
                      onChange={(e, view) => setViewType(view)}
                    >
                      <ToggleButton value="icons">Icons</ToggleButton>
                      <ToggleButton value="list">List</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  {viewType === "icons" ? (
                    <MaterialsIconView materials={filteredAndSearchedMaterials} />
                  ) : (
                    <MaterialsListView materials={filteredAndSearchedMaterials} />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Container>
        <SnackbarAlert
          open={snackbarOpen}
          severity={snackbarSeverity}
          message={snackbarMessage}
          handleClose={handleCloseSnackbar}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
