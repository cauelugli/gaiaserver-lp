/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

const ProjectReviewTable = ({
  type,
  customer,
  customerType,
  name,
  price,
  mainDepartment,
  selectedDepartments,
  members,
  stages,
  description,
}) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableCell>Tipo</TableCell>
          <TableCell>Cliente</TableCell>
          <TableCell>Tipo de Cliente</TableCell>
        </TableHead>
        <TableRow>
          <TableCell>{type}</TableCell>
          <TableCell>{customer}</TableCell>
          <TableCell>{customerType}</TableCell>
        </TableRow>
      </Table>
      <Table>
        <TableHead>
          <TableCell>Nome do Projeto</TableCell>
          <TableCell>Descrição</TableCell>
          <TableCell>Valor</TableCell>
          <TableCell>Departamento Principal</TableCell>
          <TableCell>Departamentos Secundários</TableCell>
        </TableHead>
        <TableRow>
          <TableCell>{name}</TableCell>
          <TableCell>{description}</TableCell>
          <TableCell>{price}</TableCell>
          <TableCell>{mainDepartment}</TableCell>
          <TableCell>{selectedDepartments}</TableCell>
        </TableRow>
      </Table>

      <Table>
        <TableHead>
          <TableCell>Membros do Projeto</TableCell>
          <TableCell>Etapas</TableCell>
        </TableHead>
        <TableRow>
          <TableCell>{members}</TableCell>
          <TableCell>{stages}</TableCell>
        </TableRow>
      </Table>
    </>
  );
};

export default ProjectReviewTable;
