import say from 'say'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

const defaultLang = 'en'
let handler = async (m, { conn, args, usedPrefix, command }) => {

  let lang = args[0]
  let text = args.slice(1).join(' ')
  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }
  if (!text && m.quoted?.text) text = m.quoted.text
  if (!text) throw `📌 Example : \n${usedPrefix}${command} en hello world`

  let filePath = join('./tmp', `${Date.now()}.wav`)

  await new Promise((resolve, reject) => {
    say.export(text, null, 1.0, filePath, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  conn.sendFile(m.chat, readFileSync(filePath), 'tts.wav', null, m, true)
  unlinkSync(filePath)
}

handler.help = ['tts <lang> <task>']
handler.tags = ['tools']
handler.command = ['tts', 'voz']

export default handler
