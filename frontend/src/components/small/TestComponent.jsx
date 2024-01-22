/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ItemLinha = React.memo(({ item, index, onInputChange, onSelectChange }) => (
  <Stack key={index} spacing={2}>
    <TextField
      label="Primeiro TextField"
      variant="outlined"
      value={item.primeiroTextField}
      onChange={(e) => onInputChange(index, 'primeiroTextField', e.target.value)}
    />

    <FormControl variant="outlined">
      <InputLabel id={`select-label-${index}`}>Selecione</InputLabel>
      <Select
        label="Selecione"
        labelId={`select-label-${index}`}
        value={item.selectValue}
        onChange={(e) => onSelectChange(index, e.target.value)}
      >
        <MenuItem value="opcao1">Opção 1</MenuItem>
        <MenuItem value="opcao2">Opção 2</MenuItem>
        <MenuItem value="opcao3">Opção 3</MenuItem>
      </Select>
    </FormControl>

    <TextField
      label="Segundo TextField"
      variant="outlined"
      value={item.segundoTextField}
      onChange={(e) => onInputChange(index, 'segundoTextField', e.target.value)}
    />
  </Stack>
));

function MeuComponente() {
  const [listaItens, setListaItens] = useState([{ primeiroTextField: '', selectValue: '', segundoTextField: '' }]);

  const adicionarLinha = () => {
    setListaItens([...listaItens, { primeiroTextField: '', selectValue: '', segundoTextField: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const novaLista = [...listaItens];
    novaLista[index][field] = value;
    setListaItens(novaLista);
  };

  const handleSelectChange = (index, value) => {
    const novaLista = [...listaItens];
    novaLista[index].selectValue = value;
    setListaItens(novaLista);
  };

  return (
    <div>
      {listaItens.map((item, index) => (
        <ItemLinha
          key={index}
          item={item}
          index={index}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />
      ))}

      <Button variant="contained" color="primary" onClick={adicionarLinha}>
        Adicionar Nova Linha
      </Button>
    </div>
  );
}

export default MeuComponente;
