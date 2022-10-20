<template>
    <div>
        <div class="container">
            <div class="header">
                <div class="title">
                    <span>banner列表</span>
                </div>
            </div>
            <div>
                <upload-imgs ref="uploadEle" :multiple="false" :rules="rules" :value="bannerList" />
                <div style="margin-top: 20px">
                    <el-button type="primary" @click="saveBannerList">保 存</el-button>
                </div>
            </div>
            <div style="border-bottom: 1px solid #dae1ec;margin-top: 20px"></div>
            <div class="header">
                <div class="title">
                    <span>首页通知设置</span>
                </div>
            </div>
            <div>
                <i v-if="!noticeList.length" class="iconfont icon-jiahao" @click="addContent"></i>
                <el-row v-for="(item, index) in noticeList" :key="index" class="input-row">
                    <span style="font-size: 15px"
                        >消息{{ index + 1 }}:
                        <el-input
                            v-model="item.value"
                            class="input-detail"
                            placeholder="请输入内容"
                            size="medium"
                            style="width: 250px;margin-bottom: 30px;margin-left: 30px"
                        ></el-input>
                        <i
                            v-if="index === noticeList.length - 1"
                            class="iconfont icon-jiahao"
                            style="margin-left: 5px"
                            @click="addContent"
                        ></i>
                        <i class="iconfont icon-jianhao" style="margin-left: 5px" @click="removeContent(index)"></i>
                    </span>
                </el-row>
                <div style="margin-top: 20px">
                    <el-button type="primary" @click="saveNotice">保 存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import UploadImgs from '@/component/base/upload-image/index'
import model from '@/model/baseModel'

export default {
    components: { UploadImgs, LinTable },
    data() {
        return {
            refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
            loading: false,
            total_nums: 0, // 分组内的用户总数
            currentPage: 1, // 默认获取第一页的数据
            pageCount: 10, // 每页10条数据
            tableColumn: [],
            tableData: [],
            checkBoxData: [],
            bannerList: [],
            noticeList: [],
            showEdit: false,
            operate: [],
            date: [],
            modelDO: {},
            rules: {
                minWidth: 100,
                minHeight: 100,
                maxSize: 5,
            },
        }
    },
    async created() {
        this.loading = true
        await this.getBannerList()
        await this.getNoticeList()
        this.loading = false
    },
    methods: {
        //获取banner列表
        async getBannerList() {
            this.bannerList = []
            const res = await model.getAllByList('/cms/indexConfig/getBannerList')
            JSON.parse(res.value).forEach(item => {
                let json = {}
                json.display = item
                this.bannerList.push(json)
            })
        },

        //获取通知
        async getNoticeList() {
            this.noticeList = []
            const res = await model.getAllByList('/cms/indexConfig/getNoticeList')
            JSON.parse(res.value).forEach(item => {
                let json = {}
                json.value = item
                this.noticeList.push(json)
            })
        },

        //保存通知
        async saveNotice() {
            let json = []
            this.noticeList.forEach(item => {
                json.push(item.value)
            })
            const res = await model.create('/cms/indexConfig/updateNotice', json)
            if (res.code < window.MAX_SUCCESS_CODE) this.$message.success('保存成功')
            else this.$message.error(res.message)
        },

        async saveBannerList() {
            let json = []
            const list = await this.$refs.uploadEle.getValue()
            list.forEach(item => {
                json.push(item.display)
            })
            const res = await model.create('/cms/indexConfig/updateBanner', json)
            if (res.code < window.MAX_SUCCESS_CODE) this.$message.success('保存成功')
            else this.$message.error(res.message)
        },

        addContent() {
            this.noticeList.push({
                value: '',
            })
        },
        removeContent(index) {
            this.noticeList.splice(index, 1)
        },

        // 编辑按钮
        handleEdit(val) {
            this.showEdit = true
            this.tableData.row = val.row
        },
        // 关闭页面
        editClose() {
            this.showEdit = false
            this.getList(this.modelDO)
        },
        //表格多选
        checkBoxSelect(val) {
            this.checkBoxData = val
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    padding: 0 30px;

    .header {
        .title {
            height: 59px;
            line-height: 59px;
            color: $parent-title-color;
            font-size: 16px;
            font-weight: 500;

            .search {
                float: right;
                margin-right: 40px;
                cursor: pointer;
            }

            .input {
                float: right;
                margin-right: 10px;
                width: 200px;
            }

            .date {
                margin-top: 10px;
                float: right;
                margin-right: 10px;
                width: 200px;
            }
        }
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin: 20px;
    }
}
</style>
