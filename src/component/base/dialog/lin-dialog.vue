<template>
  <div class="container">
    <el-dialog :append-to-body="true" :visible.sync="dialogFormVisible" title="编辑分组">
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="stylus" scoped></style>
