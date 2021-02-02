<template>
  <div class="container">
    <div class="title">创建商品</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :xs="24">
          <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="100px" status-icon
                   @submit.native.prevent>
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="form.title" autocomplete="off" placeholder="请填写商品名称" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="subtitle">
              <el-input v-model="form.subtitle" :autosize="{ minRows: 4, maxRows:8 }" placeholder="请填写商品描述"
                        size="medium" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="form.price" placeholder="请填写商品价格" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="商品标签" prop="tags">
              <el-input v-model="form.tags" placeholder="请填写商品标签" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="是否上架" prop="online">
              <el-switch v-model="form.online" active-value="上架" inactive-value="下架"></el-switch>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import spu from '@/model/spu'

export default {
  data() {
    // 校验输入框不能为空
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('商品名称不能为空'))
      }
      callback()
    }
    const validatePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('价格不能为空'))
      }
      callback()
    }
    const validateSubTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('描述不能为空'))
      }
      callback()
    }
    return {
      loading: false,
      form: {
        title: '',
        subtitle: '',
        price: '',
        tags: '',
        online: '下架'
      },
      rules: {
        title: [{validator: validateTitle, trigger: 'blur', required: true}],
        subtitle: [{validator: validateSubTitle, trigger: 'blur', required: true}],
        price: [{validator: validatePrice, trigger: 'blur', required: true}]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 提交按钮
    async submitForm() {
      if (this.form.online === '上架') {
        this.form.online = 1
      } else {
        this.form.online = 0
      }
      const res = await spu.createSpu(this.form)
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.$router.push('/spu/list')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
