/*  

  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

*/

// Import Module 
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("baileys")
const pino = require("pino")
const chalk = require("chalk")
const readline = require("readline")
const { resolve } = require("path")
const { version } = require("os")

// Metode Pairing
const usePairingCode = true

// Promt Input Terminal
async function question(promt) {
    process.stdout.write(promt)
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise((resolve) => r1.question("", (ans) => {
        r1.close()
        resolve(ans)
    }))
    
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./LenwySesi')
  
  // Versi Terbaru
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`Lenwy Using WA v${version.join('.')}, isLatest: ${isLatest}`)

  const lenwy = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    version: version,
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
      }
      return proto.Message.fromObject({})
    }
  })

  // Handle Pairing Code
  if (usePairingCode && !lenwy.authState.creds.registered) {
    try {
      const phoneNumber = await question('☘️ Masukan Nomor Yang Diawali Dengan 62 :\n')
      const code = await lenwy.requestPairingCode(phoneNumber.trim())
      console.log(`🎁 Pairing Code : ${code}`)
    } catch (err) {
      console.error('Failed to get pairing code:', err)
    }
  }
    // Menyimpan Sesi Login
    lenwy.ev.on("creds.update", saveCreds)

    // Informasi Koneksi
    lenwy.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        if ( connection === "close") {
            console.log(chalk.red("❌  Koneksi Terputus, Mencoba Menyambung Ulang"))
            connectToWhatsApp()
        } else if ( connection === "open") {
            console.log(chalk.green("✔  Bot Berhasil Terhubung Ke WhatsApp"))
        }
    })

    // Respon Pesan Masuk
    lenwy.ev.on("messages.upsert", async (m) => {

        if (m.type !== 'notify') return  // tambah ini
        const msg = m.messages[0]

        if (!msg.message) return

        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
        const sender = msg.key.remoteJid
        const pushname = msg.pushName || "Pita"

        // Log Pesan Masuk Terminal
        const listColor = ["red", "green", "yellow", "magenta", "cyan", "white", "blue"]
        const randomColor = listColor[Math.floor(Math.random() * listColor.length)]
        const nameColor = (pushname === "Pita") ? chalk.hex("#ff69b4") : chalk[randomColor]

        console.log(
            chalk.green.bold("[ WhatsApp ]"),
            nameColor(pushname),
            chalk[randomColor](" : "),
            chalk.white(body)
            
        )

        require("./lenwy")(lenwy, m)
    })
    
}
process.on('uncaughtException', (err) => {
    if (err.message?.includes('Bad MAC')) return
    console.error(err)
})

// Jalankan Koneksi WhatsApp
connectToWhatsApp() 