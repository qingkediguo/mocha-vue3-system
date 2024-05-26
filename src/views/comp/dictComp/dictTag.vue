<template>
  <div>
    <div>字典标签</div>
    <div class="m-4">
      <div class="mb-2">获取 clientType 的字典</div>
      <div>ElTag：<MoDict :value="formData.type" dictName="clientType" refresh /></div>
      <div>普通文本：<MoDict :value="formData.type" dictName="clientType" text /></div>
    </div>
    <el-divider></el-divider>
    <div class="m-4">
      <div class="mb-2">自定义字典数据</div>
      <div class="mb-2"><el-button @click="changeColor">Change Color</el-button></div>
      <MoDict :value="formData.color" :dictData="customDictData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formData = reactive({
  type: 'highschool',
  color: 'red'
})

const customDictData = [
  {
    label: '红色',
    value: 'red',
    class: 'text-red-500 bg-red-100 border-red-200'
  },
  {
    label: '蓝色',
    value: 'blue',
    class: 'text-blue-500 bg-blue-100 border-blue-200'
  },
  {
    label: '绿色',
    value: 'green',
    class: 'text-green-500 bg-green-100 border-green-200'
  },
  {
    label: '粉色',
    value: 'pink',
    class: 'text-pink-500 bg-pink-100 border-pink-200'
  }
]

const changeColor = () => {
  formData.color = customDictData[Math.floor(Math.random() * 4)].value
}
</script>
