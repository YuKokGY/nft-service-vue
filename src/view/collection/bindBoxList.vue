<template>
    <div>
        <div v-if="!showEdit && !showCreate" class="container">
            <div class="header">
                <div class="title">
                    <span>藏品列表</span>
                    <el-button size="mini" style="margin-left: 10px" type="primary" @click="showCreate = true"
                        >添加
                    </el-button>
                    <el-date-picker
                        v-model="date"
                        :default-time="['00:00:00', '23:59:59']"
                        class="date"
                        end-placeholder="结束日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="datePick"
                    >
                    </el-date-picker>
                    <el-select
                        v-model="modelDO.status"
                        class="select"
                        clearable
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
                <el-table-column :width="150" label="名称" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column :width="150" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" effect="dark" type="success">上架</el-tag>
                        <el-tag v-if="scope.row.status === 2" effect="dark" type="danger">下架</el-tag>
                        <el-tag v-if="scope.row.status === 3" effect="dark" type="warning">售罄</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :width="100" label="缩略图">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.short_img_url" fit="fill" style="width: 60px;height: 60px"></el-image>
                    </template>
                </el-table-column>
                <el-table-column :width="100" label="价格" prop="price"></el-table-column>
                <el-table-column :width="100" label="限量" prop="mold_count"></el-table-column>
                <el-table-column :width="100" label="库存" prop="stock"></el-table-column>
                <el-table-column :width="200" label="发售日期" prop="sale_time" show-overflow-tooltip></el-table-column>
                <el-table-column
                    :width="200"
                    label="创建时间"
                    prop="create_time"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    :width="200"
                    label="更新时间"
                    prop="update_time"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column :width="400" align="center" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" @click="handleConvert(scope.row)">藏品 </el-button>
                        <el-button plain size="mini" type="primary" @click="handleDrop(scope.row)">空投</el-button>
                        <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
            <el-dialog :visible.sync="showCollection" title="藏品绑定" width="45%">
                <el-form :inline="true" :model="formCollection">
                    <i v-if="!formCollection.dataList.length" class="iconfont icon-jiahao" @click="addContent"></i>
                    <el-row v-for="(item, index) in formCollection.dataList" :key="index" class="input-row">
                        <el-form-item label="藏品" label-width="100">
                            <el-select
                                v-model="item.collection_id"
                                class="select"
                                style="width: 150px"
                                placeholder="藏品"
                                size="medium"
                            >
                                <el-option
                                    v-for="item in collectionList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="概率" label-width="100">
                            <el-input
                                v-model.number="item.percent"
                                placeholder="请输入百分比"
                                size="medium"
                                style="width: 80px"
                            ></el-input
                            ><span style="margin-left: 5px">%</span>
                        </el-form-item>
                        <el-form-item label="数量" label-width="100">
                            <el-input
                                v-model.number="item.count"
                                placeholder="请输入数量"
                                size="medium"
                                style="width: 80px"
                            ></el-input>
                            <i
                                class="iconfont icon-jianhao"
                                style="margin-left: 30px"
                                @click="removeContent(index)"
                            ></i>
                            <i
                                v-if="index === formCollection.dataList.length - 1"
                                style="margin-left: 10px"
                                class="iconfont icon-jiahao"
                                @click="addContent"
                            ></i>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showCollection = false">取 消</el-button>
                    <el-button type="primary" @click="submitConvert">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="showDrop" title="空投">
                <el-form :model="formDrop">
                    <el-form-item label="用户" label-width="100">
                        <el-select
                            v-model="formDrop.user_ids"
                            class="select"
                            clearable
                            multiple
                            placeholder="用户"
                            size="medium"
                            @clear="modelDO.user_ids = []"
                        >
                            <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showDrop = false">取 消</el-button>
                    <el-button type="primary" @click="submitDrop">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <bind-box-create v-else-if="showCreate" @createClose="createClose"></bind-box-create>
        <bind-box-modify v-else-if="showEdit" :edit-info="tableData.row" @editClose="editClose"></bind-box-modify>
    </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import baseModel from '@/model/baseModel'
import BindBoxCreate from '@/view/collection/bindBox-create'
import BindBoxModify from '@/view/collection/bindBox-modify'

export default {
    components: { BindBoxModify, BindBoxCreate, LinTable },
    data() {
        return {
            loading: false,
            refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
            total_nums: 0, // 分组内的用户总数
            currentPage: 1, // 默认获取第一页的数据
            pageCount: 10, // 每页10条数据
            tableColumn: [],
            tableData: [],
            showCollection: false,
            checkBoxData: [],
            showCreate: false,
            showEdit: false,
            showDrop: false,
            operate: [],
            collectionList: [],
            userList: [],
            status: [{ label: '上架', value: 1 }, { label: '下架', value: 2 }, { label: '售罄', value: 3 }],
            date: [],
            modelDO: {},
            formCollection: {
                dataList: [],
            },
            formDrop: {},
        }
    },
    async created() {
        this.loading = true
        await this.getList(this.modelDO)
        await this.getUserList()
        await this.getCollectionList()
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
                const res = await baseModel.postList('/cms/bindBox/getAll', val, {
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

        async getCollectionList() {
            const res = await baseModel.getAllByList('/cms/collectionList/getList?type=2')
            res.forEach(item => {
                let json = {}
                json.value = item.id
                json.label = item.name
                this.collectionList.push(json)
            })
        },

        async getUserList() {
            const res = await baseModel.getAllByList('/cms/clientUser/getAll')
            res.forEach(item => {
                let json = {}
                json.value = item.id
                json.label = item.phone
                this.userList.push(json)
            })
        },

        async submitConvert() {
            // const res = await baseModel.create('/cms/convertCode/createConvert', this.formCollection)
            // if (res.code < window.MAX_SUCCESS_CODE) {
            //     this.$message.success('创建成功')
            //     this.showCollection = false
            //     this.formCollection = {count: 1}
            // } else this.$message.error(res.message)
            this.$message.error('接口还没开发呢!')
        },

        async submitDrop() {
            this.formDrop.type = 1
            const res = await baseModel.create('/cms/airdropLog/dropUsers', this.formDrop)
            if (res.code < window.MAX_SUCCESS_CODE) {
                this.$message.success(res.message)
                this.showDrop = false
                this.formDrop = {}
            } else this.$message.error(res.message)
        },

        addContent() {
            this.formCollection.dataList.push({
                collection_id: null,
                percent: 0,
                count: 0,
            })
        },
        removeContent(index) {
            this.formCollection.dataList.splice(index, 1)
        },

        handleConvert(val) {
            this.showCollection = true
            this.formCollection.id = val.id
        },
        handleDrop(val) {
            this.showDrop = true
            this.formDrop.collection_id = val.id
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
                margin-right: 10px;
                width: 100px;
            }

            .input {
                float: right;
                margin-right: 10px;
                width: 120px;
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
