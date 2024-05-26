<template>
  <span v-if="item">
    <span v-if="text">{{ item.label }}</span>
    <el-tag
      :type="$attrs.type || item.type"
      :class="item.class"
      :effect="$attrs.effect || item.effect"
      v-else
      >{{ item.label }}</el-tag
    >
  </span>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useDictStore } from '~/store/dict'
import { DictItem } from '#/dict'

const useDict = useDictStore()

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  // 根据 DictName 从接口/缓存获取字典数据集
  dictName: {
    type: String,
    default: ''
  },
  // 使用自定义的字典数据集，不使用接口/缓存中
  dictData: { type: Array },
  text: { type: Boolean, default: false },
  // 不使用缓存，实时获取获取
  refresh: { type: Boolean, default: false }
})

const dictOptions = ref<DictItem[]>([])

watchEffect(async () => {
  // 优选使用自定义的 DictData
  if (props.dictData) {
    dictOptions.value = props.dictData
  } else {
    dictOptions.value = (await useDict.getDictData(props.dictName, props.refresh)) as DictItem[]
  }
})

const item = computed<DictItem | undefined>(() => {
  const tempItem = dictOptions.value?.find((item) => item.value === props.value)
  if (tempItem) return tempItem
  else return undefined
})
</script>
