// eslint-disable-next-line no-unused-vars
import {post} from '@/lin/plugin/axios'
import {get} from "../lin/plugin/axios";

class Spu {


  async postList(url, info, {count = this.uCount, page = this.uPage}) {
    if (info == null) {
      info = {}
    }
    const res = await post(url, info, {
      count,
      page
    })
    return res
  }

  async getList(url, {count = this.uCount, page = this.uPage}) {
    const res = await get(url, {
      count,
      page
    })
    return res
  }

  async getById(url, id) {
    const res = await get(`${url}/${id}`)
    return res
  }

  async deleteSpu(url, id) {
    const res = await post(`${url}/${id}`)
    return res
  }

  async updateSpu(url, info) {
    const res = await post(url, info)
    return res
  }

  async createSpu(url, info) {
    const res = await post(url, info)
    return res
  }
}

export default new Spu()
