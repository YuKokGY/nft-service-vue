<template>
  <div class="container">
    <div class="title">
      <span>修改商品</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :xs="24">
          <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="100px" status-icon
                   @submit.native.prevent>
            <el-form-item label="商品图片">
              <upload-imgs ref="uploadEle3" :max-num="max_num" :multiple="false" :rules="rules"
                           :value="[{display:form.spu_theme_img}]"/>
            </el-form-item>
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="form.title" autocomplete="off" placeholder="请填写商品名称" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="subtitle">
              <el-input v-model="form.subtitle" placeholder="请填写商品描述" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="form.price" placeholder="请填写商品价格" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="商品标签" prop="tags">
              <el-input v-model="form.tags" placeholder="请填写商品标签" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="是否上架" prop="online">
              <el-switch v-model="form.online" :active-value="1" :inactive-value="0"></el-switch>
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
  import spu from '@/model/baseModel'
  import UploadImgs from '@/component/base/upload-image/index'

  export default {
    components: {UploadImgs},
    props: {
      editSpu: {},
    },
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
        id: this.editSpu.id,
        spu_theme_img: this.editSpu.spu_theme_img,
        title: this.editSpu.title,
        subtitle: this.editSpu.subtitle,
        price: this.editSpu.price,
        tags: this.editSpu.tags,
        online: this.editSpu.online,
      },
      max_num: 1,
      rules: {
        title: [{validator: validateTitle, trigger: 'blur', required: true}],
        subtitle: [{validator: validateSubTitle, trigger: 'blur', required: true}],
        price: [{validator: validatePrice, trigger: 'blur', required: true}],
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      }
    }
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
    // 提交按钮
    async submitForm() {
      this.form.spu_theme_img = (await this.$refs.uploadEle3.getValue())[0].display
      const res = await spu.update('/cms/spu/updateSpu', this.form)
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.$emit('editClose')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
