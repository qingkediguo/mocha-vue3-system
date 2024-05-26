<!--
 * @Author: lucidity99 lucidity929@163.com
 * @Date: 2023-07-21 08:46:00
 * @LastEditors: lucidity99 lucidity929@163.com
 * @LastEditTime: 2024-05-10 22:37:23
 * @FilePath: /mocha-vue3-system/src/views/feat/media/Videojs.vue
 * @Description:
 *
 *
-->
<template>
  <div>使用videojs实现 m3u8 视频播放</div>
  <div><TestComp v-model:data="myData" @update="update" /></div>
</template>

<script setup>
import { ref } from 'vue'
import TestComp from './TestComp.vue'

const myData = ref({
  name: 'lucidity',
  age: 18,
  sex: '男'
})

const update = (payload) => {
  myData.value = payload
}
</script>
