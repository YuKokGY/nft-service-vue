<template>
    <div>
        <div v-if="!showEdit && !showCreate" class="container">
            <div class="header">
                <div class="title">
                    <span>系列列表</span>
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
            <el-table
                ref="multipleTable"
                v-loading="loading"
                :border="true"
                :data="tableData"
                :header-cell-style="{ background: '#e6e8ee', color: '#606266' }"
                :header-row-style="{ height: '53px' }"
                :row-style="{ width: '200px' }"
                max-height="520"
                row-key="id"
                stripe
                @currentChange="handleCurrentChange"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection"></el-table-column>
                <el-table-column :width="80" label="ID" prop="id"></el-table-column>
                <el-table-column :width="150" label="名称" prop="name"></el-table-column>
                <el-table-column :width="150" label="状态" prop="name">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" effect="dark">
                            {{ scope.row.status === 1 ? '正常' : '失效' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="更新时间" prop="update_time"></el-table-column>
                <el-table-column :width="200" align="center" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)">编辑 </el-button>
                        <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.id)">删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    v-if="refreshPagination"
                    :background="true"
                    :current-page="currentPage"
                    :page-size="pageCount"
                    :page-sizes="[10, 20, 30, 40, 50, 100]"
                    :total="total_nums"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination>
            </div>
        </div>
        <category-create v-else-if="showCreate" @createClose="createClose"></category-create>
        <category-modify v-else-if="showEdit" :edit-info="tableData.row" @editClose="editClose"></category-modify>
    </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import baseModel from '@/model/baseModel'
import CategoryCreate from '@/view/category/category-create'
import CategoryModify from '@/view/category/category-modify'

export default {
    components: { CategoryModify, CategoryCreate, LinTable },
    data() {
        return {
            loading: false,
            refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
            total_nums: 0, // 分组内的用户总数
            currentPage: 1, // 默认获取第一页的数据
            pageCount: 10, // 每页10条数据
            tableColumn: [],
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
        async handleSizeChange(val) {
            this.pageCount = val
            this.loading = true
            await this.getList(this.modelDO, 'changePage')
            this.loading = false
        },
        async getList(val) {
            const currentPage = this.currentPage - 1
            try {
                this.loading = true
                const res = await baseModel.postList('/cms/category/getAll', val, {
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
            this.tableData.row = val
        },
        //多选
        handleSelectionChange(val) {
            this.checkBoxData = val
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
