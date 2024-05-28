import { DirectiveBinding, ref, unref } from 'vue'

interface ExHTMLElement extends HTMLElement {
  resizeListener: EventListener
}

export default {
  mounted: (el: ExHTMLElement, binding: DirectiveBinding) => {
    el.resizeListener = () => {
      setHeight(el, binding)
    }

    setHeight(el, binding)

    observeElementSize(el)
    window.addEventListener('resize', el.resizeListener)
  },
  unmounted(el: ExHTMLElement) {
    unobserveElementSize()
    window.removeEventListener('resize', el.resizeListener)
  },
  updated(el: ExHTMLElement, binding: DirectiveBinding) {
    observeElementSize(el)
    setHeight(el, binding)
  }
}

// set el-table height
function setHeight(el: ExHTMLElement, binding: DirectiveBinding) {
  const top = el.offsetTop
  const bottom = binding?.value?.bottom || 84
  const pageHeight = window.innerHeight
  el.style.height = pageHeight - top - bottom + 'px'
  el.style.overflowY = 'auto'
}

const width = ref(0)
const height = ref(0)
let resizeObserver: ResizeObserver | null

const observeElementSize = (element: HTMLElement) => {
  if (element) {
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
        // console.log('width, height', width.value, height.value)
      }
    })
    resizeObserver.observe(element)
  }
}

const unobserveElementSize = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}
