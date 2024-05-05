const axios = this.axios
const crypto = this.crypto
const from = 'auto'
const to = 'zh'
const debug = require('debug')('translator:TencentTranslator')
USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35'
const SecretId = ''
const SecretKey = ''
const sign = (secretKey, signStr, date) => {
  let SecretDate = crypto
    .createHmac('sha256', 'TC3' + secretKey)
    .update(date)
    .digest()
  let SecretService = crypto.createHmac('sha256', SecretDate).update('tmt').digest()
  let SecretSigning = crypto.createHmac('sha256', SecretService).update('tc3_request').digest()
  return crypto.createHmac('sha256', SecretSigning).update(signStr).digest('hex')
}

const hash = (str) => {
  let hash = crypto.createHash('sha256')
  return hash.update(str).digest('hex')
}
const client = {
  path: '/',
  credential: {
    SecretId,
    SecretKey
  },
  region: 'ap-shanghai',
  apiVersion: '2018-03-21',
  endpoint: 'tmt.tencentcloudapi.com'
}
const formatRequestData = (action, params) => {
  let headers = {
    Host: client.endpoint,
    'X-TC-Action': action,
    'X-TC-Region': client.region,
    'X-TC-Timestamp': Math.round(Date.now() / 1000),
    'X-TC-Version': client.apiVersion,
    'X-TC-RequestClient': 'APIExplorer',
    'X-TC-Language': 'zh-CN',
    'Content-Type': 'application/json'
  }

  const date = new Date(Date.now()).toISOString().slice(0, 10)
  const service = 'tmt'
  const CredentialScope = `${date}/${service}/tc3_request`
  const requestStr = formatSignString(params)
  const signStr = `TC3-HMAC-SHA256\n${headers['X-TC-Timestamp']}\n${CredentialScope}\n${hash(requestStr)}`
  const signature = sign(SecretKey, signStr, date)

  headers['Authorization'] =
    `TC3-HMAC-SHA256 Credential=${SecretId}/${CredentialScope}, SignedHeaders=content-type;host, Signature=${signature}`

  return {
    headers,
    body: JSON.stringify(params.body)
  }
}

const formatSignString = (params) => {
  return `POST\n${client.path}\n\ncontent-type:application/json\nhost:${client.endpoint}\n\ncontent-type;host\n${hash(JSON.stringify(params.body))}`
}
const requestTranslation = async (text) => {
  let params = {
    body: {
      SourceText: text,
      Source: from,
      Target: to,
      ProjectId: 0
    }
  }

  let { headers, body } = formatRequestData('TextTranslate', params)

  try {
    const response = await axios.post(`https://${client.endpoint}${client.path}`, body, {
      headers
    })
    const result = response.data.Response.TargetText
    this.result = result
  } catch (error) {
    debug(`Error during translation: ${error}`)
  }
}

requestTranslation(text)
