<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">商品列表</div>
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
      tableColumn: [
        {prop: 'title', label: '商品名称'},
        {prop: 'subtitle', label: '商品描述'},
        {prop: 'price', label: '商品价格'},
        {prop: 'tags', label: '商品标签'},
        {prop: 'online', label: '是否上架'},
      ],
      tableData: [],
      showEdit: false,
      operate: []
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
      await this.getSpuList('changePage')
      this.loading = false
    },
    async getSpuList() {
      const currentPage = this.currentPage - 1
      try {
        this.loading = true
        const spuList = await spu.getSpuList({count: this.pageCount, page: currentPage})
        this.tableData = spuList.items
        this.total_nums = spuList.total
        // eslint-disable-next-line no-unused-vars
        this.tableData.forEach(item => {
          if (item.online === 1) {
            item.online = '上架'
          } else {
            item.online = '下架'
          }
        })
        this.loading = false
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
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
    handleEdit(val) {
      this.showEdit = true
      this.tableData.row = val.row
    },
    rowClick() {
    },
    editClose() {
      this.showEdit = false
      this.getSpuList()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }

  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

}
</style>
