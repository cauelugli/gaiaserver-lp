/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { Paper, Chip, TextField, Box, Grid } from "@mui/material";

const Members = ({ users, value, onChange, handleChipDelete }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isPaperOpen, setIsPaperOpen] = useState(false);
  const inputRef = useRef(null);
  const paperRef = useRef(null);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    setIsPaperOpen(true);
  };

  const handleNameClick = (user) => {
    if (!value.some((selectedUser) => selectedUser._id === user._id)) {
      onChange([...value, user]);
    }
  };

  const handleInputBlur = (event) => {
    if (!paperRef.current.contains(event.relatedTarget)) {
      setIsPaperOpen(false);
    }
  };

  const handleChipRemove = (user) => {
    handleChipDelete(user);
  };

  const filteredNames = searchValue
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          !value.some((selectedUser) => selectedUser._id === user._id)
      )
    : users.filter(
        (user) => !value.some((selectedUser) => selectedUser._id === user._id)
      );

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <div>
            <TextField
              placeholder="Pesquise"
              value={searchValue}
              size="small"
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={() => setIsPaperOpen(true)}
              inputRef={inputRef}
              sx={{ maxWidth: "350px" }}
            />

            {isPaperOpen && (
              <Paper
                ref={paperRef}
                style={{
                  maxWidth: "350px",
                }}
              >
                {filteredNames.map((filteredName) => (
                  <div
                    key={filteredName._id}
                    onClick={() => handleNameClick(filteredName)}
                    tabIndex={0}
                    style={{
                      cursor: "pointer",
                      padding: "5px 0",
                      maxWidth: "350px",
                    }}
                  >
                    {filteredName.name}
                  </div>
                ))}
              </Paper>
            )}
          </div>
        </Grid>

        <Grid item xs={8}>
          <div>
            {value.map((user) => (
              <Chip
                key={user._id}
                label={user.name}
                onDelete={() => handleChipRemove(user)}
                sx={{ mx: 0.5 }}
              />
            ))}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Members;
