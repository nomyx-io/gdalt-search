import axios from 'axios'

export default async (req: any, res: any) => {
  const { img } = req.query
  try {
    const response = await axios.get(img, { responseType: 'arraybuffer' })
    res.setHeader('content-type', response.headers['content-type'])
    res.send(response.data)
  } catch (error: any) {
    console.error('Error fetching the image', error)
    // Forward status code from upstream server, if any
    if (error.response) {
      res.status(error.response.status)
    } else {
      res.status(500)
    }
    res.send(error.message)
  }
}