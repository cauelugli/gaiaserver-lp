
// function darkenColor(hex, factor) {
//   hex = hex.replace(/^#/, "");
//   const bigint = parseInt(hex, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;

//   const newR = Math.max(0, Math.round(r - factor));
//   const newG = Math.max(0, Math.round(g - factor));
//   const newB = Math.max(0, Math.round(b - factor));

//   const darkenedHex = `#${((newR << 16) | (newG << 8) | newB)
//     .toString(16)
//     .padStart(6, "0")}`;

//   return darkenedHex;
// }