<template>
  <div class="lin-container">
    <div class="lin-title">图片上传演示</div>
    <div class="lin-wrap">
      <el-form label-width="220px">
        <el-form-item label="普通示例">
          <upload-imgs ref="uploadEle3" :multiple="true" :rules="rules"/>
          <div>
            <el-button @click="getValue('uploadEle3')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="禁用">
          <upload-imgs ref="uploadEle4" :disabled="true" :multiple="true"/>
          <div>
            <el-button @click="getValue('uploadEle4')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="动图检测示例">
          <upload-imgs ref="uploadEle32" :animated-check="true" :multiple="true" :rules="rules2"/>
          <div>
            <el-button @click="getValue('uploadEle32')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="禁用+初始化">
          <upload-imgs ref="uploadEle5" :disabled="true" :multiple="true" :rules="rules" :value="initData"/>
          <div>
            <el-button @click="getValue('uploadEle5')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="带初始化, 限制4至7张">
          <upload-imgs ref="uploadEle1" :max-num="7" :min-num="4" :multiple="true" :rules="rules" :value="initData"/>
          <div>
            <el-button @click="getValue('uploadEle1')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="初始化, 可多选, 不立即上传">
          <upload-imgs ref="uploadEle2" :auto-upload="false" :multiple="true" :rules="rules" :value="initData"/>
          <div>
            <el-button @click="getValue('uploadEle2')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="禁用+初始化+不预览">
          <upload-imgs
            ref="uploadEle7"
            :disabled="true"
            :multiple="true"
            :preview="false"
            :rules="rules"
            :value="initData"
          />
          <div>
            <el-button @click="getValue('uploadEle7')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="排序+固定数量">
          <upload-imgs ref="uploadEle8" :max-num="3" :min-num="3" :multiple="true" :rules="rules" :sortable="true"/>
          <div>
            <el-button @click="getValue('uploadEle8')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="仅最大数量">
          <upload-imgs :max-num="3" :multiple="true" :rules="rules"/>
        </el-form-item>
        <el-form-item label="定制宽高+排序">
          <upload-imgs :height="150" :rules="rules" :sortable="true" :value="initData" :width="200"/>
        </el-form-item>
        <el-form-item label="重新初始化">
          <upload-imgs ref="uploadEle9" :height="150" :rules="rules" :sortable="true" :value="initData1" :width="200"/>
          <div>
            <el-button @click="changeData">重新初始化</el-button>
            <el-button @click="doClear">清空</el-button>
            <el-button @click="getValue('uploadEle9')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="远程方法">
          <el-radio-group v-model="remoteName">
            <el-radio label="remoteFucAsync">失败promise</el-radio>
            <el-radio label="remoteFuc">失败回调</el-radio>
            <el-radio label="remoteFucSuccessAsync">成功promise</el-radio>
            <el-radio label="remoteFucSuccess">成功回调</el-radio>
          </el-radio-group>
          <upload-imgs ref="uploadEle13" :multiple="true" :remote-fuc="remoteNameObj[remoteName]" :rules="rules"/>
          <div>
            <el-button @click="getValue('uploadEle13')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
        <el-form-item label="图像缩略图展示模式">
          <el-radio-group v-model="fit">
            <el-radio label="fill">fill</el-radio>
            <el-radio label="contain">contain</el-radio>
            <el-radio label="cover">cover</el-radio>
            <el-radio label="none">none</el-radio>
            <el-radio label="scale-down">scale-down</el-radio>
          </el-radio-group>
          <upload-imgs :fit="fit" :height="150" :rules="rules" :value="initData" :width="200"/>
        </el-form-item>
        <el-form-item label="自定义校验函数">
          <upload-imgs ref="uploadEle33" :before-upload="beforeFuc" :multiple="true" :rules="rules"/>
          <div>
            <el-button @click="getValue('uploadEle33')">获取当前图像数据</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'

/** 生成随机字符串 */
function createId() {
  return Math.random()
    .toString(36)
    .substring(2)
}

export default {
  name: 'ImgsUploadStage1',
  components: {
    UploadImgs,
  },
  data() {
    return {
      remoteName: 'remoteFucAsync',
      remoteNameObj: {
        remoteFucAsync: this.remoteFucAsync,
        remoteFuc: this.remoteFuc,
        remoteFucSuccessAsync: this.remoteFucSuccessAsync,
        remoteFucSuccess: this.remoteFucSuccess,
      },
      fit: 'cover',
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      rules2: {
        minWidth: 100,
        maxWidth: 2000,
        allowAnimated: 1,
      },
      initData1: [
        {
          id: '123',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg',
          imgId: '123dk98',
        },
        {
          id: '12d3',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
          imgId: 'sd9873429',
        },
        {
          id: 'hahah',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
          imgId: 'ccsd2123',
        },
      ],
      initData: [
        {
          id: '123',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          imgId: '12381900',
        },
        {
          id: '12d3',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
          imgId: '238287',
        },
        {
          id: 'hahah',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
          imgId: '1232323',
        },
      ],
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
  },
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {
    async beforeFuc() {
      this.$message.error('进入自定义校验函数, 并返回false终止上传')
      return false
    },
    async getValue(name) {
      console.log((await this.$refs[name].getValue())[0].display)
      // eslint-disable-next-line
      alert('已获取数据, 打印在控制台中')
    },
    doClear() {
      this.$refs.uploadEle9.clear()
    },
    changeData() {
      this.initData1 = [
        {
          id: 'hahah',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
          imgId: '2477899809',
        },
        {
          id: '12d3',
          display:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          src: '/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
          imgId: '4dfg43234',
        },
      ]
    },
    remoteFucAsync() {
      return Promise.resolve(false)
    },
    remoteFuc(file, cb) {
      setTimeout(() => {
        cb(false)
      }, 3000)
    },
    remoteFucSuccessAsync() {
      return Promise.resolve({
        id: createId,
        url: 'http://dev.koa.7yue.pro/assets/2019/06/30/abc823a9-5ef4-48e1-bdf6-dd4f0ab92482.jpg',
      })
    },
    remoteFucSuccess(file, cb) {
      setTimeout(() => {
        cb({
          id: createId,
          url: 'http://dev.koa.7yue.pro/assets/2019/06/30/abc823a9-5ef4-48e1-bdf6-dd4f0ab92482.jpg',
        })
      }, 3000)
    },
  },
}
</script>

<style lang="scss" scoped></style>
