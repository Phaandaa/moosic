import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const RepoSearch = ({ handleSearchChange }) => (
  <>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search files"
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
      // sx={{ maxWidth: 500 }}
    />
  </>
);
