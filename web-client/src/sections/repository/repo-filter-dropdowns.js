import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// The filter dropdowns

export const FilterDropdowns = ({ filters, types, instruments, grades, onFilterChange }) => (
  <Box mt={2} display="flex" justifyContent="space-between" gap="20px">
    <FormControl fullWidth>
      <InputLabel>Type</InputLabel>
      <Select
        value={filters.type}
        label="Type"
        name="type"
        onChange={onFilterChange}
        sx={{
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth>
      <InputLabel>Instrument</InputLabel>
      <Select
        value={filters.instrument}
        label="Instrument"
        name="instrument"
        onChange={onFilterChange}
        sx={{
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {instruments.map((instrument) => (
          <MenuItem key={instrument} value={instrument}>
            {instrument}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth>
      <InputLabel>Grade</InputLabel>
      <Select
        value={filters.grade}
        label="Grade"
        name="grade"
        onChange={onFilterChange}
        sx={{
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {grades.map((grade) => (
          <MenuItem key={grade} value={grade}>
            {grade}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
