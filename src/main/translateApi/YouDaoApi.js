const axios = this.axios
const crypto = this.crypto
const debug = require('debug')('translator:YouDaoTranslator')
function createInput(q) {
  if (q.length <= 20) return q;
  return q.substring(0, 10) + q.length + q.substring(q.length - 10);
}
function createSignature(appid, query, salt, curtime, appKey) {
  const input = createInput(query)
  const str = appid + input + salt + curtime + appKey
  return crypto.createHash('sha256').update(str).digest('hex')
}
async function youdaoTranslate(text) {
  const youdaoUrl = "https://openapi.youdao.com/api"
  //有道翻译密钥
  const appKey = ""
  const appSecret = ""
  const from = "ja"
  const to = "zh-CHS"
  const salt = crypto.randomUUID()
  const curTime = Math.floor(Date.now() / 1000);
  const ext = "mp3"
  const voice = 0
  const speed = 1
  const volume = 3
  const voiceName = "youkejiang"
  const sign = createSignature(appKey, text, salt, curTime, appSecret)
  const params = {
    q: text,
    from: from,
    to: to,
    appKey: appKey,
    salt: salt,
    sign: sign,
    signType: 'v3',
    curtime: curTime,
    voice: voice,
    speed: speed,
    volume: volume,
    voiceName: voiceName,
    ext: ext
  }
  try {
    const response = await axios.post(youdaoUrl, null, { params: params })
    const TextResult = response.data.translation[0]
    const mp3Url = response.data.speakUrl
    this.result = TextResult
    this.mp3Url = mp3Url
  } catch (e) {
    debug('YouDaoTranslator:', e)
  }
}
youdaoTranslate(text)