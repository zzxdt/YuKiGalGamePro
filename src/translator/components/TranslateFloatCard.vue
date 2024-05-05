<template>
  <div
    class="manageSpan"
    :data-key="datakey"
    :style="updataMecabPadding"
    @click="openDialog"
    :data-reading="reading"
    @mouseenter="handleMouseEnter"
  >
    <span class="reading-item" :style="updataMecabReading">
      {{ reading }}
    </span>
    <span class="word-item" :style="updataMecabText">
      {{ text }}
    </span>
  </div>
</template>
<script setup>
import { defineProps, computed } from 'vue'
import { TranslatorHookStore } from '../store/module/Hook'
import { TranslatorConfigStore } from '../store/module/Config'
import { throttle } from 'lodash'
const useTranslatorHookStore = TranslatorHookStore()
const useTranslatorConfigStore = TranslatorConfigStore()
const redisIsEnable = computed(() => useTranslatorConfigStore.getRedisIsEnable)
// 检查redis中是否存在单词
const checkRedisExist = computed(() => useTranslatorHookStore.getCheckRedisExist)
const props = defineProps({
  datakey: String,
  text: String,
  color: String,
  word: String,
  romaji: String,
  pos: String,
  baseform: String,
  kreading: String,
  reading: String
})
const updataMecabText = computed(() => {
  const style = useTranslatorConfigStore.getMecabText
  if (style && style.fontSize) {
    return {
      fontSize: `${style.fontSize}em`
    }
  } else {
    return {
      fontSize: '1.5em'
    }
  }
})
const updataMecabPadding = computed(() => {
  const style = useTranslatorConfigStore.getMecabText
  if (style && style.fontPadding) {
    return {
      fontPadding: `${style.fontPadding}`,
      color: props.color
    }
  } else {
    return {
      fontPadding: '0.1em',
      color: props.color
    }
  }
})
const updataMecabReading = computed(() => {
  const style = useTranslatorConfigStore.getMecabReading
  if (style && style.fontSize) {
    return {
      fontSize: `${style.fontSize}`
    }
  } else {
    return {
      fontSize: '0.6em'
    }
  }
})
const handleMouseEnter = throttle(async () => {
  const word = props.word
  const wordKey = props.datakey
  const reading = props.reading || props.kreading
  const romaji = props.romaji
  const saveInAnki = '0'
  await useTranslatorHookStore.checkWordInAnki(word)
  // 检查redis是否代开，如果打开了，就先检查否则直接翻译
  if (redisIsEnable.value) {
    await useTranslatorHookStore.checkWordInRedis(wordKey)
    const exist = checkRedisExist.value
    if (!exist) {
      //不存在翻译，存在redis读取结果
      await useTranslatorHookStore.translateMecabText(wordKey, word, reading, romaji, saveInAnki)
    } else {
      await useTranslatorHookStore.getRedisMecabInfo(wordKey)
    }
  } else {
    await useTranslatorHookStore.translateMecabText(
      wordKey,
      word,
      word,
      reading,
      romaji,
      saveInAnki
    )
  }
}, 1500)
const openDialog = () => {
  useTranslatorHookStore.handleMecabTranslationTextInfo(
    props.word,
    props.romaji,
    props.pos,
    props.baseform,
    props.kreading,
    props.reading
  )
  useTranslatorHookStore.setDialog(true)
}
</script>

<style scoped>
.manageSpan {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.1em;
  cursor: pointer;
}

.manageSpan:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.word-item {
  font-size: 1.5em;
}

.reading-item {
  font-size: 0.5em;
}

/* .word-item {
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  font-size: 1.5em;
  margin-bottom: 0.6em;
  padding: 0 0.2em;
} */

/* .word-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
};

.manageSpan {
  display: inline-block
} */
</style>
