//redis管理类，后续实现这个类的功能，正在开发中
import Redis from 'ioredis'
import { logger } from '../Log/LogCollector'
interface WordInfo {
  result: string;
  mp3Url: string;
  reading: string;
  romaji: string
}
export default class StoreInRedis {
  private redis: Redis
  public static getInstance(): StoreInRedis {
    if (!this.instance) {
      this.instance = new StoreInRedis()
    }
    return this.instance
  }
  constructor() {
    this.redis = new Redis({
      host: "localhost",
      port: 6379,
    })
    this.redis.on('connect', () => {
      console.log('Connected to Redis');
      this.updateFrontend(true);
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
      this.updateFrontend(false);
    });

    this.redis.on('close', () => {
      console.log('Redis connection closed');
      this.updateFrontend(false);
    });
  }
  private static instance: StoreInRedis | undefined
  public async storeWordInfo(wordKey: string, text: string, translation: string, audioUrl: string, reading: string, romaji: string, saveInAnki: string): Promise<void> {
    try {
      await this.redis.hset(wordKey, 'orininalText', text, 'translation', translation, 'audioUrl', audioUrl,
        'reading', reading, 'romaji', romaji, 'saveInAnki', saveInAnki)
      logger.debug('The message has been store!%s', wordKey);
    } catch (error) {
      logger.debug('store in redis meet error!%s', error)
      logger.debug('fail to store in redis!')
    }
  }
  //检测redis是否连接
  private updateFrontend(connected: boolean) {
    console.log('Updating frontend, Redis connected:', connected);
    window.mainApi.checkRedisStatus(connected)
  }
  // 获取单词信息
  public async getWordInfo(wordKey: string): Promise<WordInfo | null> {
    logger.debug("rearching wordKey:", wordKey);
    const result = await this.redis.hgetall(wordKey)
    if (result.translation && result.audioUrl) {
      logger.debug('translation is', result.translation)
      logger.debug('audioUrl is', result.audioUrl)
      return {
        result: result.translation,
        mp3Url: result.audioUrl,
        reading: result.reading,
        romaji: result.romaji
      }
    }
    else {
      logger.debug('cant find wordKey:', wordKey);
      logger.debug('cant find message in redis!')
      throw new Error('cant find wordKey' + wordKey);
    }
  }
  // 删除单词信息
  public async deleteWordInfo(wordKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.redis.del(wordKey)
      if (result === 1) {
        logger.debug('success delete message!', wordKey);
        return { success: true }
      } else {
        logger.debug('the message not exist!', wordKey);
        return { success: false, error: 'Message in redis not exist!' }
      }
    }
    catch (error: any) {
      logger.debug('delete message fialure', error.message)
      return { success: false, error: error.message }
    }
  }
  // 删除所数据信息
  public async deleteAllWordInfo(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.redis.flushall()
      logger.debug('has been delete all message!')
      return { success: true }
    } catch (error: any) {
      logger.debug('delete all message failure!', error)
      return { success: false, error: error.message }
    }
  }
  // 设置过期时间
  public async setOutTime(wordKey: string, time: number): Promise<void> {
    try {
      await this.redis.expire(wordKey, time)
      logger.debug('set the outdata time:', time)
    } catch (error) {
      logger.debug('failure to set time', wordKey)
      logger.debug('the error is:', error)
    }
  }
  // 检查剩余时间
  public async checkTTL(wordKey: string): Promise<number> {
    try {
      const result = await this.redis.ttl(wordKey)
      logger.debug('the last of time is:', result)
      return result
    } catch (error) {
      logger.debug('check the last of time failure!', error)
      throw new Error('检查剩余时间失败')
    }
  }
  // 检查单词是否存在
  public async checkWordInfo(wordKey: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(wordKey)
      if (result === 1) {
        logger.debug(`the ${wordKey} exist!`)
        return true
      } else {
        logger.debug(`the ${wordKey} not exist!`)
        return false
      }
    } catch (error) {
      logger.debug('check the wordkey error')
      throw new Error(`检查${wordKey}失败`)
    }
  }
  // 检查所有键
  public async checkAllKeys(): Promise<string[]> {
    try {
      const result = await this.redis.keys('*')
      logger.debug(`all keys: ${result}`);
      return result
    } catch (error) {
      logger.debug('check the wordkey error')
      throw new Error(`检查失败`)
    }
  }
  // 检查所有信息
  public async checkAllWordInfo(): Promise<{ key: string; value: Record<string, string> }[]> {
    try {
      const stream = this.redis.scanStream({
        match: '*',
        count: 100
      });
      const keys: string[] = [];
      for await (const key of stream) {
        keys.push(...key);
      }
      const results: { key: string; value: Record<string, string> }[] = [];
      for (const key of keys) {
        const value = await this.redis.hgetall(key);
        results.push({ key, value });
      }
      logger.debug(`all message: ${JSON.stringify(results)}`);
      return results;
    } catch (error) {
      console.error(error);
      logger.debug('check the all message error')
      throw new Error('检查所有信息失败!');
    }
  }
  // 退出连接
  public quit() {
    this.redis.quit()
  }
}