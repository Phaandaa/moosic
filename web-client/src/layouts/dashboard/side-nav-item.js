import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase, Tooltip, Button } from "@mui/material";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, tooltip } = props;

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        }}
        {...linkProps}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...(active && {
                  color: "primary.main",
                }),
              }}
            >
              {icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: "neutral.400",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(active && {
                color: "common.white",
              }),
              ...(disabled && {
                color: "neutral.500",
              }),
            }}
          >
            {title}
          </Box>
        </Box>
        <Box>
          {tooltip && (
            <Tooltip title={tooltip} placement="right" arrow>
              <Button
                sx={{
                  alignItems: "center",
                  borderRadius: "50%",
                  color: "neutral.400",
                  display: "flex",
                  height: 32,
                  justifyContent: "center",
                  minWidth: 32,
                  padding: 0,
                  ...(active && {
                    color: "primary.main",
                  }),
                }}
              >
                <InformationCircleIcon />
              </Button>
            </Tooltip>
          )}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
};
