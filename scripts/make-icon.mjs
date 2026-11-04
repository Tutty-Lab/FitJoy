// Renders the 1024px App Store icon and the launch splash from the mascot art.
import sharp from 'sharp'

const dir = 'ios/App/App/Assets.xcassets'
const mascot = await sharp('src/assets/home/mascot.png').resize(600, 600, { kernel: 'lanczos3' })
  .composite([{ input: Buffer.from('<svg width="600" height="600"><circle cx="300" cy="300" r="300"/></svg>'), blend: 'dest-in' }])
  .png().toBuffer()

const bg = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#34d399"/><stop offset="1" stop-color="#047857"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w / 2}" cy="${h / 2}" r="330" fill="#fff"/></svg>`)

await sharp(bg(1024, 1024)).composite([{ input: mascot, gravity: 'center' }]).flatten({ background: '#10b981' })
  .png().toFile(`${dir}/AppIcon.appiconset/AppIcon-512@2x.png`)
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'])
  await sharp(bg(2732, 2732)).composite([{ input: mascot, gravity: 'center' }]).png().toFile(`${dir}/Splash.imageset/${name}`)
console.log('Icon and splash written')
