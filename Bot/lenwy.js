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

// ===== Import Module =====
require('./len')
require('./database/Menu/pitaMenu')
const fs = require('fs')
const axios = require('axios')
const cron = require("node-cron")

// ── Saldo Database ──────────────────────────
// pisah antara personal & group
const saldocashPersonalPath = './database/user/saldoatm_personal.json'
const saldoatmPersonalPath = './database/user/saldoatm_personal.json'
const saldocashGroupPath    = './database/user/saldocash_group.json'
const saldoatmGroupPath    = './database/user/saldocash_group.json'
const tugaspribPath = './database/user/tugasprib.json'
const tugaspribGroupPath = './database/user/tugaspribGroup.json'
const tugaskelasPath = './database/user/tugaskelas.json'

if (!fs.existsSync('./database/user')) {
    fs.mkdirSync('./database/user', { recursive:true })
}

let saldoatmPersonal = fs.existsSync(saldoatmPersonalPath)
    ? JSON.parse(fs.readFileSync(saldoatmPersonalPath))
    : {}
let saldoatmGroup = fs.existsSync(saldoatmGroupPath)
    ? JSON.parse(fs.readFileSync(saldoatmGroupPath))
    : {}

let saldocashPersonal = fs.existsSync(saldocashPersonalPath)
    ? JSON.parse(fs.readFileSync(saldocashPersonalPath))
    : {}
let saldocashGroup = fs.existsSync(saldocashGroupPath)
    ? JSON.parse(fs.readFileSync(saldocashGroupPath))
    : {}

let tugaskelas = fs.existsSync(tugaskelasPath)
    ? JSON.parse(fs.readFileSync(tugaskelasPath))
    : {}

let tugasprib = fs.existsSync(tugaspribPath)
    ? JSON.parse(fs.readFileSync(tugaspribPath))
    : {}

let tugaspribGroup = fs.existsSync(tugaspribGroupPath)
    ? JSON.parse(fs.readFileSync(tugaspribGroupPath))
    : {}

function savetugas(){
    fs.writeFileSync(tugaspribPath, JSON.stringify(tugasprib, null, 2))
    fs.writeFileSync(tugaspribGroupPath, JSON.stringify(tugaspribGroup, null, 2))
    fs.writeFileSync(tugaskelasPath, JSON.stringify(tugaskelas, null, 2))
}
function saveSaldo(){
    fs.writeFileSync(saldocashPersonalPath, JSON.stringify(saldocashPersonal, null, 2))
    fs.writeFileSync(saldocashGroupPath, JSON.stringify(saldocashGroup, null, 2))
    fs.writeFileSync(saldoatmPersonalPath, JSON.stringify(saldoatmPersonal, null, 2))
    fs.writeFileSync(saldoatmGroupPath, JSON.stringify(saldoatmGroup, null, 2))
}

function reminder(type) {
    let db
    let label

    if (type === "kelas") {
        db = tugaskelas
        label = "Tugas Kelas"
    } else if (type === "prib") {
        db = tugasprib
        label = "Tugas Pribadi"
    } else {
        return console.log("⚠️ Type tidak dikenal")
    }

    for (let uid in db) {
        db[uid].list.forEach(task => {
            const now = new Date()
            const dl = new Date(task.deadline)
            const selisih = Math.ceil((dl - now) / (1000*60*60*24))

            if (selisih > 0) {
                lenwy.sendMessage(uid, { 
                    text: `📌 [${label}]\n${task.tugas}\nDeadline: ${task.deadline}\nSisa waktu: ${selisih} hari`
                })
            } else if (selisih === 0) {
                lenwy.sendMessage(uid, { 
                    text: `⚠️ Deadline hari ini untuk ${label}: ${task.tugas}!`
                })
            }
        })
    }
}

// jalanin tiap jam 7 pagi
cron.schedule("25 11 * * *", () => {
    console.log("⏰ Reminder harian jalan...")
    reminder("kelas")
    reminder("prib")
}, {
    timezone: "Asia/Jakarta"
})

// buat user baru kalau belum ada
function ensuretugasprib(id){
    if (!tugasprib[id]) tugasprib[id] = { tugas:0, list:[]}
    if (!Array.isArray(tugasprib[id].list)) tugasprib[id].list = []
    return tugasprib[id]
}
function ensuretugaspribGroup(id){
    if (!tugaspribGroup[id]) tugaspribGroup[id] = { tugas:0, list:[]}
    if (!Array.isArray(tugaspribGroup[id].list)) tugaspribGroup[id].list = []
    return tugaspribGroup[id]
}
function ensuretugaskelas(id){
    if (!tugaskelas[id]) tugaskelas[id] = { tugas:0, list:[]}
    if (!Array.isArray(tugaskelas[id].list)) tugaskelas[id].list = []
    return tugaskelas[id]
}
function ensurePersonalcash(id){
    if (!saldocashPersonal[id]) saldocashPersonal[id] = { saldo:0, history:[] }
    if (!Array.isArray(saldocashPersonal[id].list)) saldocashPersonal[id].list = []
    return saldocashPersonal[id]
}
function ensureGroupcash(gid, uid){
    if (!saldocashGroup[gid]) saldocashGroup[gid] = {}
    if (!saldocashGroup[gid][uid]) saldocashGroup[gid][uid] = { saldo:0, history:[] }
    if (!Array.isArray(saldocashGroup[gid][uid].history)) saldocashGroup[gid][uid].history = []
    return saldocashGroup[gid][uid]
}    
function ensurePersonalatm(id){
    if (!saldoatmPersonal[id]) saldoatmPersonal[id] = { saldo:0, history:[] }
    if (!Array.isArray(saldoatmPersonal[id].history)) saldoatmPersonal[id].history = []
    return saldoatmPersonal[id]
}
function ensureGroupatm(gid, uid){
    if (!saldoatmGroup[gid]) saldoatmGroup[gid] = {}
    if (!saldoatmGroup[gid][uid]) saldoatmGroup[gid][uid] = { saldo:0, history:[] }
    if (!Array.isArray(saldoatmGroup[gid][uid].history)) saldoatmGroup[gid][uid].history = []
    return saldoatmGroup[gid][uid]
}

// ────────────────────────────────────────────

// Import Scrape
const Ai4Chat = require('./scrape/Ai4Chat')
const tiktok2 = require('./scrape/Tiktok')
const { use } = require('react')

module.exports = async (lenwy, m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const userJid = (msg.key.participant || msg.key.remoteJid || '').replace('@lid', '@s.whatsapp.net')
    const sender = msg.key.remoteJid
    const pushname = msg.pushName || "Pita"
    const args = body.trim().split(" ")
    const command = args.shift().toLowerCase()
    const q = args.join(" ")
    const msgTimestamp = msg.messageTimestamp * 1000
    const now = Date.now()
    if (now - msgTimestamp > 30000) return

    

    const lenwyreply = (teks) => lenwy.sendMessage(sender, { text: teks }, { quoted: msg })
    const isGroup = sender.endsWith('@g.us')
    const isAdmin = (admin.includes(userJid))
    const menuImage = fs.readFileSync(image)
    const menudedeImage = fs.readFileSync(imagemenudede)
    const isdede = (dede.includes(userJid))

    console.log("sender:", sender)
    console.log("userJid:", userJid)
    console.log("admin list:", admin)
    console.log("dede:", dede)
    console.log("isAdmin:", isAdmin)
    console.log("isdede:", isdede)

    

    // pilih database sesuai chat
    const userTugas = isGroup
        ? ensuretugaspribGroup(sender, userJid)
        : ensuretugasprib(sender)
    const userTugaskelas = ensuretugaskelas(sender)
    const userSaldocash = isGroup
        ? ensureGroupcash(sender, userJid)
        : ensurePersonalcash(sender)
    const userSaldoatm = isGroup
        ? ensureGroupatm(sender, userJid)
        : ensurePersonalatm(sender)

    if (!isdede) return
switch (command) {


    
// ======= TUGAS =======

case "+tugas": {
    const matkul = args[0]
    const namaTugas = args[1]
    const dosen = args[2]
    const deadline = args.slice(3).join(" ") || "Tanpa deadline"

    if (!matkul || !namaTugas || !dosen) {
        return lenwyreply("⚠ Format salah\nContoh: !+tugas Matematika Laporan PakBudi 01-10-2025")
    }

    userTugaskelas.tugas += 1
    userTugaskelas.list.push({
        type: '+',
        matkul,
        namaTugas,
        dosen,
        deadline,
        waktu: new Date().toLocaleString('id-ID', { timeZone:'Asia/Jakarta' })
    })

    savetugas()
    lenwyreply(`✅ Tugas ditambahkan!\nMatkul: ${matkul}\nTugas: ${namaTugas}\nDosen: ${dosen}\nDeadline: ${deadline}`)
}
break

// ======== SALDO FEATURE ========

case "+cash": {
    const nominal = parseInt(args[0])
    const alasan = args.slice(1).join(' ') || 'Tanpa alasan'
    if (isNaN(nominal)) return lenwyreply("*Nominal Harus Angka*")

    userSaldocash.saldo += nominal
    userSaldocash.history.push({
        type: '+',
        nominal,
        alasan,
        sisa: userSaldocash.saldo,
        waktu: new Date().toLocaleString('id-ID', { timeZone:'Asia/Jakarta' })
    })

    saveSaldo()
    lenwyreply(` +Rp${nominal}\n Sisa: Rp${userSaldocash.saldo}\nAlasan: ${alasan}`)
}
break

case "-cash": {
    const nominal = parseInt(args[0])
    const alasan = args.slice(1).join(' ') || 'Tanpa alasan'
    if (isNaN(nominal)) return lenwyreply("*Nominal Harus Angka*")
    if (userSaldocash.saldo < nominal) return lenwyreply("⚠ Saldo Cash Tidak Cukup\n *NOTE:UTANG GA BAGUS JIR*")

    userSaldocash.saldo -= nominal
    userSaldocash.history.push({
        type: '-',
        nominal,
        alasan,
        sisa: userSaldocash.saldo,
        waktu: new Date().toLocaleString('id-ID', { timeZone:'Asia/Jakarta' })
    })

    saveSaldo()
    lenwyreply(` -Rp${nominal}\nSisa: Rp${userSaldocash.saldo}\n Alasan: ${alasan}`)
}
break

case "cash": {
    lenwyreply(`*Saldo Cash Kamu*\n\n Rp${userSaldocash.saldo}`)
}
break

case "cashhistory": {
    if (!userSaldocash.history.length) return lenwyreply(" Belum ada transaksi.")
    const list = userSaldocash.history.map((x,i)=>
        `${i+1}. [${x.waktu}]\n   ${x.type==='tambah'?'➕':'➖'} Rp${x.nominal}\n    ${x.alasan}\n    Sisa: Rp${x.sisa}`
    ).join('\n\n')
    lenwyreply(`*Riwayat Transaksi*\n\n${list}`)
}
break

case "clearcash": {
    if (!userSaldocash.history || !userSaldocash.history.length) {
        return lenwyreply("Tidak ada history Cash yang perlu dihapus.")
    }
    userSaldocash.history = []
    saveSaldo()
    lenwyreply("History Cash kamu sudah dihapus.")
}
break

case "+atm": {
    const nominal = parseInt(args[0])
    const alasan = args.slice(1).join(' ') || 'Tanpa alasan'
    if (isNaN(nominal)) return lenwyreply("*Nominal Harus Angka*")

    userSaldoatm.saldo += nominal
    userSaldoatm.history.push({
        type: '+',
        nominal,
        alasan,
        sisa: userSaldoatm.saldo,
        waktu: new Date().toLocaleString('id-ID', { timeZone:'Asia/Jakarta' })
    })

    saveSaldo()
    lenwyreply(`+Rp${nominal}\nSisa: Rp${userSaldoatm.saldo}\nAlasan: ${alasan}`)
}
break

case "-atm": {
    const nominal = parseInt(args[0])
    const alasan = args.slice(1).join(' ') || 'Tanpa alasan'
    if (isNaN(nominal)) return lenwyreply("*Nominal Harus Angka*")
    if (userSaldoatm.saldo < nominal) return lenwyreply("⚠ Saldo Atm Tidak Cukup\n *NOTE:UTANG GA BAGUS JIR*")

    userSaldoatm.saldo -= nominal
    userSaldoatm.history.push({
        type: '-',
        nominal,
        alasan,
        sisa: userSaldoatm.saldo,
        waktu: new Date().toLocaleString('id-ID', { timeZone:'Asia/Jakarta' })
    })

    saveSaldo()
    lenwyreply(`-Rp${nominal}\nSisa: Rp${userSaldoatm.saldo}\nAlasan: ${alasan}`)
}
break

case "atm": {
    lenwyreply(`*Saldo atm Kamu*\n\nRp${userSaldoatm.saldo}`)
}
break

case "atmhistory": {
    if (!userSaldoatm.history.length) return lenwyreply("Belum ada transaksi.")
    const list = userSaldoatm.history.map((x,i)=>
        `${i+1}. [${x.waktu}]\n   ${x.type==='tambah'?'➕':'➖'} Rp${x.nominal}\n   ${x.alasan}\n   Sisa: Rp${x.sisa}`
    ).join('\n\n')
    lenwyreply(`*Riwayat Transaksi*\n\n${list}`)
}
break

case "clearatm": {
    if (!userSaldoatm.history || !userSaldoatm.history.length) {
        return lenwyreply("Tidak ada history Atm yang perlu dihapus.")
    }
    userSaldoatm.history = []
    saveSaldo()
    lenwyreply("History Atm kamu sudah dihapus.")
}
break


// ======== OTHER MENU (TETEP SAMA) ========

case "menu": {
    await lenwy.sendMessage(sender,{
        text: pitamenu,
        mentions: [sender]
    },{ quoted: msg })
}
break

case "menudede": {
    if (!isdede) return lenwyreply(mess.dede)
    await lenwy.sendMessage(sender,{
        image: fs.readFileSync(imagemenudede),  
        text: dedemenu,
        mentions: [sender]
    },{ quoted: msg })
}
break
// Only Admin
case "admin": {
    if (!isAdmin) return lenwyreply(mess.admin)
    lenwyreply("🎁 *Kamu Adalah Admin*")
}
break

// Only Group
case "group": {
    if (!isGroup) return lenwyreply(mess.group)
    lenwyreply("🎁 *Kamu Sedang Berada Di Dalam Grup*")
}
break


// ======== Menu itulah ========

case "dede":{
    if (!isdede) return lenwyreply(mess.dede)
    await lenwy.sendMessage(sender,{
        image: menudedeImage,  
        caption: "hai",
        mentions: [userJid]
    },{ quoted: msg })
}
break

case "dedekangen":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply("emg dasar kamu ini kangenan, maaf yaa dedeee kalau mas gabisa nemenin dede atau balas chat dede, mas disini mungkin lagi sibuk entah itu lagi ada jam kuliah ataupun lagi ngelab, mas jg kangen dede kok, maaf ya dede kalau mas gbisa nemenin dede ataupun selalu sibuk nanti kalau mas ga sibuk ataupun ada Waktu buat dede pasti langsung wa dede kok, sabar ya saying, maaf juga kalau mas gbisa ngabarin dede ataupun lupa untuk ngabarin. kalau emg dede bosen ataupun bingung mau ngapain, main game aja gapapa ya sayang, atau istirahat gitu Setelah mas selesai sama urusan mas yang disini pasti langsung ngabarin dede kok dan pasti akan nemenin dede, okay? maaf ya sayang klo belum bisa bales kamu sayang, sabar nggehh anak kecillkuu.")
}
break

case "massibuk?":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply("Iyaa sayangkuu, kalau mas masih gbisa bales dede ataupun nemenin dede berarti mas masih sibuk disini nggehh dedeee, maaf ya sayanggg nanti kalau mas sudah ga sibuk atau sudah jam istirahat pasti ngabarin dede kok, maaf yaa kalau sering mas tinggal sayang. dede sabar aja yaaa kalau dede kesepian main game aja nggeh, atau istirahat atau nonton ig yt aja nggehh, atau g klo di bot ini ada game game kecil kecilan gt main it aj, nanti klo mas udh ga sibuk mas temenin kok okay?? maaf yaa sayangg klo sering mas tinggal tinggalinnn. sabar yaa sayang, maaf yaa kalau sering mas tinggalin, nanti kalau mas udh ga sibuk pasti langsung ngabarin dede kok, maaf yaa sayang klo sering mas tinggalinnn. sabar yaa sayang, maaf yaa kalau sering mas tinggalin, nanti kalau mas udh ga sibuk pasti langsung ngabarin dede kok")
}
break
case "masjgnanehaneh":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply("Iyaa dedekuuu, mas ga akan aneh aneh disini, mas disini jg cuma focus buat ngejar ilmu aja okay? mas akan selalu jaga hati, karena di dalam hati mas cuma ada dede, ga akan ada yang lain kok. Dede gausah takut atau mikir yang engga engga ya sayangkuu, mas ga akan pernah deket sama cewe lain ataupun ninggalin dede, mas disini cuma focus kuliah aja, ataupun klo ngelab focus untuk ngelab untuk robot aja okay? mas g akan ngelakuin apapun selain itu yaaa dedee, dede ga perlu takut okay? mas jg minta maaf klo semisal di lab mas kayak duduknya deket sama cewe atau gmn, tp mas selalu nyari tempat yang paling jauh dari cewe kok, soalnya di lab jg kan sempit gitu, jadi mungkin gbisa sejauh itu, tp pasti mas nyari tempat yang paling jauh kok okay? dan mas jg paling duduk deket gt klo lagi kumpul, klo ngerjain sesuatu jg pasti ngejauh kok, ga akan deket deket okay? dede ga perlu takut ataupun cemas, mas selalu jaga Jarak maupun hati disini untuk dede okay? ")
}
break
case "kabarindede":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply("Maafff yaa dede kalau mas gbisa ngabarin dede ataupun lupa untuk ngabarin dede lewat video note maupun ketikan, mungkin mas terlalu sibuk ataupun lagi buru buru sayang, soalnya mas sering gt karena kadang dosennya masuk secara tiba tiba ataupun ya rame gt, jadi kayak susah, kadang mas jg gbisa bebas ngevid gt aja, emg sih kadang bisa langsung blak blak kan didepan temenku, it karena ak udh lumayan deket sama mereka dan g akan canggung gt, jadi walau gt jg cuma ku buat bercandaan, ga ada kayak ngamuk atau gmn gt, tp klo sama yg lain yang blm terlalu kenal gitu ak jg kadang masih malu, atau sama org yg kayak sinis gt, takutnya di ejek atau gmn jg sih ak, jadi maaf yaaa klo emg belum bisa ngabarin ataupun lupa yaa. Mas disini ga akan pernah aneh aneh kok, mas cuma kuliah doang disini okay? Sekali lagi maaf yaa dedekuuuu")
}
break
case "masihlamata?":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply(jadwal)
}
break
case "reminderdede":{
    if (!isdede) return lenwyreply(mess.dede)
    lenwyreply("Hi anak kecil, mas disini cuma mau ngingetin dede aja sih, klo emg dede mau ngapa ngapain kabarin mas ya, gabisa vid gapapa yang penting ada foto dede dan ngomong sama mas dede mau ngapain okay? dan dede jg disana jangan aneh aneh yaa, gapapa klo emg sekelompok ada cowo atau gimana, asal jangan terlalu deket okay? asal dede cuma ngomong sama dia perihal apa yg dibutuhkan dikelompok doang gapapa, tp klo km ngobrolnya bukan perihal kelompok ataupun masalah pribadi, jangan ya. atau bahkan cuma react yang ga dibutuhin. intinya kamu jangan pernah aneh aneh lagi, mas disini jg ga akan aneh aneh, jadi dede jg jangan aneh aneh ya. dan jg dede jangan lupa untuk makan ya, klo udh g puasa makan 3x sehari ya. Jangn pernah lupa loh ya. selalu kbarin jg klo mu ngapa ngpain ya.")
}
break


// AI Chat
case "ai": {
    if (!q) return lenwyreply("☘️ *Contoh:* !ai Apa itu JavaScript?")
    lenwyreply(mess.wait)
    try {
        const lenai = await Ai4Chat(q)
        await lenwyreply(`*Pita AI*\n\n${lenai}`)
    } catch (e) {
        console.error(e)
        lenwyreply(mess.error)
    }
}
break

// TikTok
case "ttdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Tiktoknya?*")
    lenwyreply(mess.wait)
    try {
        const result = await tiktok2(q)
        await lenwy.sendMessage(sender,{
            video:{ url: result.no_watermark },
            caption:`*🎁 Pita Tiktok Downloader*`
        },{ quoted: msg })
    } catch (e) {
        console.error(e)
        lenwyreply(mess.error)
    }
}
break

// IG Downloader (tetep sama)
case "igdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Instagramnya?*")
    try {
        lenwyreply(mess.wait)
        const apiUrl = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(q)}`
        const response = await axios.get(apiUrl)
        const data = response.data.data[0]
        if (!data) throw new Error("Gagal")
        await lenwy.sendMessage(sender, {
            video: { url: data.url },
            caption: `*🎁 Pita Instagram Downloader*`
        }, { quoted: msg })
    } catch (e) {
        console.error(e)
        lenwyreply(mess.error)
    }
}
break

// Game Tebak Angka
case "tebakangka": {
    const target = Math.floor(Math.random() * 100)
    lenwy.tebakGame = { target, sender }
    lenwyreply("*Tebak Angka 1 - 100*\n*Ketik !tebak [Angka]*")
}
break

case "tebak": {
    if (!lenwy.tebakGame || lenwy.tebakGame.sender !== sender) return
    const guess = parseInt(args[0])
    if (isNaN(guess)) return lenwyreply("❌ *Masukkan Angka!*")
    if (guess === lenwy.tebakGame.target) {
        lenwyreply(`🎉 *Tebakkan Kamu Benar!*`)
        delete lenwy.tebakGame
    } else {
        lenwyreply(guess > lenwy.tebakGame.target ? "*Terlalu Tinggi!*" : "*Terlalu Rendah!*")
    }
}
break

case "aquote": {
    const quotes = [
        "Jangan menyerah, hari buruk akan berlalu.",
        "Kesempatan tidak datang dua kali.",
        "Kamu lebih kuat dari yang kamu kira.",
        "Hidup ini singkat, jangan sia-siakan."
    ]
    const randomQuote = quotes[Math.floor(Math.random()*quotes.length)]
    lenwyreply(`*Quote Hari Ini :*\n_"${randomQuote}"_`)
}
break


} // switch
}
