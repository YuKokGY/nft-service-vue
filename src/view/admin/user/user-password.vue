<template>
  <div class="container">
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="100px"
      status-icon
    >
      <el-form-item label="密码" prop="new_password">
        <el-input v-model="form.new_password" autocomplete="off" clearable size="medium" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" label-position="top" prop="confirm_password">
        <el-input v-model="form.confirm_password" autocomplete="off" clearable size="medium" type="password"></el-input>
      </el-form-item>
      <el-form-item v-show="false">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'

export default {
  props: ['id'],
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.confirm_password !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        new_password: '',
        confirm_password: '',
      },
      // 验证规则
      rules: {
        new_password: [{validator: validatePassword, trigger: 'blur', required: true}],
        confirm_password: [{validator: validatePassword2, trigger: 'blur', required: true}],
      },
    }
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      if (this.form.new_password === '' && this.form.confirm_password === '') {
        this.$emit('handlePasswordResult', true)
        return
      }
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          let res
          try {
            this.loading = true
            res = await Admin.changePassword(this.form.new_password, this.form.confirm_password, this.id) // eslint-disable-line
          } catch (e) {
            this.loading = false
            console.log(e)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.loading = false
            this.$message.success(`${res.message}`)
            this.resetForm(formName)
            this.$emit('handlePasswordResult', true)
          } else {
            this.loading = false
            this.$message.error(`${res.message}`)
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
          this.$emit('handlePasswordResult', false)
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
