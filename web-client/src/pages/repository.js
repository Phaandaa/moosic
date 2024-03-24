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
import { alpha } from '@mui/material/styles';

const mockData = [
  {
    id: "file-1",
    fileName: "Music Theory 101",
    createdTime: "2024-01-02T11:00:00Z",
    linkToGCP:
      "https://storage.googleapis.com/moosicfyp/assignments/15a003c0-81c1-4f04-a414-81a6045c25c4_IMG_1539.png",
    instrument: "Piano",
    grade: "Beginner",
    type: "Image",
    teacherId: "teacher-111",
  },
  {
    id: "file-2",
    fileName: "Music Theory 102",
    createdTime: "2024-01-02T11:00:00Z",
    linkToGCP:
      "https://storage.googleapis.com/moosicfyp/assignments/534f768f-6006-4e16-88e7-41f7489c4a44_ABRSM-Grade-8-Practice-Test.pdf",
    instrument: "Guitar",
    grade: "Intermediate",
    type: "Document",
    teacherId: "teacher-122",
  },
  {
    id: "file-3",
    fileName: "Music Theory 103",
    createdTime: "2024-01-02T11:00:00Z",
    linkToGCP:
      "https://storage.googleapis.com/moosicfyp/assignments/10c65252-05de-4f47-b21c-72548283fddf_cakes-bakery.e956eab7.pdf",
    instrument: "Violin",
    grade: "Advanced",
    type: "Document",
    teacherId: "teacher-123",
  },
];

const ApproveMaterialsSection = ({ onApprove }) => {
  const [pendingMaterials, setPendingMaterials] = useState([]);

  useEffect(() => {
    // Fetch pending materials similar to step 1
  }, []);

  const handleApprove = async (materialId) => {
    // Send an API request to approve the material
    // Replace with actual API call
    await fetch(`/api/materials/approve/${materialId}`, { method: "POST" });
    // Remove the material from `pendingMaterials` and call `onApprove`
    setPendingMaterials((current) => current.filter((m) => m.id !== materialId));
    onApprove();
  };

  return (
    <Card sx={{ p: 2, display: "flex", width: "100%", flexDirection: "column" }}>
      <Stack spacing={2}>
        <Typography variant="h5">Pending Approvals</Typography>
        <Stack spacing={2}>
          {pendingMaterials.length === 0 ? (
            <Typography variant="body1">No pending materials to approve</Typography>
          ) : (
            pendingMaterials.map((material) => (
              <Card key={material.id} sx={{ p: 2, display: "flex", width: "100%" }}>
                <Typography>{material.title}</Typography>
                <Button
                  onClick={() => handleApprove(material.id)}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowUpOnSquareIcon />
                    </SvgIcon>
                  }
                >
                  Approve
                </Button>
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

const Page = () => {
  const [materials, setMaterials] = useState([]);
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
          image={material.linkToGCP}
          alt={`${material.fileName} preview`} // Provide a meaningful alt text
          sx={{ borderRadius: 1, mb: 2 }}
        />
      ) : (
        <Box height="140px" mb={2} display={"flex"} alignItems={"center"} justifyContent={"center"} borderRadius={1} backgroundColor={"#EEF0F7"}>
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
        sx={{backgroundColor: alpha("#6F66FF", 0.05), mt:2}}
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
            <ApproveMaterialsSection onApprove={fetchMaterials} />
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
                <MaterialsIconView materials={mockData} />
              ) : (
                <MaterialsListView materials={mockData} />
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
