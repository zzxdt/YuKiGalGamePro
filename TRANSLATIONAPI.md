# 📒 **翻译API**  
> 所有的api皆在沙盒中运行,创建沙盒的时候已经提供**axios**和**crypto**模块,
>在编写新的翻译api的时候,如果想引用这2个模块的时候直接编写  
> + **const axios = this.axios**  
> + **const crypto = this.crypto**
>
>即可.下面是沙盒js文件**sandbox.js**,编写好的api,能在此处运行,则可以直接放入translteApi中
```  
const path = require('path')
const fs = require('fs')
const vm = require('vm')
const axios = require('axios')
const crypto = require('crypto')
//引入翻译api
const baiduTranslateScript = fs.readFileSync(path.resolve(__dirname, './baidu.js'), 'utf-8')
async function createVmContext() {
    const context = {
        axios: axios,
        crypto: crypto,
        result: '',
        text: '',
        mp3Url: '',
        console: console
    };
    vm.createContext(context);
    return context;
}
async function translate(text) {
    const sandbox = await createVmContext();
    sandbox.text = text; // 将要翻译的文本赋值给上下文中的text
    try {
        await vm.runInContext(youdaoTranslateScript, sandbox, { displayErrors: true });
        // await new Promise(resolve => setTimeout(resolve, 500));
        if (sandbox.result) {
            console.log('Translation result:', sandbox.result);
            console.log('MP3 Url:', sandbox.mp3Url);
            return sandbox.result;
        } else {
            console.error('翻译失败:', sandbox.result);
            return sandbox.result;
        }
    } catch (error) {
        console.error('执行脚本时出错:', error);
        reject(error);
    }
}
createVmContext()
//测试句子,请将要测试翻译的句子放在此处
translate('')
```
测试百度翻译api示例:
```
async function translateBaidu(text) {
  const TRANSLATE_URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
  const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35'
  const axios = this.axios
  const crypto = this.crypto
  const appid = ''
  const key = ''
  const from = 'auto'
  const to = 'zh'
  const salt = new Date().getTime()
  const sign = crypto
    .createHash('md5')
    .update(appid + text + salt + key)
    .digest('hex')
  try {
    const response = await axios.get(TRANSLATE_URL, {
      headers: {
        'User-Agent': USER_AGENT
      },
      params: {
        q: text,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
      }
    })
    const data = response.data
    if (data && data.trans_result) {
      const result = data.trans_result.map((item) => item.dst).join(' ')
      this.result = result
    } else {
      debug('BaiDuTranslation error:', data)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
translateBaidu(text)

```
可以在自己的vscode中，试着运行sandbox.js文件，关于这个mp3rul是有道云的tts语音合成,
如果翻译api不支持的话请忽视
