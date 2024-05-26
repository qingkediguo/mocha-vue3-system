<template>
  <div ref="refMoreText" class="more-text">
    <div ref="refContent" class="content">{{ text }}</div>
    <div
      ref="refTrigger"
      class="trigger text-primary trigger-bg"
      @click="handleTrigger"
      v-if="isExceed"
    >
      <span>{{ moreVisible ? '收起' : '... 展开更多' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  row: {
    type: Number,
    default: 2
  }
})

const refMoreText = ref()
const refContent = ref()
const refTrigger = ref()
const isExceed = ref(false)
const moreVisible = ref(false)

let fullHeight = 0 // 一开始的高度
let textHeight = 0 // 收起之后高度
let lineHeight = 0 // 行高

const handleTrigger = () => {
  moreVisible.value = !moreVisible.value

  if (moreVisible.value) {
    refTrigger.value.classList.remove('bg')
  } else {
    refTrigger.value.classList.add('bg')
  }

  setCssVar(moreVisible.value)
}

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  fullHeight = refContent.value.clientHeight

  lineHeight = Number(window.getComputedStyle(refMoreText.value).lineHeight.slice(0, -2))

  textHeight = lineHeight * props.row

  if (refTrigger.value) refTrigger.value.style['lineHeight'] = lineHeight + 'px'

  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      fullHeight = entry.contentRect.height
      isExceed.value = textHeight < fullHeight
      setCssVar(moreVisible.value)
    }
  })
  resizeObserver.observe(refContent.value)
})

const setCssVar = (visible: boolean) => {
  if (visible) {
    refMoreText.value.style.setProperty('--height', fullHeight + lineHeight + 'px')
    refMoreText.value.style.setProperty('--row', '')
  } else {
    refMoreText.value.style.setProperty('--row', props.row)
    refMoreText.value.style.setProperty('--height', textHeight + 'px')
  }
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
.more-text {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--row);
  line-clamp: var(--row);
  height: var(--height);
  word-break: break-all;
  white-space: pre-wrap;
  transition: height 0.3s;

  .content {
    // 设为absolute,避免高度被父元素影响
    position: absolute;
  }
  .trigger {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--lineHeight);
    line-height: var(--lineHeight);
    padding-left: 120px;
    cursor: pointer;
  }
  .trigger-bg {
    background: linear-gradient(
      to right,
      rgb(255, 255, 255, 0) 0,
      rgb(255, 255, 255, 1) 60%,
      #fff 100%
    );
  }
}
</style>
