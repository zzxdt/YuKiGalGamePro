const debug = require('debug')('yuki:textInterceptor')

export default class TextInterceptorMiddleware implements yuki.Middleware<yuki.TextOutputObject> {
  private static DEFAULT_MAX_LENGTH = 1000
  private maxLength: number
  private shouldBeIgnorePatterns: string[]
  private ignoreAsciiOnly: boolean

  constructor(config: yuki.Config.Texts['interceptor']) {
    this.shouldBeIgnorePatterns = config.shouldBeIgnore
    this.ignoreAsciiOnly = config.ignoreAsciiOnly
    this.maxLength = config.maxLength
      ? config.maxLength
      : TextInterceptorMiddleware.DEFAULT_MAX_LENGTH
    debug('initialized')
  }
  public async process(
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => Promise<void>
  ) {
    // 如果包含shouldBeIgnore[]中内容就去除
    context.text = this.removeIgnorePatterns(context.text)
    debug('the Arry in shouldBeIgnore has been removed!')
    // 超出长度就直接返回
    if (this.isTooLong(context.text)) return
    // 利用ignoreAsciiOnly属性判断是否忽略ascii字符
    if (this.ignoreAsciiOnly && this.isAsciiOnly(context.text)) return
    await next(context)
  }
  private isTooLong(text: string) {
    debug('the orininal text too long!')
    return text.length > this.maxLength
  }
  private removeIgnorePatterns(text: string) {
    this.shouldBeIgnorePatterns.forEach(pattern => {
      text = text.replace(new RegExp(pattern, 'g'), '')
    })
    return text
  }
  private isAsciiOnly(text: string) {
    return /^[\x00-\xFF]*$/.test(text)
  }
}
