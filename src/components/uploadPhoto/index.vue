<template>
  <div class="app-container">
    <el-upload
      class="avatar-uploader"
      name='fileInfo'
      action="https://www.weaving-comm.com/fileUploadService/upload/imageUpload.do"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrls" :src="imageUrls" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>

export default {
  data() {
    return {
      listLoading: true,
      loading:false,
      total:0,
      // imageUrl:''
    }
  },
  props:{
    imageUrl:{
      default:'',
      type:String
    }
  },
  created() {
  },
  computed:{
    imageUrls:{
      get(){
        return this.imageUrl
      },
      set(val){
        this.$emit('update:imageUrl', val)
      }
    }
  },
  watch:{

  },
  methods: {
    handleAvatarSuccess(res, file,fileList) {
        // this.form.image = URL.createObjectURL(file.raw);
        this.imageUrls = res.pojo;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return  isLt2M;
    },
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
