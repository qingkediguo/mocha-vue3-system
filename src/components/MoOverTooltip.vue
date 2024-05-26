<template>
  <div ref="refTd">
    <el-tooltip placement="top" :disabled="!isExceed">
      <template #content>
        <p class="max-w-100">{{ text }}</p>
      </template>
      <div class="text-wrap" :style="tdStyle">
        {{ text }}
        <div class="text-content" ref="refContent">{{ text }}</div>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'

// 定义属性类型
const props = defineProps({
  text: { type: String, default: '' },
  row: { type: Number, default: 1 }
})

const refTd = ref()
const refContent = ref()

const tdStyle = reactive({
  lineClamp: 0,
  height: 'auto'
})

let resizeObserver: ResizeObserver | null = null
let fullHeight = 0
let lineHeight = 0

watch(
  () => props.text,
  async (text) => {
    if (text) {
      await nextTick()
      lineHeight = Number(window.getComputedStyle(refContent.value).lineHeight.slice(0, -2))
    }
  },
  { immediate: true }
)

onMounted(async () => {
  resizeObserver = new ResizeObserver(async (entries) => {
    for (let entry of entries) {
      fullHeight = entry.contentRect.height
      handleExceed()
    }
  })

  resizeObserver.observe(refContent.value)
})

const isExceed = ref(false)
const handleExceed = async () => {
  isExceed.value = fullHeight > props.row * lineHeight

  tdStyle.lineClamp = props.row
  // 如果没有超过一行，则不需要设置高度
  if (isExceed.value) tdStyle.height = props.row * lineHeight + 'px'
  else tdStyle.height = fullHeight + 'px'
}

const unobserveElementSize = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

onUnmounted(() => {
  unobserveElementSize()
})
</script>

<style lang="scss" scoped>
.text-wrap {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: pre-wrap;

  .text-content {
    position: absolute;
    visibility: hidden;
  }
}
</style>
