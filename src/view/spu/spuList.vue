<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">
          <span>商品列表</span>
          <el-select @change="changeSelect" class="search" placeholder="上下架筛选" size="medium" v-model="modelDO.online">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in isOnline"
            ></el-option>
          </el-select>
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            @change="datePick"
            class="date"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="date"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-input @blur="searchWithTitle" @clear="clearAll" autocomplete="off" class="input" clearable
                    placeholder="搜索商品"
                    prefix-icon="el-icon-search" size="medium" v-model="modelDO.title"></el-input>
        </div>
      </div>
      <!--表格-->
      <lin-table
        :operate="operate"
        :pagination="{currentPage:currentPage,pageSize:pageCount,total:total_nums}"
        :table-column="tableColumn"
        :tableData="tableData"
        :operate-width="300"
        @currentChange="handleCurrentChange"
        @handleDelete="handleDelete"
        @handleEdit="handleEdit"
        @handleInfo="handleInfo"
        @selection-change="checkBoxSelect"
        type="selection"
        v-loading="loading"
      >
      </lin-table>
    </div>
    <!--编辑页面-->
    <spu-modify :editSpu="tableData.row" @editClose="editClose" v-else></spu-modify>
  </div>
</template>

<script>

  import LinTable from '@/component/base/table/lin-table'
  import spu from '@/model/baseModel'
  import SpuModify from '@/view/spu/spu-modify'
  import baseModel from "@/model/baseModel";

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
        {prop: 'tags', label: '商品标签'}
      ],
      tableData: [],
      checkBoxData: [],
      showEdit: false,
      operate: [],
      isOnline: [{label: '所有', value: null}, {label: '上架', value: true}, {label: '下架', value: false}],
      date: [],
        modelDO: {
          online: null,
          title: '',
          start_time: null,
          end_time: null
        }
    }
  },
  async created() {
    this.loading = true
    await this.getList()
    this.operate = [
      {name: '编辑', func: 'handleEdit', type: 'primary'},
      {
        func: 'handleInfo',
        buttonType: row => (row.online !== false ? 'danger' : 'primary'),
        buttonName: row => {
          if (row.online === false) return '上架'
          else return '下架'
        },
      },
      {name: '删除', func: 'handleDelete', type: 'danger', permission: '删除商品'},
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
        const spuList = await spu.postList('/cms/spu/get', val, {count: this.pageCount, page: currentPage})
        this.tableData = spuList.items
        this.total_nums = spuList.total
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
      this.$confirm('此操作将永久删除商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        const res = await spu.delete('/cms/spu/deleteSpu', val.row.id)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getList()
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
    async handleInfo(val){
      const res = await baseModel.getById('/cms/spu/changeStatus',val.row.id)
      if (res.code < window.MAX_SUCCESS_CODE) {
        await this.getList()
        this.$message({
          type: 'success',
          message: `${res.message}`
        })
      }
    },
    // 关闭页面
    editClose() {
      this.showEdit = false
      this.getList(this.modelDO)
    },
    //表格多选
    checkBoxSelect(val) {
      this.checkBoxData = val
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
