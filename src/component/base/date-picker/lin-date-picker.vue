<template>
  <div class="container">
    <el-date-picker
      v-model="value"
      :default-time="['00:00:00', '23:59:59']"
      :picker-options="pickerOptions"
      align="right"
      end-placeholder="结束日期"
      popper-class="date-box"
      range-separator="至"
      size="medium"
      start-placeholder="开始日期"
      type="daterange"
      value-format="yyyy-MM-dd HH:mm:ss"
    >
    </el-date-picker>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 7))
            picker.$emit('pick', [start, end])
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 30))
            picker.$emit('pick', [start, end])
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 90))
            picker.$emit('pick', [start, end])
          },
        }],
      },
    }
  },
  watch: {
    value(date) {
      this.$emit('dateChange', date)
    },
  },
  methods: {
    clear() {
      this.value = ''
    },
  },
}
</script>
