const express = require('express')
const path = require('path')

const app = express()

app
.use(express.static('public'))
.use(express.static('src'))

.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/views/index.html"))
})

.listen(1221)