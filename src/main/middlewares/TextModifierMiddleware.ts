const debug = require('debug')('yuki:textInterceptor')
interface TextReplacementRule {
  pattern: RegExp
  replacement: string
}
export default class TextInterceptorMiddleware implements yuki.Middleware<yuki.TextOutputObject> {
  private removeAscii: boolean
  private deduplicate: boolean
  private delineBreak: boolean
  private TextReplacementRules: TextReplacementRule[]
  constructor(config: yuki.Config.Texts['modifier']) {
    this.removeAscii = config.removeAscii
    this.deduplicate = config.deduplicate
    this.delineBreak = config.delineBreak
    this.TextReplacementRules = [
      { pattern: /[\x00-\x20]+/g, replacement: '' }, // 去除特殊符号和控制字符
      { pattern: /_t.*?\//g, replacement: '' },
      { pattern: /[【】]/g, replacement: '' }
    ]
    if (this.removeAscii) {
      this.TextReplacementRules.push({ pattern: /[\x00-\xFF]+/g, replacement: '' })
    }
    if (this.deduplicate) {
      this.TextReplacementRules.push({ pattern: /([^]+?)\1+/g, replacement: '$1' })
    }
    if (this.delineBreak) {
      this.TextReplacementRules.push({ pattern: /_r|<br>|#n|\s+/g, replacement: '' })
    }
    debug('initialized')
  }

  public async process(
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => Promise<void>
  ): Promise<void> {
    this.TextReplacementRules.forEach((rule) => {
      context.text = context.text.replace(rule.pattern, rule.replacement)
    })
    if (context.text !== '') {
      await next(context)
    } else {
      debug('Processed text is empty after modifications.')
    }
  }
}
