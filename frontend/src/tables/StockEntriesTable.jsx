/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockEntriesTable() {
  const [stockEntries, setStockEntries] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockEntries = await api.get("/stock");
        setStockEntries(stockEntries.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [stockEntries]);

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#ccc" }}>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>#</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Itens</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>
                    Valor Total da Compra
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Adicionado em</Typography>
                </TableCell>
              </TableRow>
              {stockEntries.map((entry) => (
                <>
                  <TableRow key={entry._id}>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 14 }}>
                        {entry.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      {entry.items.map((item) => (
                        <Typography key={item._id} sx={{ fontSize: 14 }}>
                           x{item.quantity} {item.item.name} = R${item.buyValue * item.quantity}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 14 }}>
                        R${entry.quoteValue}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 14 }}>
                        {dayjs(entry.createdAt).format("DD/MM/YYYY")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
