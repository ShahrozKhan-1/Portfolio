/**
 * Regenerates the responsive WebP portrait variants used by the hero.
 * Run with `npm run images` after replacing public/avatar.png.
 */
import sharp from "sharp"

const SIZES = [480, 720, 960]

for (const width of SIZES) {
  await sharp("public/avatar.png")
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(`public/avatar-${width}.webp`)
  console.log(`public/avatar-${width}.webp`)
}
