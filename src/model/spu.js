// eslint-disable-next-line no-unused-vars
import {get, post} from '@/lin/plugin/axios'

class Spu {
  async getSpuList({count = this.uCount, page = this.uPage}) {
    const res = await get('cms/spu/get', {
      count,
      page
    })
    return res
  }

  async deleteSpu(id) {
    const res = await post(`cms/spu/deleteSpu/${id}`)
    return res
  }

  async updateSpu(info) {
    const res = await post('cms/spu/updateSpu', info)
    return res
  }

  async createSpu(info) {
    const res = await post('cms/spu/createSpu', info)
    return res
  }
}

export default new Spu()
