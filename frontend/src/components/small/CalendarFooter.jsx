/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Grid, Typography } from "@mui/material";
import { parseAgenda } from "../../../../controllers/functions/overallFunctions";

const CalendarFooter = (props) => {
  const [filteredItems, setFilteredItems] = React.useState([]);

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
        height: 150,
        width: "auto",
        backgroundColor: "#f8f8ff",
        border: "1px solid #e7e7ee",
        borderRadius: 3,
        mt: 1,
      }}
    >
      {filteredItems.length > 0 ? (
        filteredItems.map((item, index) => (
          <Typography key={index} variant="body2" sx={{ marginBottom: 1 }}>
            Serviço: {item.service} | Horário: {item.scheduleTime} | Status:{" "}
            {item.status}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          Nenhum item para o dia selecionado.
        </Typography>
      )}
    </Grid>
  );
};

export default CalendarFooter;
