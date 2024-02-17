import PropTypes from "prop-types";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import InboxStackIcon from "@heroicons/react/24/solid/InboxStackIcon";
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { ItemDetailModal } from "./shop-modal"; // Adjust the import path as needed
import { useState } from "react";

export const ShopCard = (props) => {
  const { item, onDeleteItem, triggerSnackbar } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
        }}
        onClick={handleOpenModal}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 3,
            }}
          >
            <Avatar src={item?.imageLink ? item.imageLink : ""} variant="square" />
          </Box>
          <Typography align="center" gutterBottom variant="h5">
            {item?.description ? item.description : ""}
          </Typography>
          <Typography align="center" variant="body1">
            {item?.type ? item.type : ""}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2 }}
        >
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <TrophyIcon />
            </SvgIcon>
            <Typography color="text.secondary" display="inline" variant="body2">
              {item.points} Pts
            </Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <InboxStackIcon />
            </SvgIcon>
            <Typography color="text.secondary" display="inline" variant="body2">
              {item.stock} in stock
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <ItemDetailModal open={modalOpen} handleClose={handleCloseModal} item={item} onDeleteItem={onDeleteItem} triggerSnackbar={triggerSnackbar}/>
    </>
  );
};

ShopCard.propTypes = {
  item: PropTypes.object.isRequired,
};
