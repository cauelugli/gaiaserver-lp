/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Avatar,
  TableSortLabel,
  TablePagination,
  Checkbox,
  IconButton,
  Tooltip,
  Button,
  TextField,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
import SaleTableActions from "../components/small/buttons/tableActionButtons/SaleTableActions";
import InteractionReactions from "../components/small/InteractionReactions";
import AddJobInteractionForm from "../forms/misc/AddJobInteractionForm";
import EditSaleForm from "../forms/edit/EditSaleForm";

export default function SaleTable({
  user,
  config,
  searchValue,
  searchStatus,
  searchOption,
  sales,
  refreshData,
  setRefreshData,
}) {
  const [userReactions, setUserReactions] = React.useState({});
  const [activity, setActivity] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailDepartment, setOpenDetailDepartment] = React.useState(false);
  const [openDetailQuote, setOpenDetailQuote] = React.useState(true);
  const [openDetailRequester, setOpenDetailRequester] = React.useState(false);
  const [openDetailActivities, setOpenDetailActivities] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAddInteraction, setOpenAddInteraction] = React.useState(false);
  const [openAddInteractionOnTable, setOpenAddInteractionOnTable] =
    React.useState(false);

  const handleConfirmDelete = (sale) => {
    setSelectedItem(sale);
    setOpenDialog(true);
  };

  const handleOpenDetail = (sale) => {
    setOpenDetail(!openDetail);
    setSelectedSale(sale);
  };

  const handleOpenEdit = (sale) => {
    setSelectedSale(sale);
    setOpenEdit(!openEdit);
  };

  const tableHeaderRow = [
    {
      id: "number",
      label: "#",
    },
    {
      id: "requester",
      label: "Solicitante",
    },
    {
      id: "items",
      label: "Itens",
    },
    {
      id: "seller.name",
      label: "Vendedor",
    },
    {
      id: "createdBy",
      label: "Criado por",
    },
    {
      id: "scheduledTo",
      label: "Agendado para",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("scheduledTo");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const sellerA = a.seller ? a.seller.name : "";
      const sellerB = b.seller ? b.seller.name : "";

      if (order === "asc") {
        return sellerA.localeCompare(sellerB);
      } else {
        return sellerB.localeCompare(sellerA);
      }
    };

    if (orderBy === "seller.name") {
      return [...sales].sort(compare);
    }

    return [...sales].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [sales, order, orderBy]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const [showCompletedSales, setShowCompletedSales] = React.useState(false);
  const [showArchivedSales, setShowArchivedSales] = React.useState(false);

  const handleAddInteractionFromTable = async (e) => {
    e.preventDefault();
    const requestBody = {
      saleId: selectedSale._id,
      activity,
      user,
      worker: selectedSale.worker,
      manager: selectedSale.manager,
      date: dayjs().format("DD/MM/YYYY HH:mm"),
    };
    try {
      const res = await api.put("/sales/interaction", requestBody);
      if (res.data) {
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAddInteractionOnTable(false);
      setActivity("");
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  const filteredResolvedCount = sortedRows.filter(
    (row) => row.status === "Concluido"
  ).length;

  const filteredArchivedCount = sortedRows.filter(
    (row) => row.status === "Arquivado"
  ).length;

  const filteredValidCount = sortedRows.filter(
    (row) => row.status !== "Arquivado" && row.status !== "Concluido"
  ).length;

  return (
    <Box sx={{ minWidth: "1250px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
        <Checkbox
          checked={showCompletedSales}
          onChange={() => setShowCompletedSales(!showCompletedSales)}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Concluídas
        </Typography>
        <Checkbox
          checked={showArchivedSales}
          onChange={() => setShowArchivedSales(!showArchivedSales)}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Arquivadas
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#eee",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "#" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "#" ? "" : 5,
                  }}
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
            {sortedRows
              .filter((sale) => {
                if (!sale) return false;
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], sale);
                const statusFilter =
                  !searchStatus || sale.status === searchStatus;

                const shouldApplyStatusFilter =
                  statusFilter || searchStatus === "&nbsp";

                // Verifica se a condição para aplicar o filtro é atendida
                const shouldShowSale =
                  userProperty &&
                  userProperty
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) &&
                  shouldApplyStatusFilter;

                return (
                  shouldShowSale &&
                  (showCompletedSales || sale.status !== "Concluido") &&
                  (showArchivedSales || sale.status !== "Arquivado")
                );
              })
              .map((sale) => (
                <>
                  <TableRow
                    key={sale._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedSale._id === sale._id && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#ccc " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="left"
                    >
                      {sale.quoteNumber}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {sale.requester}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                      sx={{ py: 0 }}
                    >
                      <Grid container direction="row" justifyContent="center">
                        {sale.items.slice(0, 3).map((item) => (
                          <Grid
                            direction="column"
                            key={item.id}
                            alignItems="center"
                            sx={{ mr: 1 }}
                          >
                            <Avatar
                              alt="Imagem do Produto"
                              src={`http://localhost:3000/static/${item.image}`}
                              sx={{ width: 32, height: 32, mx: "auto" }}
                            />
                            <Typography sx={{ fontSize: 10, color: "#777" }}>
                              x{item.quantity} {item.name}
                            </Typography>
                          </Grid>
                        ))}
                        {sale.items.length > 3 && (
                          <Typography
                            sx={{
                              marginY: "auto",
                              fontSize: 24,
                              color: "#444",
                            }}
                          >
                            +{sale.items.length - 3}
                          </Typography>
                        )}
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                    >
                      <Grid container direction="row" justifyContent="center">
                        <Tooltip title={sale.seller.name}>
                          <Avatar
                            alt="Imagem do Colaborador"
                            src={`http://localhost:3000/static/${sale.seller.image}`}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                        </Tooltip>
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {sale.createdBy}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {dayjs(sale.deliveryScheduledTo).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {sale.status}
                    </TableCell>
                    <TableCell
                      cursor="pointer"
                      align="center"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <SaleTableActions
                        selectedItem={selectedSale}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                        config={config}
                        user={user}
                        sale={sale}
                        handleOpenEdit={handleOpenEdit}
                        handleOpenAddJobInteraction={setOpenAddInteraction}
                        handleConfirmDelete={handleConfirmDelete}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={openDetail && selectedSale._id === sale._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Departamento
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailDepartment(!openDetailDepartment)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailDepartment}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Nome do Departamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Vendedor
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Criada em
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography>
                                      {sale.department.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Grid container direction="row">
                                      <Grid item>
                                        <Avatar
                                          alt="Imagem do Colaborador"
                                          src={`http://localhost:3000/static/${sale.seller.image}`}
                                          sx={{ width: 32, height: 32, mr: 1 }}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <Typography
                                          sx={{ mt: 0.75, fontSize: 13 }}
                                        >
                                          {sale.seller.name}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography>
                                      {dayjs(sale.createdAt).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Orçamento
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailQuote(!openDetailQuote)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailQuote}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Nº do Orçamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Produtos
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Valor Total
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography>{sale.quoteNumber}</Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    {sale.items.length > 0
                                      ? sale.items.map((item) => (
                                          <Tooltip
                                            key={item.id}
                                            title={
                                              <Typography sx={{ fontSize: 12 }}>
                                                x{item.quantity} {item.name} =
                                                R$
                                                {(
                                                  item.sellValue * item.quantity
                                                ).toFixed(2)}
                                              </Typography>
                                            }
                                          >
                                            <Grid
                                              container
                                              direction="row"
                                              justifyContent="flex-start"
                                              alignItems="flex-start"
                                              sx={{ mt: 0.5 }}
                                            >
                                              <Typography
                                                sx={{
                                                  fontSize: 12,
                                                  color: "#777",
                                                  my: "auto",
                                                }}
                                              >
                                                x{item.quantity} {item.name}
                                              </Typography>
                                              <Avatar
                                                alt="Imagem do Produto"
                                                src={`http://localhost:3000/static/${item.image}`}
                                                sx={{
                                                  width: 26,
                                                  height: 26,
                                                  ml: 1,
                                                }}
                                              />{" "}
                                            </Grid>
                                          </Tooltip>
                                        ))
                                      : "Não há uso de Materiais"}
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography>
                                      R${sale.price.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Solicitante
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailRequester(!openDetailRequester)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailRequester}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Nome do Solicitante
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Contato de Entrega
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Endereço de Entrega
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: "14px", color: "#777" }}
                                    >
                                      Data da Entrega
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography>{sale.requester}</Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography>
                                      {sale.deliveryReceiverPhone}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography>
                                      {sale.deliveryAddress}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography>
                                      {dayjs(sale.deliveryScheduledTo).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Atividades
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailActivities(!openDetailActivities)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailActivities &&
                              selectedSale._id === sale._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Colaborador
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Atividade
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Data
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Reações
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sale.interactions.map((interaction) => (
                                  <TableRow
                                    key={interaction.number}
                                    sx={{
                                      backgroundColor:
                                        interaction.number % 2 === 0
                                          ? "#eee"
                                          : "white",
                                    }}
                                  >
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.user}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.activity}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      <Typography sx={{ fontSize: 13 }}>
                                        {interaction.date}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                      {interaction.activity !==
                                        "Job aprovado" && (
                                        <Typography sx={{ fontSize: 13 }}>
                                          <InteractionReactions
                                            userId={user._id}
                                            userName={user.name}
                                            manager={sale.manager}
                                            refreshData={refreshData}
                                            setRefreshData={setRefreshData}
                                            interaction={interaction}
                                            job={sale}
                                            number={interaction.number}
                                            userReactions={
                                              userReactions[sale._id] || []
                                            }
                                            setUserReactions={(reactions) =>
                                              setUserReactions({
                                                ...userReactions,
                                                [sale._id]: reactions,
                                              })
                                            }
                                            jobId={sale._id}
                                            fromSales
                                          />
                                        </Typography>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {openAddInteractionOnTable ? (
                              <Grid item>
                                <Typography
                                  sx={{
                                    mb: 2,
                                    mt: 4,
                                    fontSize: 18,
                                    fontWeight: "bold",
                                  }}
                                >
                                  Nova Interação
                                </Typography>
                                <TextField
                                  label="Atividade"
                                  variant="outlined"
                                  size="small"
                                  value={activity}
                                  onChange={(e) => setActivity(e.target.value)}
                                  sx={{ width: "100%", mx: "auto" }}
                                />
                                <Grid item>
                                  <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-end"
                                  >
                                    <Button
                                      variant="contained"
                                      color="success"
                                      sx={{ my: 2, mr: 2 }}
                                      onClick={handleAddInteractionFromTable}
                                    >
                                      Adicionar
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      onClick={() =>
                                        setOpenAddInteractionOnTable(false)
                                      }
                                      sx={{ my: 2 }}
                                    >
                                      X
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid sx={{ ml: "90%" }}>
                                <Button
                                  sx={{ my: 1 }}
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() =>
                                    setOpenAddInteractionOnTable(true)
                                  }
                                >
                                  + Interação
                                </Button>
                              </Grid>
                            )}
                          </Collapse>
                        </Box>
                        {sale.status === "Concluido" && (
                          <Box sx={{ my: 4, px: 6, mb: 6 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: 18, fontWeight: "bold" }}
                            >
                              Conclusão
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Data
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Concluido por
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Conclusão
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.resolvedAt}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.resolvedBy}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.commentary}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
              .slice(startIndex, endIndex)}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={
            filteredValidCount +
            (showCompletedSales && filteredResolvedCount) +
            (showArchivedSales && filteredArchivedCount)
          }
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) => {
            return " " + from + " à " + to + " total " + count;
          }}
        />
      </TableContainer>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditSaleForm
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            selectedSale={selectedSale}
            setOpenAddSale={setOpenEdit}
          />
        </Dialog>
      )}
      {openAddInteraction && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddInteraction}
          onClose={() => setOpenAddInteraction(!openAddInteraction)}
        >
          <AddJobInteractionForm
            user={user}
            openEditJob={openAddInteraction}
            selectedJob={selectedSale}
            setOpenEditJob={setOpenAddInteraction}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            fromSales
          />
        </Dialog>
      )}
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
          <GenericDeleteForm
            selectedItem={selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            toast={toast}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            endpoint="sales"
            successMessage={`Venda #${
              selectedItem.quoteNumber && selectedItem.quoteNumber
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
    </Box>
  );
}
