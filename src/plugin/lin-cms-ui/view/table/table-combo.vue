<template>
  <!-- 列表页面 -->
  <div class="tableSample">
    <div class="header">
      <div class="header-left"><p class="title">豆瓣电影TOP250</p></div>
      <div class="header-right">
        <lin-search placeholder="请输入电影名" @query="onQueryChange" />
        <div style="margin-left:30px">
          <el-button type="primary" @click="dialogTableVisible = !dialogTableVisible">列操作</el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <el-dialog :visible.sync="dialogTableVisible" top="5vh" width="60%">
        <!-- 定制列 -->
        <span>选择要展示的列:</span>
        <el-checkbox-group v-model="checkList" class="m-20" @change="handleChange">
          <el-checkbox
            v-for="item in tempCheckList"
            :key="item"
            :disabled="item === '电影名' || item === '排名'"
            :label="item"
          />
        </el-checkbox-group>
        <!-- 固定列 -->
        <span>选择固定在左侧的列:</span>
        <el-checkbox-group v-model="fixedLeftList" class="m-20">
          <el-checkbox
            v-for="item in tempCheckList"
            :key="item"
            :disabled="fixedRightList.indexOf(item) > -1 || checkList.indexOf(item) === -1"
            :label="item"
          />
        </el-checkbox-group>
        <span>选择固定在右侧的列:</span>
        <el-checkbox-group v-model="fixedRightList" class="m-20">
          <el-checkbox
            v-for="item in tempCheckList"
            :key="item"
            :disabled="fixedLeftList.indexOf(item) > -1 || checkList.indexOf(item) === -1"
            :label="item"
          />
        </el-checkbox-group>
      </el-dialog>
      <el-table
        id="out-table'"
        v-loading="loading"
        :data="tableData"
        @row-dblclick="rowClick"
        @expand-change="expandChange"
      >
        <!-- 展示摘要 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="summary">
              <img :src="props.row.thumb" alt />
              <el-form class="demo-table-expand" inline label-position="left">
                <el-form-item label="电影名">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="导演">
                  <span>{{ props.row.directors }}</span>
                </el-form-item>
                <el-form-item label="主演">
                  <span>{{ props.row.casts }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <!-- 开始循环 -->
        <template v-for="item in filterTableColumn">
          <!-- 自定义排序 -->
          <el-table-column v-if="item.label === '排序'" v-bind:key="item.label" label="排序">
            <template slot-scope="props">
              <input
                v-model="props.row.sorting"
                class="sort-input"
                type="number"
                @blur="handleSort(props.row.sorting, props.row)"
              />
            </template>
          </el-table-column>
          <!-- 正常表单列 -->
          <el-table-column
            v-if="!item.noRepeat"
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :label="item.label"
            :prop="item.prop"
            :show-overflow-tooltip="true"
            :width="item.width ? item.width : ''"
          ></el-table-column>
          <!-- 排序 评分 -->
          <el-table-column
            v-if="item.label === '评分'"
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :prop="item.prop"
            :width="item.width ? item.width : ''"
            label="评分"
            sortable
          ></el-table-column>
          <!-- 单元格编辑 -->
          <el-table-column
            v-if="item.label === '备注'"
            v-bind:key="item.label"
            :width="item.width"
            label="备注"
            prop="remark"
            show-overflow-tooltip
          >
            <template slot-scope="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div class="content" @click="handleEdit(props.row)">{{ props.row.remark }}</div>
                <div class="cell-icon" @click="handleCellEdit(props.row)"><i class="el-icon-edit"></i></div>
              </div>
              <div v-else class="table-edit">
                <el-input v-model="props.row.remark" placeholder></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)"><i class="el-icon-check"></i></div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)"><i class="el-icon-close"></i></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 推荐 -->
          <el-table-column v-if="item.label === '推荐'" v-bind:key="item.label" label="推荐">
            <template slot-scope="props">
              <el-switch
                v-model="props.row.recommend"
                active-color="#3963bc"
                @change="handleRecommend($event, props.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              v-for="(item, index) in operate"
              :key="index"
              :type="item.type"
              plain
              size="mini"
              @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
              >{{ item.name }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="!searchKeyword" class="pagination">
        <el-pagination
          v-if="refreshPagination"
          :background="true"
          :current-page="currentPage"
          :page-size="pageCount"
          :total="total_nums"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <source-code
      link="https://github.com/TaleLin/lin-cms-vue/blob/master/src/plugin/lin-cms-ui/view/table/table-combo.vue"
    ></source-code>
  </div>
</template>

<script>
import LinSearch from '@/component/base/search/lin-search'
import { tableColumn } from './data'
import movie from '../../model/movie.js'

export default {
  components: {
    LinSearch,
  },
  data() {
    return {
      tableData: [],
      loading: false,
      Hidden: true, // 默认隐藏自定义排序列
      searchKeyword: '',
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 180, // 分组内的用户总数
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      value: '',
      // 单元格编辑相关
      editRow: 0,
      showTooltip: true,
    }
  },
  computed: {},
  created() {
    // 获取数据
    this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)
    this.tableColumn = tableColumn
    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 定制列
    this.tempCheckList = tableColumn.map(v => v.label).slice()
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(v => this.checkList.indexOf(v.label) > -1)
  },
  methods: {
    // 获取数据
    _getTableData(start, count) {
      const res = movie.getTop250(start, count)
      res.map(item => {
        const temp = item
        temp.editFlag = false
        return ''
      })
      this.tableData = [...res]
    },

    rowClick(val) {
      console.log(val)
    },

    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(v => this.checkList.indexOf(v.label) > -1)
    },
    showRowOperateModal() {},

    // 变更排序
    handleSort(val, rowData) {
      console.log('rowData', rowData)
      this.$message({
        type: 'success',
        message: `排序已更改为：${val}`,
      })
    },

    // 推荐
    handleRecommend(val, rowData) {
      this.loading = true
      console.log(val, rowData)
      if (val) {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '推荐成功',
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '取消推荐',
          })
        }, 1000)
      }
    },

    expandChange(row, expandedRows) {
      console.log(row, expandedRows)
    },

    // 单元格编辑
    handleCellEdit(row) {
      row.editFlag = true // eslint-disable-line
      this.$set(this.filterTableColumn[7], 'width', 200)
      this.tempEditRemark = row.remark
      this.editRow++
    },
    handleCellSave(row) {
      row.editFlag = false // eslint-disable-line
      setTimeout(() => {
        this.editRow--
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }, 1000)
    },
    handleCellCancel(row) {
      row.editFlag = false // eslint-disable-line
      console.log(this.tempEditRemark)
      row.remark = this.tempEditRemark // eslint-disable-line
      this.editRow--
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      setTimeout(() => {
        this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)
        this.loading = false
      }, 1000)
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.handleCellEdit(row)
      console.log(index, row)
    },
    handleDelete(self, index, val) {
      console.log(val)
      self
        .$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          self.loading = true // eslint-disable-line
          setTimeout(() => {
            self.tableData.splice(index, 1)
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },

    // 搜索
    onQueryChange(query) {
      this.searchKeyword = query.trim()
      if (!query) {
        this._getTableData(0, 20)
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.tableData = movie.getDataByQuery(this.searchKeyword)
      }, 1000)
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    editRow() {
      if (this.filterTableColumn[7]) {
        this.editRow === 0 // eslint-disable-line
          ? this.$set(this.filterTableColumn[7], 'width', 200) // eslint-disable-line
          : null // eslint-disable-line
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .table-main {
    padding: 0 30px;
    margin-top: 30px;
  }

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell-icon {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-icon-edit {
      display: flex;
      margin-left: 20px;
      width: 50px;
      justify-content: space-between;

      .cell-cancel {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
      }

      .cell-save {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
        margin-right: -20px;
      }
    }
  }

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;

    img {
      width: 135px;
      height: 200px;
    }

    .demo-table-expand {
      font-size: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: row;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

// dialog
.tableSample ::v-deep .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}

.tableSample ::v-deep .el-dialog__header {
  padding-left: 30px;
}

.tableSample ::v-deep .el-dialog__body {
  padding: 30px;
}
</style>
