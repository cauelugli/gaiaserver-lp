/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Grid, Typography } from "@mui/material";
import { parseAgenda } from "../../../../controllers/functions/overallFunctions";
import AgendaEventChip from "./AgendaEventChip";
import AgendaEventBar from "./AgendaEventBar";

const DayEvents = (props) => {
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const daySelected = props.selectedDay.slice(0, 2);

    const parsedAgenda = parseAgenda(props.userAgenda);
    const itemsForSelectedDay = parsedAgenda.flatMap((entry) =>
      entry.items.filter((item) => String(item.day) === daySelected)
    );

    setFilteredItems(itemsForSelectedDay);
  }, [props.selectedDay, props.userAgenda]);

  return (
    <Grid
      sx={{
        height: open ? (filteredItems.length > 0 ? 250 : 115) : 45,
        backgroundColor: "#f8f8ff",
        border: "1px solid #e7e7ee",
        borderRadius: 3,
        my: 1,
        width: 320,
      }}
    >
      <AgendaEventBar
        day={props.selectedDay.slice(0, 2)}
        mainColor={props.mainColor}
        open={open}
        setOpen={setOpen}
        isEmptyDay={filteredItems.length > 0}
      />
      {open && filteredItems.length > 0 ? (
        filteredItems.map((item, index) => (
          <AgendaEventChip key={index} item={item} />
        ))
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ m: 2, color: "black" }}
        >
          {open && "Nenhum serviço agendado para você nesta data"}
        </Typography>
      )}
    </Grid>
  );
};

export default DayEvents;
