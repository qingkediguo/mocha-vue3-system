import request from '~/utils/http/axios'

export default {
  fetchChinaMapData() {
    return request({
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
      method: 'get',
      responseType: 'json',
      isReturnNativeData: true
    })
  },

  fetchProvinceMapData(code: string) {
    return request({
      url: `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`,
      method: 'get',
      responseType: 'json',
      isReturnNativeData: true
    })
  }
}
