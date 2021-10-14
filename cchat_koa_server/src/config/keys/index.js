//读取本目录下的 private.key 和 
const fs = require('fs')
const path = require('path')

const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'public.key'), { encoding: 'utf-8' })
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), { encoding: 'utf-8' })

module.exports = {
    PUBLIC_KEY,
    PRIVATE_KEY
}