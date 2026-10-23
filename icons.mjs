// Renders logo.svg into the square PNG icons (white tile) used by app-review portals.
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const inner = readFileSync('logo.svg', 'utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g, '');
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 144 144"><rect x="-12" y="-12" width="144" height="144" fill="#fff"/>${inner}</svg>`;
for (const size of [1024, 512, 120]) {
  const png = new Resvg(tile, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(`icon-${size}.png`, png);
}
