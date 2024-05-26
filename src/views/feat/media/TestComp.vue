<template>
  <div>{{ item }}</div>
  <el-button @click="change">change</el-button>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: String,
    default: 'test'
  }
})

const emits = defineEmits(['update:data', 'update'])

const item = computed({
  get() {
    return props.data
  },
  set(val) {
    console.log(val)
    emits('update:data', val)
  }
})

const change = () => {
  const newData = {
    name: Math.random(100),
    age: Math.random(100)
  }
  console.log(newData)
  // item.value = newData

  // item.value.name = Math.random(100)
  // item.value.age = Math.random(100)
  emits('update', newData)
}
</script>
