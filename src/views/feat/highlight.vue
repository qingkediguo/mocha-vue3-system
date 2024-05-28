<template>
  <div>
    <div>纯 CSS 实现关键词高亮</div>
    <div>
      <el-input v-model="keyword" @input="input"></el-input>
    </div>
    <div id="content">
      <p>
        Maxime debitis hic, delectus perspiciatis laborum molestiae labore, deleniti, quam
        consequatur iure veniam alias voluptas nisi quo. Dolorem eaque alias, quo vel quas
        repudiandae architecto deserunt quidem, sapiente laudantium nulla.
      </p>
      <p>
        Maiores odit molestias, necessitatibus doloremque dolor illum reprehenderit provident
        nostrum laboriosam iste, tempore perferendis! Ab porro neque esse voluptas libero
        necessitatibus fugiat, ex, minus atque deserunt veniam molestiae tempora? Vitae.
      </p>
      <p>
        Dolorum facilis voluptate eaque eius similique ducimus dignissimos assumenda quos
        architecto. Doloremque deleniti non exercitationem rerum quam alias harum, nisi obcaecati
        corporis temporibus vero sapiente voluptatum est quibusdam id ipsa.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const keyword = ref('')
const allTextNodes = []

if (!CSS.highlights) {
  ElMessage.error('此浏览器不支持 CSS 自定义高亮 API！')
}

onMounted(() => {
  // const query = document.getElementById('query')
  const article = document.getElementById('content')

  // Find all text nodes in the article. We'll search within
  // these text nodes.
  const treeWalker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT)

  let currentNode = treeWalker.nextNode()
  while (currentNode) {
    allTextNodes.push(currentNode)
    currentNode = treeWalker.nextNode()
  }
})

const input = (e: string) => {
  if (!CSS.highlights) {
    article.textContent = 'CSS Custom Highlight API not supported.'
    return
  }

  // Clear the HighlightRegistry to remove the
  // previous search results.
  CSS.highlights.clear()

  // Clean-up the search query and bail-out if
  // if it's empty.
  const str = e.trim().toLowerCase()
  if (!str) {
    return
  }

  // Iterate over all text nodes and find matches.
  const ranges = allTextNodes
    .map((el) => {
      return { el, text: el.textContent.toLowerCase() }
    })
    .map(({ text, el }) => {
      const indices = []
      let startPos = 0
      while (startPos < text.length) {
        const index = text.indexOf(str, startPos)
        if (index === -1) break
        indices.push(index)
        startPos = index + str.length
      }

      // Create a range object for each instance of
      // str we found in the text node.
      return indices.map((index) => {
        const range = new Range()
        range.setStart(el, index)
        range.setEnd(el, index + str.length)
        return range
      })
    })

  // Create a Highlight object for the ranges.
  const searchResultsHighlight = new Highlight(...ranges.flat())

  // Register the Highlight object in the registry.
  CSS.highlights.set('search-results', searchResultsHighlight)
}
</script>

<style scoped>
::highlight(search-results) {
  background-color: #f06;
  color: white;
}
</style>
