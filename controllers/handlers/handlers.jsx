export const handleCurrencyValueChange = (e, setValue) => {
  let inputValue = e.target.value.replace(/\D/g, "");
  inputValue = inputValue.replace(/^0+/, "");
  if (inputValue.length < 3) {
    inputValue = inputValue.padStart(3, "0");
  }
  const formattedValue = `${inputValue.slice(0, -2)}.${inputValue.slice(-2)}`;
  setValue(formattedValue);
};

export const dummyFunction = () => {
  // Função de exemplo
  console.log("Esta é uma função dummy.");
};
