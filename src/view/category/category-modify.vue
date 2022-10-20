<template>
    <div class="container">
        <div class="title">
            编辑系列
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
                        <el-form-item label="名称" prop="name">
                            <el-input
                                v-model="form.name"
                                autocomplete="off"
                                placeholder="请填写名称"
                                size="medium"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status">
                                <el-option
                                    v-for="item in status"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
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
    props: {
        editInfo: {},
    },
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
                id: this.editInfo.id,
                name: this.editInfo.name,
                status: this.editInfo.status,
            },
            max_num: 1,
            status: [{ label: '正常', value: 1 }, { label: '失效', value: 0 }],
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
            this.$emit('editClose')
        },
        // 提交按钮
        async submitForm() {
            const res = await model.create('/cms/category/createOrUpdate', this.form)
            if (res.code < window.MAX_SUCCESS_CODE) {
                this.$message.success(`${res.message}`)
                this.$emit('editClose')
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
