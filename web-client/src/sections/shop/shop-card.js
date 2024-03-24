import PropTypes from "prop-types";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import InboxStackIcon from "@heroicons/react/24/solid/InboxStackIcon";
import { Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { ItemDetailModal } from "./shop-modal"; // Adjust the import path as needed
import { useState } from "react";
import Lottie from "react-lottie";
import noImage from "public/assets/noImage.json";

export const ShopCard = (props) => {
  const { item, onDeleteItem, triggerSnackbar, onEditItem } = props;
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
              height: 300,
            }}
          >
            {item.imageLink ? (
              <img
                src={item?.imageLink || ""}
                alt={item?.description || "N/A"}
                style={{ maxHeight: "300px", maxWidth: "100%", height: "auto", width: "auto" }}
              />
            ) : (
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: noImage,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={300}
                width={300}
              />
            )}
          </Box>
          <Typography align="center" gutterBottom variant="h5">
            {item?.description ? item.description : "N/A"}
          </Typography>
          <Typography align="center" variant="body1">
            {item?.type ? item.type.charAt(0) + item.type.slice(1).toLowerCase() : "-"}{" "}
            {item?.type === "DIGITAL" ? "(" + item?.subtype + ")" : ""}
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
              {item.points ? item.points : 0} Pts
            </Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <InboxStackIcon />
            </SvgIcon>
            <Typography color="text.secondary" display="inline" variant="body2">
              {item.stock ? item.stock : 0} in stock
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <ItemDetailModal
        open={modalOpen}
        handleClose={handleCloseModal}
        item={item}
        onDeleteItem={onDeleteItem}
        triggerSnackbar={triggerSnackbar}
        onEditItem={onEditItem}
      />
    </>
  );
};

ShopCard.propTypes = {
  item: PropTypes.object.isRequired,
};
