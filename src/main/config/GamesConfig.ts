import Config from './Config'

export default class GamesConfig extends Config {
  constructor() {
    super()
  }
  public getFilename(): string {
    return 'games'
  }
  public get() {
    return this.config.games
  }
  public async set(cfg: any) {
    this.config.games = cfg
    await this.save()
  }

  protected getDefaultObject(): { games: yuki.Config.Games } {
    return { games: [] }
  }
}
