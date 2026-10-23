// Exports the original Marketo Cat LinkedIn logo (marketocat-logo.jpg, 400x400) as PNG icons. The artwork is not altered.
import sharp from 'sharp';

await sharp('marketocat-logo.jpg').png().toFile('logo.png');
for (const size of [1024, 512, 120]) {
  await sharp('marketocat-logo.jpg').resize(size, size, { kernel: 'lanczos3' }).png().toFile(`icon-${size}.png`);
}
