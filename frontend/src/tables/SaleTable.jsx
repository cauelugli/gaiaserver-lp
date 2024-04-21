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
  Popover,
  InputBase,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SaleTableActions from "../components/small/buttons/tableActionButtons/SaleTableActions";
import InteractionReactions from "../components/small/InteractionReactions";
import AddJobInteractionForm from "../forms/misc/AddJobInteractionForm";
import EditSaleForm from "../forms/edit/EditSaleForm";
import ViewDialog from "../components/small/ViewDialog";

export default function SaleTable({
  userId,
  userName,
  userUsername,
  searchValue,
  searchStatus,
  searchOption,
  sales,
  refreshData,
  setRefreshData,
  topBar
}) {
  const [userReactions, setUserReactions] = React.useState({});
  const [activity, setActivity] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(false);
  const [openDetailItems, setOpenDetailItems] = React.useState(false);
  const [openDetailAttachments, setOpenDetailAttachments] =
    React.useState(false);
  const [openDetailActivities, setOpenDetailActivities] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openViewDialog2, setOpenViewDialog2] = React.useState(false);
  const [openAddInteraction, setOpenAddInteraction] = React.useState(false);
  const [openAddInteractionOnTable, setOpenAddInteractionOnTable] =
    React.useState(false);
  const [attachments, setAttachments] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);

  const handleOpenDetail = (sale) => {
    setOpenDetail(!openDetail);
    setSelectedSale(sale);
  };

  const handleOpenEdit = (sale) => {
    setSelectedSale(sale);
    setOpenEdit(!openEdit);
  };

  const handleDeleteAttachment = async (saleId, attachmentIndex) => {
    try {
      const response = await api.put("/sales/deleteAttachment", {
        saleId,
        attachmentIndex,
      });

      if (response.data) {
        toast.success("Anexo deletado com sucesso!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Erro ao deletar o anexo. Tente novamente.", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.error(err);
    }
  };

  const addInteractionToSale = (updatedSale) => {
    setSelectedSale(updatedSale);
    setRefreshData(!refreshData);
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
    try {
      let uploadResponses = [];
      if (attachments.length !== 0) {
        for (const file of attachments) {
          const formData = new FormData();
          formData.append("attachment", file);
          formData.append("itemId", selectedSale._id);

          const uploadResponse = await api.post(
            "/uploads/singleAttachment",
            formData
          );
          uploadResponses.push(uploadResponse.data.attachmentPath);
        }

        await api.put(`/sales/addAttachments`, {
          itemId: selectedSale._id,
          attachments: uploadResponses,
          userName,
          date: dayjs().format("DD/MM HH:mm"),
        });
      }

      const requestBody = {
        saleId: selectedSale._id,
        activity,
        attachments: uploadResponses,
        userName,
        date: dayjs().format("DD/MM HH:mm"),
      };

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

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
  ];

  const isImage = (filename) =>
    imageExtensions.some((extension) => filename.endsWith(extension));

  const isPdf = (filename) => filename.endsWith(".pdf");

  const handlePopoverOpen = (index) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverIndex(index);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenPopoverIndex(null);
  };

  const updateSelectedSaleInteractions = (updatedInteractions) => {
    setSelectedSale((currentSelectedJob) => ({
      ...currentSelectedJob,
      interactions: updatedInteractions,
    }));
  };

  const handleFileChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
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
            <TableRow>
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
                const itemProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], sale);
                const statusFilter =
                  !searchStatus || sale.status === searchStatus;

                const shouldApplyStatusFilter =
                  statusFilter || searchStatus === "&nbsp";

                const shouldShowSale =
                  itemProperty &&
                  itemProperty
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
                        userName={userName}
                        sale={sale}
                        handleOpenEdit={handleOpenEdit}
                        handleOpenAddSaleInteraction={setOpenAddInteraction}
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
                              Informações
                            </Typography>
                            <IconButton
                              onClick={() => setOpenDetailInfo(!openDetailInfo)}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>

                          <Collapse
                            in={openDetailInfo}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Cliente
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Solicitante
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Vendedor
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nº do Orçamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Status
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.customer.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.requester}
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
                                          {sale.seller.name} (
                                          {sale.department.name})
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.quoteNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {sale.status}
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
                              Produtos
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailItems(!openDetailItems)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailItems && selectedSale._id === sale._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            {sale.items.length !== 0 && (
                              <Table size="small" sx={{ mt: 1 }}>
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="left">
                                      <Grid container>
                                        {sale.items.map((item) => (
                                          <Grid
                                            item
                                            key={item.id}
                                            sx={{
                                              border: "1px solid darkgrey",
                                              borderRadius: 2,
                                              padding: 1,
                                              mr: 1,
                                            }}
                                          >
                                            <Grid
                                              container
                                              direction="column"
                                              justifyContent="center"
                                              alignItems="center"
                                            >
                                              <Avatar
                                                alt="Imagem do Produto"
                                                src={`http://localhost:3000/static/${item.image}`}
                                                sx={{
                                                  width: 54,
                                                  height: 54,
                                                  mb: 1,
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: 13,
                                                  color: "#555",
                                                  my: "auto",
                                                }}
                                              >
                                                {item.name} x{item.quantity} =
                                                R$
                                                {(
                                                  item.sellValue * item.quantity
                                                ).toFixed(2)}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        ))}
                                      </Grid>
                                      <Typography
                                        sx={{
                                          mb: 1,
                                          mt: 2,
                                          fontSize: 18,
                                          fontWeight: "bold",
                                          color: "#333",
                                        }}
                                      >
                                        Total ({sale.items.length} produtos) =
                                        R${sale.price}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            )}
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
                              Anexos
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailAttachments(!openDetailAttachments)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={
                              openDetailAttachments &&
                              selectedSale._id === sale._id
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            {sale.attachments.length !== 0 && (
                              <Table size="small" sx={{ mt: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography
                                        sx={{ fontSize: 13, color: "#777" }}
                                      >
                                        Anexos
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="left">
                                      <Grid container direction="row">
                                        {sale.attachments.map(
                                          (attachment, index) => (
                                            <Grid
                                              key={index}
                                              item
                                              sx={{
                                                mr: 1,
                                              }}
                                            >
                                              <Grid
                                                container
                                                dierction="column"
                                                alignItems="center"
                                                justifyContent="center"
                                              >
                                                <Grid
                                                  container
                                                  direction="column"
                                                  alignItems="center"
                                                  sx={{
                                                    cursor: "pointer",
                                                    border:
                                                      "1px solid darkgrey",
                                                    borderRadius: 2,
                                                    padding: 1,
                                                  }}
                                                  onClick={() => {
                                                    setSelectedItem(attachment);
                                                    setOpenViewDialog(true);
                                                  }}
                                                >
                                                  {isPdf(attachment) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/pdf.png`}
                                                      alt="PDF"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : isImage(attachment) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/${attachment}`}
                                                      alt="Arquivo Inexistente"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : (
                                                    <img
                                                      src={`http://localhost:3000/static/doc.png`}
                                                      alt="Other"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  )}
                                                  <Typography
                                                    sx={{
                                                      fontSize: 10,
                                                      color: "#777",
                                                      maxWidth: "75px",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                    }}
                                                  >
                                                    {
                                                      attachment
                                                        .split("/")
                                                        .pop()
                                                        .split(".")[1]
                                                    }
                                                  </Typography>
                                                </Grid>
                                                {userUsername === "admin" && (
                                                  <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                      handleDeleteAttachment(
                                                        sale._id,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    <DeleteIcon />
                                                  </Button>
                                                )}
                                              </Grid>
                                            </Grid>
                                          )
                                        )}
                                      </Grid>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            )}
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
                                      Anexos
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
                                {sale.interactions.map((interaction, index) => (
                                  <TableRow
                                    key={index}
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
                                      {interaction.attachments &&
                                        interaction.attachments.length !==
                                          0 && (
                                          <Grid>
                                            <AttachFileIcon
                                              sx={{
                                                fontSize: 16,
                                                color: "#777",
                                                cursor: "pointer",
                                              }}
                                              onClick={handlePopoverOpen(index)}
                                            />
                                            {openPopoverIndex === index && (
                                              <Popover
                                                open={Boolean(anchorEl)}
                                                anchorEl={anchorEl}
                                                onClose={handlePopoverClose}
                                                anchorOrigin={{
                                                  vertical: "bottom",
                                                  horizontal: "left",
                                                }}
                                              >
                                                <Box
                                                  p={2}
                                                  sx={{
                                                    width: "auto",
                                                    maxWidth: 460,
                                                    height: "auto",
                                                    maxHeight: 280,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="h6"
                                                    sx={{ color: "#555" }}
                                                  >
                                                    Anexos
                                                  </Typography>
                                                  <Grid
                                                    container
                                                    direction="row"
                                                  >
                                                    {interaction.attachments.map(
                                                      (
                                                        attachment,
                                                        attachmentIndex
                                                      ) => (
                                                        <Grid
                                                          key={attachmentIndex}
                                                          sx={{
                                                            mr: 2,
                                                            mb: 2,
                                                            cursor: "pointer",
                                                            border:
                                                              "1px solid darkgrey",
                                                            borderRadius: 2,
                                                            padding: 1,
                                                          }}
                                                          onClick={() => {
                                                            setSelectedItem(
                                                              attachment
                                                            );
                                                            setOpenViewDialog(
                                                              true
                                                            );
                                                          }}
                                                        >
                                                          {isPdf(attachment) ? (
                                                            <img
                                                              src={`http://localhost:3000/static/pdf.png`}
                                                              alt="PDF"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                                marginBottom:
                                                                  "8px",
                                                              }}
                                                            />
                                                          ) : isImage(
                                                              attachment
                                                            ) ? (
                                                            <img
                                                              src={`http://localhost:3000/static/${attachment}`}
                                                              alt="Arquivo Inexistente"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                                marginBottom:
                                                                  "8px",
                                                              }}
                                                            />
                                                          ) : (
                                                            <img
                                                              src={`http://localhost:3000/static/doc.png`}
                                                              alt="Other"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                                marginBottom:
                                                                  "8px",
                                                              }}
                                                            />
                                                          )}
                                                        </Grid>
                                                      )
                                                    )}
                                                  </Grid>
                                                </Box>
                                              </Popover>
                                            )}
                                          </Grid>
                                        )}
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
                                            userId={userId}
                                            userName={userName}
                                            itemId={sale._id}
                                            refreshData={refreshData}
                                            setRefreshData={setRefreshData}
                                            interaction={interaction}
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
                                            updateInteractions={
                                              updateSelectedSaleInteractions
                                            }
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
                              <>
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
                                  <Paper
                                    elevation={1}
                                    component="form"
                                    sx={{
                                      p: "2px 4px",
                                      display: "flex",
                                      alignItems: "center",
                                      mx: "15%",
                                    }}
                                  >
                                    <InputBase
                                      sx={{ ml: 1, flex: 1 }}
                                      placeholder="Atividade"
                                      value={activity}
                                      onChange={(e) =>
                                        setActivity(e.target.value)
                                      }
                                    />
                                    <input
                                      type="file"
                                      multiple
                                      id="fileInput"
                                      style={{ display: "none" }}
                                      onChange={handleFileChange}
                                    />
                                    <label htmlFor="fileInput">
                                      <IconButton
                                        component="span"
                                        aria-label="upload picture"
                                        sx={{ p: "10px" }}
                                      >
                                        <AttachFileIcon />
                                      </IconButton>
                                    </label>
                                  </Paper>

                                  {attachments.length !== 0 && (
                                    <Paper
                                      elevation={1}
                                      component="form"
                                      sx={{
                                        p: "2px 4px",
                                        display: "flex",
                                        alignItems: "center",
                                        mx: "15%",
                                        mt: 2,
                                      }}
                                    >
                                      <Grid item>
                                        <Grid container direction="row">
                                          {attachments.map(
                                            (attachment, index) => (
                                              <Grid
                                                key={index}
                                                item
                                                sx={{ mr: 1 }}
                                              >
                                                <Grid
                                                  container
                                                  direction="column"
                                                  alignItems="center"
                                                  sx={{
                                                    border:
                                                      "1px solid darkgrey",
                                                    borderRadius: 2,
                                                    padding: 1,
                                                  }}
                                                >
                                                  {isPdf(attachment.name) ? (
                                                    <img
                                                      src={`http://localhost:3000/static/pdf.png`}
                                                      alt="PDF"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : isImage(
                                                      attachment.name
                                                    ) ? (
                                                    <img
                                                      src={URL.createObjectURL(
                                                        attachment
                                                      )}
                                                      alt="Arquivo Inexistente"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  ) : (
                                                    <img
                                                      src={`http://localhost:3000/static/doc.png`}
                                                      alt="Other"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                      }}
                                                    />
                                                  )}
                                                  <Typography
                                                    sx={{
                                                      fontSize: 10,
                                                      color: "#777",
                                                      maxWidth: "75px",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                    }}
                                                  >
                                                    {attachment.name}
                                                  </Typography>

                                                  <Grid item>
                                                    <Grid
                                                      container
                                                      direction="row"
                                                      justifyContent="space-around"
                                                    >
                                                      <Button
                                                        size="small"
                                                        onClick={() => {
                                                          setSelectedItem(
                                                            attachment
                                                          );
                                                          setOpenViewDialog2(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        <VisibilityIcon />
                                                      </Button>
                                                      <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                          removeFile(index)
                                                        }
                                                      >
                                                        <DeleteIcon />
                                                      </Button>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                            )
                                          )}
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  )}
                                  <Grid item>
                                    <Grid
                                      container
                                      direction="row"
                                      justifyContent="flex-end"
                                    >
                                      <Button
                                        variant="contained"
                                        disabled={activity === ""}
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
                              </>
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
            userId={userId}
            userName={userName}
            openEditJob={openAddInteraction}
            selectedJob={selectedSale}
            setOpenEditJob={setOpenAddInteraction}
            refreshData={refreshData}
            addInteractionToJob={addInteractionToSale}
            setRefreshData={setRefreshData}
            toast={toast}
            updateSelectedSaleInteractions={updateSelectedSaleInteractions}
            fromSales
          />
        </Dialog>
      )}
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem}
            setOpenViewDialog={setOpenViewDialog}
          />
        </Dialog>
      )}
      {openViewDialog2 && (
        <Dialog
          open={openViewDialog2}
          onClose={() => setOpenViewDialog2(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem.name}
            setOpenViewDialog={setOpenViewDialog2}
            createObjectURL
            createObjectURLItem={selectedItem}
          />
        </Dialog>
      )}
    </Box>
  );
}
