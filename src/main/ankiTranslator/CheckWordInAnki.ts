import axios from 'axios'
export async function checkWordExistsInAnki(
  frontText: string,
  baseAnkiUrl: string
): Promise<boolean> {
  try {
    const response = await axios.post(baseAnkiUrl, {
      action: 'findNotes',
      version: 6,
      params: {
        query: `deck:GalGame text:"${frontText}"` // 根据实际情况调整查询条件
      }
    })
    if (response.data.result.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error checking card in Anki:', error)
    return false
  }
}
