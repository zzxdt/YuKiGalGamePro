import axios from "axios";
async function findNoteIdsForWord(deckName: string, orininal: string, baseAnkiUrl: string): Promise<number[]> {
  try {
    const response = await axios.post(baseAnkiUrl, {
      action: 'findNotes',
      version: 6,
      params: {
        query: `deck:"${deckName}" "text:${orininal}"`
      }
    });
    return response.data.result; // 返回找到的笔记 ID 列表
  } catch (error) {
    console.error('Error finding note IDs in Anki:', error);
    return []; // 发生错误时返回空数组
  }
}

// 删除一组笔记
async function deleteNotes(noteIds: number[], baseAnkiUrl: string): Promise<boolean> {
  try {
    const response = await axios.post(baseAnkiUrl, {
      action: 'deleteNotes',
      version: 6,
      params: {
        notes: noteIds
      }
    });
    return true; // 成功删除
  } catch (error) {
    console.error('Error deleting notes in Anki:', error);
    return false; // 删除失败
  }
}

// 组合使用查找和删除函数
export async function deleteWordFromAnki(deckName: string, orininal: string, baseAnkiUrl: string): Promise<boolean> {
  const noteIds = await findNoteIdsForWord(deckName, orininal, baseAnkiUrl);
  if (noteIds.length > 0) {
    return await deleteNotes(noteIds, baseAnkiUrl);
  } else {
    console.log("No notes found for deletion.");
    return false; 
  }
}