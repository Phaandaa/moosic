import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const ShopSearch = ({ handleSearchChange }) => (
  <>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search for items"
      onChange={handleSearchChange}
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ width: "100%" }}
    />
  </>
);
