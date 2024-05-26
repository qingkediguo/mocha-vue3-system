<template>
  <!-- <div ref="refTd">
    <el-tooltip placement="top" :disabled="!show">
      <template #content>
        <p class="max-w-100">{{ safeText }}</p>
      </template>
      <div class="text-wrap" :style="tdStyle" @mouseover="handleMouseOver">
        <span class="text-content">{{ text }}</span>
      </div>
    </el-tooltip>
  </div> -->
  <div ref="refTd">
    <el-tooltip placement="top" :disabled="!isExceed">
      <template #content>
        <p class="max-w-100">{{ text }}</p>
      </template>
      <div class="text-wrap" :style="tdStyle">
        <span class="text-content" ref="refContent">{{ text }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// 定义属性类型
const props = defineProps({
  text: { type: String, default: '' },
  row: { type: Number, default: 1 }
})

// 使用计算属性处理文本，以避免XSS
const safeText = computed(() => {
  return props.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
})

const show = ref(false)

// 提取函数以处理异常和提高代码的可读性
const isElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// const handleMouseOver = (e: MouseEvent) => {
//   const targetElement = 'relatedTarget' in e ? e.relatedTarget : e.fromElement

//   if (!targetElement) {
//     return
//   }

//   const width = targetElement.clientWidth
//   const height = targetElement.clientHeight

//   console.log(width, height)

//   const tempEl = document.createElement('div')
//   tempEl.textContent = safeText.value // 使用textContent代替innerText
//   tempEl.style.width = width + 'px'

//   // 检查body元素是否存在
//   const body = document.querySelector('body')
//   if (body) {
//     body.appendChild(tempEl)
//     const fullHeight = tempEl.clientHeight
//     tempEl.remove()
//     // 判断是否需要显示tooltip，同时考虑边界条件
//     show.value = fullHeight > height && isElementInViewport(e.target as Element)
//   }
// }

// 在组件挂载时，确保相关DOM就绪

// onMounted(() => {
//   document.addEventListener('mouseover', handleMouseOver)
// })

// 组件卸载时，移除事件监听器，避免内存泄漏
// onBeforeUnmount(() => {
//   document.removeEventListener('mouseover', handleMouseOver)
// })

const refTd = ref()
const refConent = ref()
const isExceed = ref(true)
const tdStyle = reactive({
  lineClamp: 1,
  height: 'auto'
})

watch(
  () => props.text,
  async (text) => {
    if (text) {
      await nextTick()
      const lineHeight = Number(window.getComputedStyle(refTd.value).lineHeight.slice(0, -2))
      tdStyle.lineClamp = props.row
      tdStyle.height = props.row * lineHeight + 'px'

      const fullHeight = refConent.value?.clientHeight

      isExceed.value = fullHeight > tdStyle.height
    }
  },
  { immediate: true }
)
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
    position: relative;
  }
}
</style>
