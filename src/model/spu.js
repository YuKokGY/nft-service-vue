// eslint-disable-next-line no-unused-vars
import {post} from '@/lin/plugin/axios'

class Spu {
  async getSpuList(info, {count = this.uCount, page = this.uPage}) {
    const res = await post('cms/spu/get', info, {
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
