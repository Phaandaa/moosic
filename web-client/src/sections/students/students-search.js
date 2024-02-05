import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const StudentsSearch = ({ handleSearchChange }) => (
  <>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search student"
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
