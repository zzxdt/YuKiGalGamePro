const baseAnkiUrl: string = 'http://127.0.0.1:8765'
import { AddWordInAnki } from "../ankiTranslator/AddAnkiWord";
import { checkWordExistsInAnki } from "../ankiTranslator/CheckWordInAnki";
import { deleteWordFromAnki } from "../ankiTranslator/RemoveWordFromAnki";
interface AnkiAddNoteResponse {
  success: boolean;
  error?: string;
}
export default class AnkiManager {
  private baseAnkiUrl: string
  private deckName = 'GalGame'
  public static getInstance(): AnkiManager {
    if (!this.instance) {
      this.instance = new AnkiManager()
    }
    return this.instance
  }
  constructor() {
    this.baseAnkiUrl = baseAnkiUrl
  }
  private static instance: AnkiManager | undefined
  public async addInAnki(original: string, reading: string, translation: string, audioURL: string): Promise<AnkiAddNoteResponse> {
    return AddWordInAnki(original, reading, translation, audioURL, this.baseAnkiUrl)
  }
  public async checkInAnki(original: string): Promise<boolean> {
    return checkWordExistsInAnki(original, this.baseAnkiUrl)
  }
  public async removeWordFromAnki(orininal: string): Promise<boolean> {
    return deleteWordFromAnki(this.deckName, orininal, this.baseAnkiUrl)
  }
}