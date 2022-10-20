<template>
    <div>
        <div v-if="!showEdit && !showCreate" class="container">
            <div class="header">
                <div class="title">
                    <span>创作方</span>
                    <el-button size="mini" style="margin-left: 10px" type="primary" @click="showCreate = true"
                        >添加
                    </el-button>
                    <el-select
                        v-model="modelDO.status"
                        clearable
                        class="select"
                        placeholder="状态"
                        size="medium"
                        @change="changeSelect"
                        @clear="modelDO.status = null"
                    >
                        <el-option
                            v-for="item in status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-model="modelDO.name"
                        autocomplete="off"
                        class="input"
                        clearable
                        placeholder="搜索名称"
                        prefix-icon="el-icon-search"
                        size="medium"
                        @blur="searchWithTitle"
                        @clear="clearAll"
                    ></el-input>
                </div>
            </div>
            <!--表格-->
            <lin-table
                v-loading="loading"
                :operate="operate"
                :operate-width="200"
                :pagination="{ currentPage: currentPage, pageSize: pageCount, total: total_nums }"
                :table-column="tableColumn"
                :tableData="tableData"
                type="selection"
                @currentChange="handleCurrentChange"
                @handleDelete="handleDelete"
                @handleEdit="handleEdit"
                @selection-change="checkBoxSelect"
            >
            </lin-table>
        </div>
        <creator-create v-else-if="showCreate" @createClose="createClose"></creator-create>
        <creator-modify v-else-if="showEdit" :edit-info="tableData.row" @editClose="editClose"></creator-modify>
    </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import baseModel from '@/model/baseModel'
import CreatorCreate from '@/view/collection/creator-create'
import CreatorModify from '@/view/collection/creator-modify'

export default {
    components: { CreatorModify, CreatorCreate, LinTable },
    data() {
        return {
            refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
            total_nums: 0, // 分组内的用户总数
            currentPage: 1, // 默认获取第一页的数据
            pageCount: 10, // 每页10条数据
            tableColumn: [
                { prop: 'name', label: '名称' },
                { prop: 'avatar', label: '头像' },
                { prop: 'status', label: '状态' },
                { prop: 'create_time', label: '创建时间' },
                { prop: 'update_time', label: '更新时间' },
            ],
            tableData: [],
            checkBoxData: [],
            showCreate: false,
            showEdit: false,
            operate: [],
            status: [{ label: '正常', value: 1 }, { label: '失效', value: 0 }],
            date: [],
            modelDO: {
                type: 1,
            },
        }
    },
    async created() {
        this.loading = true
        await this.getList(this.modelDO)
        this.operate = [
            { name: '编辑', func: 'handleEdit', type: 'primary' },
            { name: '删除', func: 'handleDelete', type: 'danger' },
        ]
        this.loading = false
    },
    methods: {
        // 切换table页
        async handleCurrentChange(val) {
            this.currentPage = val
            this.loading = true
            await this.getList(this.modelDO, 'changePage')
            this.loading = false
        },
        async getList(val) {
            const currentPage = this.currentPage - 1
            try {
                this.loading = true
                const res = await baseModel.postList('/cms/creator/getAll', val, {
                    count: this.pageCount,
                    page: currentPage,
                })
                this.tableData = res.items
                this.total_nums = res.total
                this.loading = false
            } catch (error) {
                if (error.code === 10020) {
                    this.tableData = []
                }
            }
        },
        // 搜索框逻辑
        async searchWithTitle() {
            await this.getList(this.modelDO)
        },
        async clearAll() {
            this.modelDO.title = null
            await this.getList(this.modelDO)
        },
        // 时间选择器逻辑
        async datePick() {
            if (this.date == null) {
                this.modelDO.start_time = null
                this.modelDO.end_time = null
            } else {
                this.modelDO.start_time = this.date[0]
                this.modelDO.end_time = this.date[1]
            }
            await this.getList(this.modelDO)
        },
        // 选择框逻辑
        async changeSelect() {
            if (this.modelDO.online === null) {
                await this.getList()
            }
            await this.getList(this.modelDO)
        },
        // 删除按钮逻辑
        handleDelete(val) {
            this.$confirm('此操作将永久删除，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                this.loading = true
                const res = await spu.delete('/cms/spu/deleteSpu', val.row.id)
                this.loading = false
                if (res.code < window.MAX_SUCCESS_CODE) {
                    await this.getList(this.modelDO)
                    this.$message({
                        type: 'success',
                        message: `${res.message}`,
                    })
                }
            })
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
        createClose() {
            this.showCreate = false
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

            .select {
                float: right;
                margin-right: 40px;
                width: 100px;
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
