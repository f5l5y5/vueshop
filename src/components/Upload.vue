<template>
  <div>解冻凭证
    <el-upload
      ref="upload"
      :data="'http://10.10.1.197:8080'"
      :action="'http://10.10.1.197:8080/group1/upload'"
      list-type="picture-card"
      :on-success="uploadGoodsImgSuccess"
      :limit="6"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :file-list="files"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-upload
      ref="upload"
      :action="'http://10.10.1.197:8080/group1/upload'"
      :on-success="uploadGoodsImgSuccess"
      :file-list="files"
    >
    </el-upload>

  </div>
</template>

<script>
const appUploadUrl = 'http://10.10.1.197:8080'
export default {
  name: 'CancelFrozenVoucher',
  data () {
    return {
      upLoadUrl: 'http://10.10.1.197:8080', // 上传图片的地址
      files: []
    //   upLoadFileUrl: {
    //     path: 'http://oss.kaiyuanhotels.com/dfs/group1/default/' // 你掉接口携带的参数 就是你上传图片之后的路径地址
    //   }
    }
  },
  created () {
    console.log(appUploadUrl)
  },
  methods: {
    uploadGoodsImgSuccess (response) {
      console.log(response)
      if (response.status === 'fail') {
        this.$message.error(response.message)
      } else {
        this.$message.success('上传成功')
        this.files.push({
          url: response
        })
      }
    },
    // 图片超出限制
    handleExceed () {
      this.$message.warning('当前限制选择6个文件')
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg/png 格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleRemove (v) {
      this.files = this.files.filter((item) => {
        return item.url !== v.url
      })
    },
    handlePictureCardPreview (file) {
      console.log('--------------')
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
