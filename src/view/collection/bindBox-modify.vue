<template>
    <div class="container">
        <div class="title">
            编辑盲盒
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
                                style="width: 300px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="缩略图" prop="short_img_url">
                            <upload-imgs ref="uploadEle" :max-num="max_num" :multiple="false" :rules="rules" />
                        </el-form-item>
                        <el-form-item label="主图" prop="img_url">
                            <upload-imgs ref="uploadEle1" :max-num="max_num" :multiple="false" :rules="rules" />
                        </el-form-item>
                        <el-form-item label="发行须知" prop="notice" style="width: 1100px">
                            <el-input
                                v-model="form.notice"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                                placeholder="请输入内容"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="价格" prop="price">
                            <el-input
                                v-model.number="form.price"
                                autocomplete="off"
                                oninput="value=value.replace(/[^\d.]/g,'')"
                                placeholder="请填写金额"
                                size="medium"
                                style="width: 300px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="铸造数量" prop="mold_count">
                            <el-input
                                v-model.number="form.mold_count"
                                autocomplete="off"
                                placeholder="铸造数量"
                                size="medium"
                                style="width: 300px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="库存" prop="stock">
                            <el-input
                                v-model.number="form.stock"
                                autocomplete="off"
                                placeholder="库存"
                                size="medium"
                                style="width: 300px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="发售时间" prop="sale_time">
                            <el-date-picker
                                v-model="form.sale_time"
                                clearable
                                placeholder="选择日期时间"
                                type="datetime"
                                @clear="form.sale_time = null"
                            >
                            </el-date-picker>
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
    beforeMount() {
        this.form = this.editInfo
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
                name: '',
                status: 2,
                price: 0.0,
                stock: 0,
                mold_count: 0,
                notice: '',
            },
            max_num: 1,
            status: [{ label: '上架', value: 1 }, { label: '下架', value: 2 }, { label: '售罄', value: 3 }],
            creatorList: [],
            issueList: [],
            categoryList: [],
            rules: {
                notice: [{ validator: validateAll, trigger: 'blur', required: true }],
                img_url: [{ validator: validateAll, trigger: 'blur', required: true }],
                short_img_url: [{ validator: validateAll, trigger: 'blur', required: true }],
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
            await this.$refs['form'].validate(async valid => {
                if (valid) {
                    if ((await this.$refs.uploadEle.getValue())[0] !== undefined) {
                        this.form.short_img_url = (await this.$refs.uploadEle.getValue())[0].display
                    }
                    if ((await this.$refs.uploadEle1.getValue())[0] !== undefined) {
                        this.form.img_url = (await this.$refs.uploadEle1.getValue())[0].display
                    }
                    const res = await model.create('/cms/bindBox/createOrUpdate', this.form)
                    if (res.code < window.MAX_SUCCESS_CODE) {
                        this.$message.success(`${res.message}`)
                        this.$emit('editClose')
                    } else this.$message.error(res.message)
                }
            })
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
