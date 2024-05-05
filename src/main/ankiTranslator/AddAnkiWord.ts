import axios from 'axios'
interface AnkiAddNoteResponse {
  success: boolean
  error?: string
}
export async function AddWordInAnki(
  original: string,
  reading: string,
  translation: string,
  audioURL: string,
  baseAnkiUrl: string
): Promise<AnkiAddNoteResponse> {
  try {
    await axios.post(baseAnkiUrl, {
      action: 'addNote',
      version: 6,
      params: {
        note: {
          deckName: 'GalGame', // 牌组名称
          modelName: 'BasicG', // 笔记类型
          fields: {
            text: `${original}`,
            reading: `${reading}`,
            translation: `${translation}` // 翻译内容
          },
          options: {
            allowDuplicate: false // 不允许重复的卡片
          },
          tags: ['galgameJapanese'], //标签
          audio: [
            {
              url: audioURL, // 音频文件 URL
              filename: audioURL.split('/').pop(), // 音频文件名
              fields: [
                'audioUrl' // 指定音频添加到的字段
              ]
            }
          ]
        }
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Add Word Error' }
  }
}
