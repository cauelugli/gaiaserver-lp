/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Grid, Popover } from "@mui/material";
import AnchorIcon from '@mui/icons-material/Anchor';

const IconPicker = ({
  handleClickIcon,
  iconAnchorEl,
  handleCloseIcon,
  handleChangeIcon,
  icon,
}) => {
  const iconList = [
    { id: 1, icon: <AnchorIcon /> },
    { id: 2, icon: "🛠️" },
    { id: 3, icon: "👔" },
    { id: 4, icon: "📞" },
    { id: 5, icon: "💰" },
    { id: 6, icon: "💼" },
    { id: 7, icon: "🏬" },
    { id: 8, icon: "🚚" },
    { id: 9, icon: "🔐" },
    { id: 10, icon: "🤖" },
  ];

  return (
    <>
      <div onClick={handleClickIcon}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "2px solid lightgrey",
            borderRadius: "30%",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {icon && (
            <div
              style={{
                position: "absolute",
                fontSize: "200%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      <Popover
        open={Boolean(iconAnchorEl)}
        anchorEl={iconAnchorEl}
        onClose={handleCloseIcon}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ width: 256, height: 280, border: "2px solid lightgrey" }}>
          <Grid container direction="row">
            {iconList.map((item) => (
              <Grid
                item
                key={item.id}
                sx={{
                  p: 2,
                  fontSize: "200%",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#eee",
                  },
                }}
                onClick={() => {
                  handleChangeIcon(item.icon);
                  handleCloseIcon();
                }}
                selected={item.icon === icon}
              >
                {item.icon}
              </Grid>
            ))}
          </Grid>
        </div>
      </Popover>
    </>
  );
};

export default IconPicker;
