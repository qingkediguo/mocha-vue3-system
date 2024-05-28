<template>
  <el-select
    v-model="value"
    reserve-keyword
    placeholder="输入关键字选择"
    :remote-method="remoteMethod"
    :loading="loading"
    clearable
    filterable
    remote
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />

    <template #footer>
      <Pagination
        :small="true"
        layout="prev, pager, next"
        v-model:page="pagination.pageNum"
        v-model:size="pagination.pageSize"
        :total="total"
        @pagination="getData"
        class="justify-center h-10 p-2 bg-white"
      />
    </template>
    <template #loading>
      <div v-loading="loading" element-loading-text="加载中" class="h-20"></div>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import clientApi from '~/api/client'
import { reactive } from 'vue'

interface ListItem {
  value: string
  label: string
}

const props = defineProps({
  modelValue: { type: [Array, String, Number], default: () => [] }
})

const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})
let total = ref(0)
const emits = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  }
})

let keyword = ref('')
function getData() {
  loading.value = true
  clientApi
    .getClientList({
      keyword: keyword.value
    })
    .then((res: any) => {
      total.value = res.total
      options.value = res?.list?.map((val) => ({
        label: `${val.name} (${val.province},${val.city}) `,
        value: val.id
      }))
    })
    .finally(() => {
      loading.value = false
    })
}

const options = ref<ListItem[]>([])
const loading = ref(false)

const remoteMethod = (query: string) => {
  if (query) {
    keyword.value = query
    getData()
  } else {
    options.value = []
  }
}
</script>
