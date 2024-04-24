const debug = require('debug')('translator:baiduTranslator')
async function translateBaidu(text) {
    const TRANSLATE_URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35'
    const axios = this.axios;
    const crypto = this.crypto;
    // 百度翻译API
    const appid = ''
    // 百度翻译API密钥
    const key = ''
    const from = 'auto';
    const to = 'zh';
    const salt = (new Date).getTime();
    const sign = crypto.createHash('md5').update(appid + text + salt + key).digest('hex');
    try {
        const response = await axios.get(TRANSLATE_URL, {
            headers: {
                'User-Agent': USER_AGENT,
            },
            params: {
                q: text,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            }
        });
        const data = response.data;
        if (data && data.trans_result) {
            const result = data.trans_result.map(item => item.dst).join(' ');
            this.result = result
        } else {
            debug('BaiDuTranslation error:', data)
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
translateBaidu(text);