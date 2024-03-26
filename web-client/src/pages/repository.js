import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useCallback, useMemo, useState, useEffect } from "react";
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

const materialsMockData = [
  // Approved materials
  {
    materialId: "file-1",
    fileName: "Music Theory 101",
    createdTime: "2024-01-02T11:00:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/15a003c0-81c1-4f04-a414-81a6045c25c4_IMG_1539.png",
    status: "Approved",
    instrument: "Piano",
    grade: "3",
    type: "Image",
    teacherId: "teacher-111",
  },
  {
    materialId: "file-2",
    fileName: "Music Theory 102",
    createdTime: "2024-01-05T10:30:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/534f768f-6006-4e16-88e7-41f7489c4a44_ABRSM-Grade-8-Practice-Test.pdf",
    status: "Approved",
    instrument: "Guitar",
    grade: "6",
    type: "Document",
    teacherId: "teacher-111",
  },
  // Pending materials
  {
    materialId: "file-pending-1",
    fileName: "Music Theory 104",
    createdTime: "2024-02-15T09:30:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/10c65252-05de-4f47-b21c-72548283fddf_cakes-bakery.e956eab7.pdf",
    status: "Pending",
    instrument: "Ukulele",
    grade: "1",
    type: "Document",
    teacherId: "teacher-222",
  },
  {
    materialId: "file-pending-2",
    fileName: "Music Theory 105",
    createdTime: "2024-02-20T10:30:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/2dac5872-5e26-40e9-80cf-6100dc0aec91_baseline_assesment_report_cover.png",
    status: "Pending",
    instrument: "Violin",
    grade: "5",
    type: "Image",
    teacherId: "teacher-222",
  },
  {
    materialId: "file-pending-3",
    fileName: "Music Theory 106",
    createdTime: "2024-02-25T11:00:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/2dac5872-5e26-40e9-80cf-6100dc0aec91_baseline_assesment_report_cover.png",
    status: "Pending",
    instrument: "Piano",
    grade: "2",
    type: "Image",
    teacherId: "teacher-223",
  },
  {
    materialId: "file-pending-4",
    fileName: "Music Theory 107",
    createdTime: "2024-02-25T11:00:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/2dac5872-5e26-40e9-80cf-6100dc0aec91_baseline_assesment_report_cover.png",
    status: "Pending",
    instrument: "Ukulele",
    grade: "3",
    type: "Image",
    teacherId: "teacher-224",
  },
  {
    materialId: "file-pending-5",
    fileName: "Music Theory 108",
    createdTime: "2024-02-25T11:00:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/2dac5872-5e26-40e9-80cf-6100dc0aec91_baseline_assesment_report_cover.png",
    status: "Pending",
    instrument: "Ukulele",
    grade: "3",
    type: "Image",
    teacherId: "teacher-224",
  },
  {
    materialId: "file-pending-6",
    fileName: "Music Theory 109",
    createdTime: "2024-02-25T11:00:00Z",
    fileLink:
      "https://storage.googleapis.com/moosicfyp/assignments/2dac5872-5e26-40e9-80cf-6100dc0aec91_baseline_assesment_report_cover.png",
    status: "Pending",
    instrument: "Ukulele",
    grade: "3",
    type: "Image",
    teacherId: "teacher-224",
  },
  // ... add more materials as needed
];

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
    onReject(currentMaterial.materialId, reason);
  };

  const handleApprove = () => {
    onApprove(currentMaterial.materialId);
  };

  // const handleApprove = async (materialId) => {
  //   // Send an API request to approve the material
  //   // Replace with actual API call
  //   await fetch(`/api/materials/approve/${materialId}`, { method: "POST" });
  //   // Remove the material from `pendingMaterials` and call `onApprove`
  //   setPendingMaterials((current) => current.filter((m) => m.id !== materialId));
  //   onApprove();
  // };

  return (
    <Card sx={{ p: 2, display: "flex", width: "100%", flexDirection: "column" }}>
      <Stack spacing={2}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h5">Pending Approvals</Typography>
          <Typography sx={{ fontSize: "14px", marginTop: 1, color: figmaColors.fontTertiary }}>
            You have {pendingMaterials.length} pending approvals
          </Typography>
        </Box>

        <Stack spacing={2}>
          {pendingMaterials.length === 0 ? (
            <Typography variant="body1">No pending materials to approve</Typography>
          ) : (
            <>
              <List>
                {currentItems.map((material) => (
                  <ListItem key={material.materialId} divider>
                    <ListItemText
                      primary={material.fileName}
                      secondary={`Instrument: ${material.instrument} - Grade: ${material.grade}`}
                    />
                    <Button
                      component="a"
                      href={material.fileLink}
                      target="_blank"
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
        </Stack>
      </Stack>
      <RejectionModal
        open={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onSubmit={handleReject}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
      <ApprovalModal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onConfirm={handleApprove}
      />
    </Card>
  );
};

const Page = () => {
  const [materials, setMaterials] = useState(materialsMockData);

  // When rendering approved materials:
  const approvedMaterials = materials.filter((material) => material.status === "Approved");

  // When rendering pending materials:
  const pendingMaterials = materials.filter((material) => material.status === "Pending");

  const [viewType, setViewType] = useState("icons"); // 'icons' or 'list'
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchMaterials = async () => {
    // Replace with actual API call
    const response = await fetch("");
    const data = await response.json();
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddFile = (file) => {
    console.log("File added:", file);
  };

  const MaterialCard = ({ material }) => (
    <Card sx={{ mt: 2, mb: 2, p: 2 }}>
      {material.type === "Image" ? (
        <CardMedia
          component="img"
          height="140" // Adjust the height accordingly
          image={material.fileLink}
          alt={`${material.fileName} preview`} // Provide a meaningful alt text
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
      <Typography variant="h6">{material.fileName}</Typography>
      <Typography variant="subtitle2">Instrument: {material.instrument}</Typography>
      <Typography variant="subtitle2">Grade: {material.grade}</Typography>
      <Typography variant="subtitle2">Created: {material.createdTime}</Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          component="a"
          href={material.linkToGCP}
          target="_blank"
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
            primary={material.fileName}
            secondary={`Instrument: ${material.instrument} - Grade: ${material.grade}`}
          />
          <Button
            component="a"
            href={material.linkToGCP}
            target="_blank"
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
              onApprove={fetchMaterials}
              pendingMaterials={pendingMaterials}
            />
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
              <Box display={"flex"} justifyContent={"center"}>
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={(e, view) => setViewType(view)}
                >
                  <ToggleButton value="icons">Icons</ToggleButton>
                  <ToggleButton value="list">List</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box></Box>
              {viewType === "icons" ? (
                <MaterialsIconView materials={approvedMaterials} />
              ) : (
                <MaterialsListView materials={approvedMaterials} />
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
