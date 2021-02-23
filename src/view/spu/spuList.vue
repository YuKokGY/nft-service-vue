<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">
          <span>商品列表</span>
          <el-select v-model="spuDo.online" class="search" placeholder="上下架筛选" size="medium" @change="changeSelect">
            <el-option
              v-for="item in isOnline"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="date"
            class="date"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="datePick">
          </el-date-picker>
          <el-input v-model="spuDo.title" autocomplete="off" class="input" placeholder="搜索商品"
                    prefix-icon="el-icon-search" size="medium" @blur="searchWithTitle"></el-input>
        </div>
      </div>
      <!--表格-->
      <lin-table
        v-loading="loading"
        :operate="operate"
        :table-column="tableColumn"
        :tableData="tableData"
        @handleDelete="handleDelete"
        @handleEdit="handleEdit"
        @row-click="rowClick"
      >
      </lin-table>
      <!--分页-->
      <div class="pagination">
        <el-pagination
          v-if="refreshPagination"
          :background="true"
          :current-page="currentPage"
          :page-size="pageCount"
          :total="total_nums"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <!--编辑页面-->
    <spu-modify v-else :editSpu="tableData.row" @editClose="editClose"></spu-modify>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import spu from '@/model/spu'
import SpuModify from '@/view/spu/spu-modify'

export default {
  components: {SpuModify, LinTable},
  data() {
    return {
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      pagination: true,
      tableColumn: [
        {prop: 'title', label: '商品名称'},
        {prop: 'subtitle', label: '商品描述'},
        {prop: 'price', label: '商品价格'},
        {prop: 'tags', label: '商品标签'}
      ],
      tableData: [],
      showEdit: false,
      operate: [],
      isOnline: [{label: '所有', value: null}, {label: '上架', value: 1}, {label: '下架', value: 0}],
      date: [],
      spuDo: {
        online: null,
        title: null,
        start_time: null,
        end_time: null
      }
    }
  },
  async created() {
    this.loading = true
    await this.getSpuList()
    this.operate = [
      {name: '编辑', func: 'handleEdit', type: 'primary'},
      {name: '删除', func: 'handleDelete', type: 'danger', permission: '删除商品'},
    ]
    this.loading = false
  },
  methods: {
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getSpuList(this.spuDo, 'changePage')
      this.loading = false
    },
    async getSpuList(val) {
      const currentPage = this.currentPage - 1
      if (val != null) {
        try {
          this.loading = true
          const spuList = await spu.getSpuList(val, {count: this.pageCount, page: currentPage})
          this.tableData = spuList.items
          this.total_nums = spuList.total
          this.loading = false
        } catch (error) {
          if (error.code === 10020) {
            this.tableData = []
          }
        }
      } else {
        try {
          this.loading = true
          const spuList = await spu.getSpuList({}, {count: this.pageCount, page: currentPage})
          this.tableData = spuList.items
          this.total_nums = spuList.total
          this.loading = false
        } catch (error) {
          if (error.code === 10020) {
            this.tableData = []
          }
        }
      }
    },
    // 搜索框逻辑
    async searchWithTitle() {
      this.spuDo.online = null
      this.spuDo.start_time = null
      this.spuDo.end_time = null
      await this.getSpuList(this.spuDo)
    },
    // 时间选择器逻辑
    async datePick() {
      this.spuDo.online = null
      this.spuDo.title = null
      // eslint-disable-next-line prefer-destructuring
      this.spuDo.start_time = this.date[0]
      // eslint-disable-next-line prefer-destructuring
      this.spuDo.end_time = this.date[1]
      await this.getSpuList(this.spuDo)
    },
    // 选择框逻辑
    async changeSelect() {
      this.spuDo.title = null
      this.spuDo.start_time = null
      this.spuDo.end_time = null
      if (this.spuDo.online === null) {
        await this.getSpuList()
      }
      await this.getSpuList(this.spuDo)
    },
    // 删除按钮逻辑
    handleDelete(val) {
      this.$confirm('此操作将永久删除商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        const res = await spu.deleteSpu(val.row.id)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getSpuList()
          this.$message({
            type: 'success',
            message: `${res.message}`
          })
        }
      })
    },
    // 编辑按钮
    handleEdit(val) {
      this.showEdit = true
      this.tableData.row = val.row
    },
    rowClick() {
    },
    // 关闭页面
    editClose() {
      this.showEdit = false
      this.getSpuList(this.spuDo)
    }
  }
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
