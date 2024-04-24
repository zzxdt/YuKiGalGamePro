import { toHiragana, toRomaji, isKanji, isKatakana } from 'wanakana'
const Mecab = require('mecab-lite')
const debug = require('debug')('yuki:mecabDebug')
export default class MecabMiddleWare implements yuki.Middleware<yuki.TextOutputObject> {
  public static readonly KANJI_TO_ABBR_MAP = {
    人名: 'm', // name
    地名: 'mp', // place
    名詞: 'n', // noun
    数詞: 'num', // number
    代名詞: 'pn', // pronoun
    動詞: 'v', // verb
    形状詞: 'a', // 
    連体詞: 'adn', // adnominal, 
    形容詞: 'adj', // adjective
    副詞: 'adv', // adverb
    助詞: 'p', // 動詞 = particle
    助動詞: 'aux', // 助動詞 = auxiliary verb
    接尾辞: 'suf', // suffix
    接頭辞: 'pref', // prefix
    感動詞: 'int', // interjection
    接続詞: 'conj', // conjunction
    補助記号: 'punct', // punctuation
    記号: 'w' // letters
  }
  // 字体颜色
  public static readonly ABBR_TO_COLOR_MAP = {
    m: '#FFFFFF', // 人名，白色
    mp: '#9cffcd', // 地名，
    n: '#9cffcd', // 名词，天蓝色
    num: '#B39DDB', // 数词，淡紫色
    pn: '#FFD54F', // 代名词，明亮的黄色
    v: '#4DB6AC', // 动词，海蓝色
    a: '#AED581', // 形状词，草绿色
    adn: '#BA68C8', // 连体词，浅紫色
    adj: '#FF8A65', // 形容词，柔和的橙色
    adv: '#4FC3F7', // 副词，浅蓝色
    p: '#F6BF26', // 助词，金色
    aux: '#FFFFFF', // 助动词，
    suf: '#9575CD', // 接尾辞，淡紫
    pref: '#7986CB', // 接頭辞，浅蓝紫色
    int: '#DCE775', // 感动词，黄绿色
    conj: '#A1887F', // 接続詞，褐灰色
    punct: '#E0E0E0', // 補助記号，亮灰色，保证在深色背景下的可见性
    w: '#FFCDD2' // 记号，淡粉色
  }
  private mecab: any

  constructor(config: yuki.Config.Libraries['mecab']) {
    if (!config) {
        debug('MeCab middleware is disabled due to config');
      return;
    }
    try {
      this.mecab = new Mecab()
        debug('MeCab middleware enabled');
    }
    catch (error) {
        debug('Failed to initialize MeCab:', error);
    }
  }
  public async process(context: yuki.TextOutputObject, next: (newContext: yuki.TextOutputObject) => Promise<void>) {
    if (!this.mecab) {
      await next(context)
      return
    }
    try {
      // 得到mecab分词  异步or同步?
      const textResults = this.parseTextSync(context.text)
      // 去掉最后的 数组
      textResults.pop()
      // 经过mecab处理的文本
      const formattedText = this.formatResults(textResults);
      // 格式化的文本 分词结构
      context.formattedText = formattedText
        debug('get success mecab text:', formattedText)
      await next(context);
    } catch (error) {
        debug('Failed to parse text:', error)
    }
  }
  private parseTextSync(text: string): string[][] {
      debug('mecab parseSync method has been use!')
    return this.mecab.parseSync(text)
  }
  // 异步方法，确实很快性能高一些，但是文本相比较于同步方法还是会略过很多
  // 先写好了，以后再说
  private parseText(text: string): Promise<string[][]> {
    return new Promise<string[][]>((resolve, reject) => {
      this.mecab.parse(text, (err: any, result: string[][]) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  private formatResults(formateTexts: string[][]) {
      debug('start to formate mecab result!')
      debug('formate mecab original result is:', formateTexts)
    const japanesePunctuation = ". 、, [] 〜 、！？「」『』【】〝〟〰〽ゝゞ・*";
    return formateTexts.map((result, index) => {
      const word = result[0] === '*' ? '' : result[0];; //原型
      const pos = result[1] === '*' ? '' : result[1]; // 词性
      const katakanareading = result[result.length - 1]; //片假名读音
      const romaji = toRomaji(result[result.length - 1]); //罗马字
      const baseForm = result[3] === '*' ? result[0] : result[3];
      let reading = ''
      const key = `word_${word}`; //查询redis的key
      const textColor = MecabMiddleWare.ABBR_TO_COLOR_MAP[MecabMiddleWare.KANJI_TO_ABBR_MAP[pos]] // 词性对应的颜色
      // 检查是否为汉字或片假名，并且不是日语标点
      if (isKanji(word) && !japanesePunctuation.includes(word)) {
        reading = toHiragana(result[result.length - 1] || '');
      }
      return `<span  style="color:${textColor}"  
        word="${word}" datakey="${key}" romaji="${romaji}" pos="${pos}" baseform="${baseForm}" kreading="${katakanareading}" reading="${reading}"
      >${word}
      </span>`;
    }).join('')
  }
}
