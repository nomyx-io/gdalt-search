import axios from 'axios'
import fs from 'fs'

export default async (req: any, res: any) => {
  const { img } = req.query
  try {
    const response = await axios.get(img, { responseType: 'arraybuffer' })
    if(response && response.data && response.headers['content-type']) {
      res.setHeader('content-type', response.headers['content-type'])
      res.send(response.data)
    } else {
      // load the placeholder image in ./public/placeholder.png
      res.setHeader('content-type', 'image/png')
      const rs = fs.createReadStream('./public/placeholder.png').pipe(res)
      res.send(rs)
    }
  } catch (error: any) {
    console.error('Error fetching the image', error)
    // load the placeholder image in ./public/placeholder.png
    res.setHeader('content-type', 'image/png')
    console.log('res', res)
    const rs = fs.createReadStream('./public/placeholder.png').pipe(res)
    res.send(rs)
  }
}