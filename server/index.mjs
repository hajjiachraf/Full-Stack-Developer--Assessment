import { createApp } from './app.mjs'

const PORT = process.env.PORT || 4000

const app = createApp()

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`)
})

