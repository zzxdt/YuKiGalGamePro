export default class ApplicationBuilder<T> {
  // middleware Arry
  private middlewares: Array<yuki.Middleware<T>> = []
  // add a middleware to middlewareArry
  public use(middleware: yuki.Middleware<T>) {
    this.middlewares.push(middleware)
  }
  // use iterator method and the argument from 0
  public async run(initContext: T) {
    await this.iterator(initContext, 0)
  }
  // iterator method
  private async iterator(context: T, index: number):Promise<void>{
    if (index === this.middlewares.length) return
    await this.middlewares[index].process(context, async(newContext) => {
      await this.iterator(newContext, index + 1)
    })
  }
}
