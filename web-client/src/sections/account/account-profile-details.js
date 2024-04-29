import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

export const AccountProfileDetails = () => {
  const { user } = useAuth();

  const [values, setValues] = useState({
    firstName: 'Anika',
    lastName: 'Visser',
    email: 'demo@devias.io',
    phone: '',
    state: 'los-angeles',
    country: 'USA'
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information is for viewing purposes only"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: 1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  // helperText="Please specify full name"
                  label="Full name"
                  name="firstName"
                  onChange={handleChange}
                  // required
                  value={user.name ? user.name : "Loading..."}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  // required
                  value={user.email ? user.email : "Loading..."}
                />
              </Grid>
              {/* <Grid
                xs={12}
                md={6}
              >
                
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid> */}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions> */}
      </Card>
    </form>
  );
};
