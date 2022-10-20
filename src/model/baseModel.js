// eslint-disable-next-line no-unused-vars
import { post } from '@/lin/plugin/axios'
import { get } from '../lin/plugin/axios'

class BaseModel {
    async postList(url, info, { count = this.uCount, page = this.uPage }) {
        if (info == null) {
            info = {}
        }
        const res = await post(url, info, {
            count,
            page,
        })
        return res
    }

    async getList(url, { count = this.uCount, page = this.uPage }) {
        const res = await get(url, {
            count,
            page,
        })
        return res
    }

    async getById(url, id) {
        const res = await get(`${url}/${id}`)
        return res
    }

    async getAllByList(url) {
        const res = await get(`${url}`)
        return res
    }

    async delete(url, id) {
        const res = await post(`${url}/${id}`)
        return res
    }

    async deleteBatch(url, ids) {
        const res = await post(url, ids)
        return res
    }

    async update(url, info) {
        const res = await post(url, info)
        return res
    }

    async create(url, info) {
        const res = await post(url, info)
        return res
    }
}

export default new BaseModel()
