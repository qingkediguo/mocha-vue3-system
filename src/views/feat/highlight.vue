<template>
  <div class="p-4">
    <h3>纯 CSS 实现关键词高亮</h3>
    <div class="my-4">
      <el-input v-model="keyword" @input="input" placeholder="请输入关键词"></el-input>
    </div>

    <ul class="list-client">
      <li v-for="client in tableData" :key="client.id" class="py-2">
        <MoDict :value="client.type" dictName="clientType" />{{ client.id }}、{{ client.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import clientApi from '~/api/client'
import { useTable } from '~/hooks/useTable'
import { ElMessage } from 'element-plus'

if (!CSS.highlights) {
  ElMessage.error('此浏览器不支持 CSS 自定义高亮 API！')
}

const { tableData, loading, getData } = useTable(clientApi.getClientList, {}, undefined, {
  immediate: false
})

const keyword = ref('')
const allTextNodes: Node[] = []

onMounted(async () => {
  await getData()
  nextTick(() => {
    const content = document.querySelector('.list-client')
    if (content) {
      const treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
      let currentNode = treeWalker.nextNode()
      while (currentNode) {
        allTextNodes.push(currentNode)
        currentNode = treeWalker.nextNode()
      }
    }
  })
})

const input = (e: string) => {
  if (!CSS.highlights) {
    return
  }

  // Clear the registry
  CSS.highlights.clear()

  const str = e.trim().toLowerCase()
  if (!str) {
    return
  }

  const ranges = allTextNodes
    .map((el) => {
      return { el, text: el.textContent?.toLowerCase() || '' }
    })
    .map(({ text, el }) => {
      const indices: number[] = []
      let startPos = 0
      while (startPos < text.length) {
        const index = text.indexOf(str, startPos)
        if (index === -1) break
        indices.push(index)
        startPos = index + str.length
      }

      return indices.map((index) => {
        const range = new Range()
        range.setStart(el, index)
        range.setEnd(el, index + str.length)
        return range
      })
    })

  const searchResultsHighlight = new Highlight(...ranges.flat())

  CSS.highlights.set('search-results', searchResultsHighlight)
}
</script>

<style scoped>
::highlight(search-results) {
  background-color: #f06;
  color: white;
}
</style>
