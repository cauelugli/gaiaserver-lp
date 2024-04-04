/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";

export default function FinanceIncomeTableActions(props) {
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setSelectedItem(selectedItem);
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ "&:hover": { borderColor: "#eee" } }}
      >
        <MenuIcon sx={{ color: "#888" }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ width: 210 }}>
          {props.configData.canReceiveInstallments &&
            !props.income.payment &&
            props.income.status === "Aguardando Agendamento" && (
              <>
                <ListItemButton
                  onClick={() => {
                    props.handleOpenAddCashPayment(props.income),
                      setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 14 }}>
                        Receber a Vista
                      </Typography>
                    }
                    sx={{ ml: -3 }}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    props.handleOpenAddSchedulePayment(props.income),
                      setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 14 }}>
                        Agendar Pagamento
                      </Typography>
                    }
                    sx={{ ml: -3 }}
                  />
                </ListItemButton>
              </>
            )}

          {!props.configData.canReceiveInstallments &&
            !props.income.payment &&
            props.income.status === "Aguardando Agendamento" && (
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddCashPayment(props.income),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Receber a Vista
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          {props.income.payment &&
            props.income.payment.paymentDates &&
            props.income.status !== "Pago" && (
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddParcelPayment(props.income),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <PaymentsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Receber Parcela
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}
          {props.income.status !== "Pago" &&
            props.income.payment &&
            !props.income.payment.paymentDates && (
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddCashPayment(props.income),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Receber a Vista
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}
        </List>
      </Menu>
    </div>
  );
}
