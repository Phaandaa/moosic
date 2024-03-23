import { formatDistanceToNow, parseISO } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import Link from "next/link";

export const OverviewLatestProducts = (props) => {
  const { products = [], sx } = props;

  // Sort the products by creationTime in descending order
  const sortedProducts = [...products].sort((a, b) => {
    return parseISO(a.creationTime) - parseISO(b.creationTime);
  });

  // Slice the array to get the top 5 most recent products
  const recentProducts = sortedProducts.slice(0, 5);
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Products" />
      <List>
        {recentProducts.map((product, index) => {
          const hasDivider = index < recentProducts.length - 1;
          const ago = product.creationTime
            ? formatDistanceToNow(new Date(product.creationTime))
            : "Unknown time";
          return (
            <ListItem divider={hasDivider} key={product.id}>
              <ListItemAvatar>
                {product.imageLink ? (
                  <Box
                    component="img"
                    src={product.imageLink}
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "neutral.200",
                      height: 48,
                      width: 48,
                    }}
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={product.description}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={`Updated ${ago} ago`}
                secondaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Link href="/shop" passHref>
          <Button
            component="a" // This makes the Button component act as an anchor tag
            color="inherit"
            endIcon={
              <SvgIcon fontSize="small">
                <ArrowRightIcon />
              </SvgIcon>
            }
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewLatestProducts.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
