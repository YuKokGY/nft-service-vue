<template>
    <div class="container">
        <div class="title">
            添加创作方
            <span class="back" @click="back"> <i class="iconfont el-icon-back"></i> 返回 </span>
        </div>
        <div class="wrap">
            <el-row>
                <el-col :lg="16" :md="20" :xs="24">
                    <el-form
                        ref="form"
                        v-loading="loading"
                        :model="form"
                        :rules="rules"
                        label-width="100px"
                        status-icon
                        @submit.native.prevent
                    >
                        <el-form-item label="头像">
                            <upload-imgs ref="uploadEle" :max-num="max_num" :multiple="false" :rules="rules" />
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input
                                v-model="form.name"
                                autocomplete="off"
                                placeholder="请填写名称"
                                size="medium"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-switch
                                v-model="form.status"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="正常"
                                inactive-text="失效"
                            ></el-switch>
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
import model from '@/model/baseModel'
import UploadImgs from '@/component/base/upload-image/index'

export default {
    components: { UploadImgs },
    data() {
        // 校验输入框不能为空
        const validateAll = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('不能为空'))
            }
            callback()
        }
        return {
            loading: false,
            form: {
                name: '',
                type: 2,
                status: 1,
            },
            max_num: 1,
            rules: {
                name: [{ validator: validateAll, trigger: 'blur', required: true }],
                minWidth: 100,
                minHeight: 100,
                maxSize: 5,
            },
        }
    },
    methods: {
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        back() {
            this.$emit('createClose')
        },
        // 提交按钮
        async submitForm() {
            if ((await this.$refs.uploadEle.getValue())[0] !== undefined) {
                this.form.avatar = (await this.$refs.uploadEle.getValue())[0].display
            }
            const res = await model.create('/cms/creator/createOrUpdate', this.form)
            if (res.code < window.MAX_SUCCESS_CODE) {
                this.$message.success(`${res.message}`)
                this.$emit('createClose')
            } else this.$message.error(res.message)
        },
    },
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
