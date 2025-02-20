/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Grid2, Typography } from "@mui/material";
import AgendaEventChip from "./AgendaEventChip";
import AgendaEventBar from "./AgendaEventBar";

const DayEvents = (props) => {
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [itemsWithDetails, setItemsWithDetails] = React.useState([]);

  React.useEffect(() => {
    const daySelected = props.selectedDay.slice(0, 2);

    const filteredJobs = props.userAgenda.jobs
      ? props.userAgenda.jobs.filter((job) => job.day === daySelected)
      : [];
    const filteredSales = props.userAgenda.sales
      ? props.userAgenda.sales.filter((sale) => sale.day === daySelected)
      : [];

    const combinedItems = [...filteredJobs, ...filteredSales];
    setFilteredItems(combinedItems);

    const fetchItemDetails = async (item) => {
      try {
        const response = await props.api.get("/get", {
          params: { model: item.type === "job" ? "Job" : "Sale", id: item.id },
        });
        return response.data.find((detail) => detail._id === item.id);
      } catch (err) {
        console.error("Erro ao buscar detalhes do item:", err);
        return null;
      }
    };

    const fetchAllDetails = async () => {
      const itemsWithDetails = await Promise.all(
        combinedItems.map(async (item) => {
          const details = await fetchItemDetails(item);
          return { ...item, details };
        })
      );
      setItemsWithDetails(itemsWithDetails);
    };

    fetchAllDetails();
  }, [props.selectedDay, props.userAgenda, props.api]);

  return (
    <Grid2
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
        itemsWithDetails.map((item, index) => (
          <AgendaEventChip
            key={index}
            item={item}
            api={props.api}
            itemIndex={index}
          />
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
    </Grid2>
  );
};

export default DayEvents;
