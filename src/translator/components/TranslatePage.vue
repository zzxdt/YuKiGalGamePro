<template>
  <div>
    <v-container fluid class="TranslatePage">
      <v-row no-gutters v-if="isVisible">
        <v-col lg="12" md="12" sm="12">
          <!-- mecab分词打开 -->
          <v-sheet class="ma-1 transparent-sheet" rounded>
            <div ref="container"></div>
            <!-- mecab关闭正常的句子 -->
            <p v-if="showTra" :style="updataOriginalText">{{ updatedData }}</p>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <!-- 翻译的句子 -->
        <v-col lg="12" md="12" sm="12">
          <v-sheet class="ma-1 transparent-sheet" rounded>
            <p :style="updataTranslationText">{{ translationOriginalText }}</p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!-- 对话框卡片 -->
    <v-dialog v-model="dialogVisible" @click:outside="closeDialog" width="auto" absolute>
      <v-card width="auto" max-width="400" class="vcard" color="mecabCardTitle">
        <v-card-text class="vcardtext">
          <!-- 上半部分，包括原文、平假名和发音按钮 -->
          <v-row class="mb-2" align="center">
            <v-col cols="8">
              <div class="text-caption grey--text">原文:{{ word }} </div>
              <div class="text-caption grey--text">翻译:{{ result }} </div>
              <div class="text-caption grey--text">罗马字:{{ romaji }}</div>
            </v-col>
            <v-col cols="4" class="d-flex flex-column justify-end">
              <div>
                <audio ref="audioPlayer" :src="audioURL" @ended="onAudioEnded"></audio>
                <v-btn icon @click="playAudio" width="25" height="25" variant="plain">
                  <v-icon>{{ isPlaying ? 'mdi-volume-high' : 'mdi-volume-medium' }}</v-icon>
                </v-btn>
              </div>
              <div v-if="ankiIsEnable">
                <v-icon :color="starred ? 'yellow' : 'grey'" @click="toggleStar">
                  {{ starred ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </div>
            </v-col>
          </v-row>
          <!-- 词性、基本型、片假名 -->
          <v-row class="mt-2">
            <v-col cols="3">
              <div class="text-caption grey--text">词性: {{ pos }}</div>
            </v-col>
            <v-col cols="3">
              <div class="text-caption grey--text">基本型: {{ baseform }}</div>
            </v-col>
            <v-col cols="3">
              <div class="text-caption grey--text">片假名: {{ kreading }}</div>
            </v-col>
            <v-col cols="3">
              <div class="text-caption grey--text">发音: {{ reading }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { TranslatorHookStore } from '../store/module/Hook'
import { TranslatorConfigStore } from '../store/module/Config'
import { TranslatorViewStore } from '../store/module/View'
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  createVNode,
  render,
  nextTick
} from 'vue'
import IpcTypes from '@/common/IpcTypes'
import { TranslateFloatCard, WrapperCardComponent } from '.'
const useTranslatorHookStore = TranslatorHookStore()
const useTranslatorConfigStore = TranslatorConfigStore()
const useTranslatorViewStore = TranslatorViewStore()
//暂停或开启翻译
const puaseTranslationText = computed(() => useTranslatorViewStore.getPauseTranslation)
const currentMecaInfo = computed(() => useTranslatorHookStore.getCurrentMecabOutput)
const mecabIsEnable = computed(() => useTranslatorConfigStore.getMecabIsEnable)
const currentHookInfo = computed(() => useTranslatorHookStore.getCurrentHookInfo)
//anki是否打开
const starred = computed(() => useTranslatorHookStore.getStarred)
const ankiIsEnable = computed(() => useTranslatorConfigStore.getAnkiIsEnable)
//计算configstore的属性
const updataOriginalText = computed(() => {
  const style = useTranslatorConfigStore.getOriginalText
  if (style && style.fontSize && style.color) {
    return {
      fontSize: `${style.fontSize}em`,
      color: style.color
    }
  } else {
    return {
      fontSize: '1em',
      color: 'white'
    }
  }
})
const updataTranslationText = computed(() => {
  const style = useTranslatorConfigStore.getTranslationText
  if (style && style.fontSize && style.margin && style.color) {
    return {
      margin: `${style.margin}em`,
      fontSize: `${style.fontSize}em`,
      color: style.color
    }
  } else {
    return {
      margin: '1em',
      fontSize: '1em',
      color: 'white'
    }
  }
})
//原文是否打开
const isVisible = computed(() => useTranslatorViewStore.getOriginalTextVisiable)
//mmecab分词span的属性
const word = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.word)
const romaji = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.romaji)
const pos = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.pos)
const baseform = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.baseform)
const kreading = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.kreading)
const reading = computed(() => useTranslatorHookStore.getMtranslationMecabInfo.reading)
const result = computed(() => useTranslatorHookStore.getMtranslationResult.result)
const audioURL = computed(() => useTranslatorHookStore.getMtranslationResult.mp3Url)
const dialogVisible = computed({
  get: () => useTranslatorHookStore.dialogIsEnabled,
  set: (value) => {
    useTranslatorHookStore.dialogIsEnabled = value
  }
})
const closeDialog = () => {
  useTranslatorHookStore.setDialog(false)
}
//储存到anki
const toggleStar = () => {
  const sword = word.value // 访问计算属性的值
  let sreading = reading.value || kreading.value
  const sresult = result.value
  const saudioURL = audioURL.value
  useTranslatorHookStore.toggleStar(sword, sreading, sresult, saudioURL)
}
//播放音频
const isPlaying = ref(false)
const audioPlayer = ref(null)
const playAudio = () => {
  if (!audioPlayer.value) return
  if (isPlaying.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0 // 重置时间，这样下次点击会重新开始
    isPlaying.value = false
  } else {
    audioPlayer.value.play()
    isPlaying.value = true
  }
}
// 当音频播放结束时触发
const onAudioEnded = () => {
  isPlaying.value = false
}
const updatedData = ref(null)
const receiveMecabSpan = ref('')
const translationOriginalText = ref(null)
const container = ref(null)
const showTra = ref(false)
watch(
  [currentMecaInfo, mecabIsEnable, currentHookInfo, puaseTranslationText],
  ([newMecaInfo, newIsEnable, newHookInfo, newPauseTranslationText]) => {
    // 深度监视立即执行！！！！
    if (newIsEnable && newMecaInfo && newMecaInfo.length > 0 && !newPauseTranslationText) {
      receiveMecabSpan.value = newMecaInfo[0]?.formattedText ?? ''
      window.mainApi.translateOrignalText(newHookInfo[0]?.text ?? '')
    } else if (newHookInfo && newHookInfo.length > 0 && !newPauseTranslationText) {
      showTra.value = true
      updatedData.value = newHookInfo[0]?.text ?? ''
      window.mainApi.translateOrignalText(newHookInfo[0]?.text ?? '')
    } else {
      updatedData.value = null
    }
  },
  {
    deep: true,
    immediate: true // 立即执行回调以初始化updatedData
  }
)
// 创建虚拟节点
const createVirturalNode = () => {
  const tempContainer = document.createElement('div')
  tempContainer.innerHTML = receiveMecabSpan.value
  const spans = tempContainer.querySelectorAll('span')
  const virtualNode = Array.from(spans).map((span) => {
    const props = {}
    for (const attr of span.attributes) {
      if (attr.name === 'style') {
        const colorMatch = attr.value.match(/color:\s*(#[0-9a-fA-F]{3,6}|\w+)/)
        if (colorMatch) {
          props.color = colorMatch[1] // 提取color值
        }
      } else {
        props[attr.name] = attr.value
      }
    }
    props.text = span.innerText
    return createVNode(TranslateFloatCard, props)
  })
  const wrapperVNode = createVNode(WrapperCardComponent, {}, virtualNode)
  if (container.value) {
    render(wrapperVNode, container.value)
  }
}
watch(
  receiveMecabSpan,
  (newVal) => {
    nextTick(() => {
      if (newVal && container.value) {
        createVirturalNode()
      }
    })
  },
  {
    immediate: true
  }
)
const originalTranslation = async (event, transition) => {
  translationOriginalText.value = transition.result
}
const handleMecabText = (event, translation) => {
  useTranslatorHookStore.handleMecabText(translation)
}
const handleMecabTextInRedisInfo = (event, getMecabTran) => {
  useTranslatorHookStore.handleMecabTextInRedisInfo(getMecabTran)
}
const handleCheckMecabExist = (event, mecabTextInRedisExist) => {
  useTranslatorHookStore.handleCheckMecabExist(mecabTextInRedisExist)
}
const handlehasWordInAnki = async (event, hasWordInAnki) => {
  useTranslatorHookStore.setStarred(hasWordInAnki)
}
// 监听翻译结果
onMounted(() => {
  window.mainApi.on(IpcTypes.HAS_TRANSLATION, originalTranslation)
  window.mainApi.on(IpcTypes.HAS_MECAB_TEXT, handleMecabText)
  //getinforedis事件
  window.mainApi.on(IpcTypes.HAS_MECAB_TEXT_IN_REDIS_INFO, handleMecabTextInRedisInfo)
  window.mainApi.on(IpcTypes.HAS_CHECK_MECAB_EXIST, handleCheckMecabExist)
  window.mainApi.on(IpcTypes.HAS_WORD_IN_ANKI, handlehasWordInAnki)
})
onBeforeUnmount(() => {
  window.mainApi.off(IpcTypes.HAS_TRANSLATION, originalTranslation)
  window.mainApi.off(IpcTypes.HAS_MECAB_TEXT, handleMecabText)
  window.mainApi.off(IpcTypes.HAS_MECAB_TEXT_IN_REDIS_INFO, handleMecabTextInRedisInfo)
  window.mainApi.off(IpcTypes.HAS_CHECK_MECAB_EXIST, handleCheckMecabExist)
  window.mainApi.off(IpcTypes.HAS_WORD_IN_ANKI, handlehasWordInAnki)
})
</script>

<style scoped>
::v-deep .TranslatePage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::v-deep p {
  color: aliceblue;
  font-size: 1em;
}

::v-deep .transparent-sheet {
  background-color: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  width: 100%;
  background-color: #0d47a1;
}

.vcardtext {
  width: 100%;
}

.rbody {
  background-color: #4527a0;
}

.vcard {
  width: 100%;
  background-color: #616161;
}
</style>
