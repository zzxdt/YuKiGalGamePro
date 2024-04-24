// 合并中间件
const debug = require('debug')('yuki:merger')
// 
interface ITextStore {
  [handle: number]: string[]
}

interface IThreadStore {
  [handle: number]: yuki.TextOutputObject | undefined
}
export default class TextMergerMiddleware implements yuki.Middleware<yuki.TextOutputObject> {
  public static DEFAULT_TIMEOUT = 500

  private textStore: ITextStore = {}
  private threadStore: IThreadStore = {}
  private enable: boolean
  private timeout: number

  constructor(config: yuki.Config.Texts['merger']) {
    this.enable = config.enable
    if (!this.enable) {
        debug('TextMergeMiddleware is unable!')
    }
    this.timeout = config.timeout ? config.timeout : TextMergerMiddleware.DEFAULT_TIMEOUT
  }

  public async process(
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => Promise<void>
  ): Promise<void> {
    if (!this.enable) {
      await next(context)
      return
    }
    if (!this.textStore[context.handle]) {
      this.textStore[context.handle] = [context.text];
      this.threadStore[context.handle] = context;
      setTimeout(async () => {
        const mergedText = this.textStore[context.handle].join('').replace(/[\r\n]/g, '');
          debug('the mergeText is:',mergedText)
        context.text = mergedText;
        delete this.textStore[context.handle]; // 清理存储
        this.threadStore[context.handle] = undefined
        await next(context);
      }, this.timeout)
    } else {
      this.textStore[context.handle].push(context.text);
    }
  }
}
