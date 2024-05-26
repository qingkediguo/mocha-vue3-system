import { ref } from 'vue'
import { defineStore } from 'pinia'
import systemApi from '~/api/system'

interface PromiseRequestMap {
  [key: string]: Promise<any> | null
}

interface DictMap {
  [key: string]: []
}

export const useDictStore = defineStore(
  'dict',
  () => {
    const dicts = ref<DictMap>({})

    const getDictData = async (dictType: string, refresh: boolean = false) => {
      return new Promise((resolve, reject) => {
        let data: any = dicts.value[dictType]
        if (data && !refresh) {
          try {
            resolve(data)
          } catch (e) {
            reject(e)
          }
        } else {
          const p = handleRepeatedRequest(dictType, new Date().getTime())
          resolve(p)
        }
      })
    }

    // 处理重复的 Promise 请求

    let promiseRecords = <PromiseRequestMap>{}

    const handleRepeatedRequest = (key: string, timestamp: number) => {
      if (!promiseRecords[key]) {
        console.log('no repeated request')
        promiseRecords[key] = systemApi
          .getDicts(key)
          .then((res: any) => {
            // 存入缓存
            dicts.value[key] = res
            return res
          })
          .catch((e: Error) => {})
          .finally(() => {
            // 请求完毕，重置，否则会一直保留该promise
            promiseRecords[key] = null
          })
      } else {
        console.log('already has repeated request')
      }
      return promiseRecords[key]
    }

    return { dicts, getDictData }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
