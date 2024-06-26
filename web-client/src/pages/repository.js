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
  Checkbox,
} from "@mui/material";
import Head from "next/head";
import RepoAdd from "src/sections/repository/repo-add";
import { RepoSearch } from "src/sections/repository/repo-search";
import { ArrowUpOnSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { alpha } from "@mui/material/styles";
import { RejectionModal } from "src/sections/repository/repo-modal";
import { ApprovalModal } from "src/sections/repository/repo-modal";
import { figmaColors } from "src/theme/colors";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilterDropdowns } from "src/sections/repository/repo-filter-dropdowns";
import { getAsync, putAsync, deleteAsync } from "src/utils/utils";
import { useAuth } from "src/hooks/use-auth";
import SnackbarAlert from "src/components/alert";
import { format } from "date-fns";
import { DeleteMaterialConfirmModal } from "src/sections/repository/repo-delete-confirm";
import { DeleteRejectedModal } from "src/sections/repository/repo-delete-rejected";
import { ViewRejectionReasonModal } from "src/sections/repository/repo-view-rejection-reason.js";

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
                      primary={material.title ? material.title : "Untitled"}
                      secondary={`Instrument: ${
                        material.instrument.length !== 0 ? material.instrument.join(", ") : "N/A"
                      } - Grade: ${
                        material.grade.length !== 0 ? material.grade.join(", ") : "N/A"
                      }`}
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

  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const [rejectionReasonModalOpen, setRejectionReasonModalOpen] = useState(false);
  const [currentRejectionReason, setCurrentRejectionReason] = useState("");

  const toggleSelection = (materialId) => {
    setSelectedMaterials((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(materialId)) {
        newSelected.delete(materialId);
      } else {
        newSelected.add(materialId);
      }
      return newSelected;
    });
  };

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

  // When rendering rejected materials:
  const [showRejectedMaterials, setShowRejectedMaterials] = useState(false);
  const rejectedMaterials = materials.filter((material) => material.status === "Rejected");
  const [deleteRejectedOpen, setDeleteRejectedOpen] = useState(false);

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

  const handleDeleteSelected = async () => {
    console.log("Deleting materials:", selectedMaterials);
    // Convert Set to Array and execute all delete requests in parallel
    const deletePromises = Array.from(selectedMaterials).map((materialId) =>
      deleteAsync(`material-repository/${materialId}`, user.idToken)
    );

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);

      // Update the state to reflect the deleted materials
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => !selectedMaterials.has(material.id))
      );
      // Clear the selected materials after deletion
      setSelectedMaterials(new Set());

      // Close the modal and show a success message
      setDeleteConfirmationOpen(false);
      onTriggerSnackbar("Materials deleted successfully.", "success");
    } catch (error) {
      // Log and show an error if the deletion fails
      console.error("Error deleting materials:", error);
      onTriggerSnackbar("Failed to delete materials.", "error");
    } finally {
      // Always fetch the materials again to update the UI
      setDeleteConfirmationOpen(false);
      setSelectedMaterials(new Set());
      fetchMaterials();
    }
  };

  const handleDeleteRejected = async () => {
    console.log("Deleting rejected materials:", rejectedMaterials);
    // Convert Set to Array and execute all delete requests in parallel
    const deletePromises = rejectedMaterials.map((material) =>
      deleteAsync(`material-repository/${material.id}`, user.idToken)
    );

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);

      // Update the state to reflect the deleted materials
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.status !== "Rejected")
      );

      // Close the modal and show a success message
      setDeleteRejectedOpen(false);
      onTriggerSnackbar("Rejected materials deleted successfully.", "success");
    } catch (error) {
      // Log and show an error if the deletion fails
      console.error("Error deleting rejected materials:", error);
      onTriggerSnackbar("Failed to delete rejected materials.", "error");
    } finally {
      // Always fetch the materials again to update the UI
      setDeleteRejectedOpen(false);
      fetchMaterials();
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
      setMaterials([data, ...materials]);
    }
    if (data.status === "Approved") {
      setMaterials([data, ...materials]);
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
            {material.title}
          </Typography>
        </Box>
      )}
      <Typography variant="subtitle2">Uploaded by: {material.teacherName}</Typography>
      <Typography variant="subtitle2">Type: {material.type.join(", ")}</Typography>
      <Typography variant="subtitle2">Instrument: {material.instrument.join(", ")}</Typography>
      <Typography variant="subtitle2">Grade: {material.grade.join(", ")}</Typography>
      <Typography variant="subtitle2">
        Created: {format(new Date(material.creationTime), "dd/MM/yyyy HH:mm:ss")}
      </Typography>
      <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
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
        <Button
          fullWidth
          sx={{
            border: 1,
            borderColor: selectedMaterials.has(material.id)
              ? figmaColors.accentGreen
              : figmaColors.fontQuaternary,
            backgroundColor: selectedMaterials.has(material.id)
              ? figmaColors.accentGreen
              : "transparent",
            color: selectedMaterials.has(material.id) ? "white" : "black",
            mt: 2,
            "&:hover": {
              backgroundColor: selectedMaterials.has(material.id)
                ? figmaColors.accentGreen
                : "transparent", // Keeps the background color the same on hover
              color: selectedMaterials.has(material.id) ? "white" : "black", // Keeps the text color the same on hover
              borderColor: selectedMaterials.has(material.id)
                ? figmaColors.accentGreen
                : figmaColors.fontQuaternary, // Keeps the border color the same on hover
            },
          }}
          onClick={() => toggleSelection(material.id)}
        >
          Select
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
          <Checkbox
            checked={selectedMaterials.has(material.id)}
            onChange={() => toggleSelection(material.id)}
            color="primary"
            sx={{ marginRight: "10px" }}
          />
          <ListItemText
            primary={material.title}
            secondary={`Instrument: ${material.instrument.join(
              ", "
            )} - Grade: ${material.grade.join(", ")}`}
          />
          <Typography variant="body2" sx={{ marginRight: 2, alignSelf: "center" }}>
            Uploaded by: {material.teacherName}
          </Typography>
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
                  {selectedMaterials.size > 0 && (
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      }
                      onClick={() => setDeleteConfirmationOpen(true)}
                      sx={{
                        backgroundColor: "#EE4242",
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: alpha("#EE4242", 0.2), // lighter red on hover
                          color: "#000000", // black font color on hover
                        },
                        marginLeft: "15px",
                      }}
                    >
                      Delete
                    </Button>
                  )}
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
            <Button
              onClick={() => setShowRejectedMaterials((prev) => !prev)}
              sx={{
                mb: 2,
                alignSelf: "flex-start",
                color: showRejectedMaterials ? figmaColors.accentRed : figmaColors.mainPurple,
              }}
            >
              {showRejectedMaterials ? "Hide Rejected Materials" : "Show Rejected Materials"}
            </Button>

            {showRejectedMaterials && (
              <Accordion expanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    p: 2,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="h5">Rejected Materials</Typography>
                    <Typography sx={{ fontSize: "14px", color: figmaColors.fontTertiary, mt: 1 }}>
                      You have {rejectedMaterials.length} rejected materials
                    </Typography>
                  </Box>
                  {rejectedMaterials.length !== 0 && (
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      }
                      onClick={() => setDeleteRejectedOpen(true)}
                      sx={{
                        backgroundColor: "#EE4242",
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: alpha("#EE4242", 0.2), // lighter red on hover
                          color: "#000000", // black font color on hover
                        },
                        marginLeft: "auto",
                        marginRight: "20px",
                      }}
                    >
                      Delete All
                    </Button>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {rejectedMaterials.map((material) => (
                      <ListItem key={material.id} divider>
                        <ListItemText
                          primary={material.title}
                          secondary={`Instrument: ${
                            material.instrument.length !== 0
                              ? material.instrument.join(", ")
                              : "NIL"
                          } - Grade: ${
                            material.grade.length !== 0 ? material.grade.join(", ") : "NIL"
                          }`}
                        />
                        <Typography variant="body2" sx={{ marginRight: 2, alignSelf: "center" }}>
                          Uploaded by: {material.teacherName}
                        </Typography>
                        <Button
                          onClick={() => {
                            setCurrentRejectionReason(material.reasonForStatus);
                            setRejectionReasonModalOpen(true);
                          }}
                          startIcon={
                            <SvgIcon>
                              <EyeIcon />
                            </SvgIcon>
                          }
                        >
                          View Rejection Reason
                        </Button>

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
                </AccordionDetails>
              </Accordion>
            )}
          </Stack>
        </Container>
        <DeleteMaterialConfirmModal
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={() => {
            handleDeleteSelected(selectedMaterials);
            setDeleteConfirmationOpen(false); // Close modal after confirmation
          }}
          title="Confirm Deletion"
        >
          Are you sure you want to delete the selected {selectedMaterials.size} item(s)?
        </DeleteMaterialConfirmModal>
        <DeleteRejectedModal
          open={deleteRejectedOpen}
          onClose={() => setDeleteRejectedOpen(false)}
          onConfirm={() => {
            handleDeleteRejected();
            setDeleteRejectedOpen(false); // Close modal after confirmation
          }}
          title="Confirm Deletion"
        >
          Are you sure you want to delete all rejected materials?
        </DeleteRejectedModal>
        <ViewRejectionReasonModal
          open={rejectionReasonModalOpen}
          onClose={() => setRejectionReasonModalOpen(false)}
          title="Rejection Reason"
        >
          {currentRejectionReason}
        </ViewRejectionReasonModal>

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
