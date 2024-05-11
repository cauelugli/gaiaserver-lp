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
import ReportIcon from "@mui/icons-material/Report";
import PaymentsIcon from "@mui/icons-material/Payments";

export default function FinanceOutcomeTableActions(props) {
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
          {props.outcome.status !== "Pago" &&
            props.outcome.payment &&
            !props.outcome.payment.paymentDates && (
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddCashPayment(props.outcome),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Pagar a Vista</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}
            
          {!props.outcome.payment && props.outcome.status === "Aprovado" && (
            <>
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddCashPayment(props.outcome),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Realizar Pagamento{" "}
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  props.handleOpenAddSchedulePayment(props.outcome),
                    setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Agendar Pagamento{" "}
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            </>
          )}
          <ListItemButton
            disabled={props.outcome.status === "Contestado"}
            onClick={() => {
              props.handleChallengeApproval(props.outcome), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>
                  {props.outcome.status === "Contestado"
                    ? "Entrada Contestada"
                    : "Contestar Entrada"}
                </Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          {props.outcome.payment &&
            props.outcome.payment.paymentDates &&
            props.outcome.status !== "Pago" && (
              <ListItemButton
                onClick={() => {
                  props.handleOpenAddParcelPayment(props.outcome),
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
        </List>
      </Menu>
    </div>
  );
}
