const debug = require('debug')('yuki:filter')
export default class FilterMiddleware implements yuki.Middleware<yuki.TextOutputObject> {
  public async process(
    context: yuki.TextOutputObject,
    next: (newConetxt: yuki.TextOutputObject) => Promise<void>
  ): Promise<void> {
    debug('[%d]%s', context.handle, context.text)
    context.code = `/${context.code}`
    await next(context)
  }
}
