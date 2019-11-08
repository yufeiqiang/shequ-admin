<template>
  <div class="components-container content-box">
    <el-form  
      label-width="110px"
      :model="form" 
      ref="form" 
      :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input  v-model="form.title" ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="1" :max="6"></el-input-number >
        </el-form-item>
        <el-form-item label="发布类型" prop="type">
          <el-select v-model="form.type" :disabled='disabled' filterable placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.type"
              :label="item.val"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <upload-photo @imgUrl="imgUrl" :imageUrl.sync="form.image"></upload-photo> 
        </el-form-item>
        <el-form-item label="内容" prop="orderNum">
          <div>
            <tinymce v-model="form.newsInfor" ref="richText" :height="300" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')" :loading="loading">提 交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { posterDetails, addPoster } from '@/api/poster'
import UploadPhoto from '@/components/uploadPhoto'
// import { setTimeout } from 'timers';

export default {
  components:{
    Tinymce,
    UploadPhoto
  },
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      loading:false,
      dialogImageUrl:'',
      disabled:false,
      typeList:[
        {
          val:'轮播图',
          type:"1"
        },
        {
          val:'活动资讯',
          type:"2"
        }
      ],
      form:{
        id:'',
        image:'',
        orderNum:'',
        title:'',
        type:'',
        newsInfor:`<h1 style="text-align: center;">你好!</h1>`
      },
      rules:{
        type:[
          { required: true, message: '请选择发布类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.form.id=this.$route.query.id;
    if(this.form.id){
      this.posterDetails();
      this.disabled=true
    }
  },
  methods: {
    // 点击详情请求回来数据
    posterDetails(){
      posterDetails({id:this.form.id}).then(res=>{
        console.log(res)
        if(res.code==200){
          let {id,image,orderNum,title,newsInfor,type} = res.data;
          this.form={id,image,orderNum,title,newsInfor,type}
          }
      })
    },
    // 添加资讯
    insert(params){
      this.loading = true;
      addPoster(params).then(res=>{
        if(res.code==200){
          this.$message({
            type: 'success',
            message:res.message
          });
          this.loading = false;
          this.$router.push({path:'banner',query:{}})
        }
      }).catch((error)=>{
          this.loading = false;
      })
    },
    //确认提交
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        if(valid){
          this.insert(this.form)
        }
      })
    },
    // 重置
    resetForm(formName) {
        if(this.form.id){
          this.form.image='' 
          this.form.title=''
          this.form.newsInfor=''
        } else {
          this.form={}
        }
        // this.$refs[formName].resetFields();
        this.$refs.richText.setContent('')
    },
    // 接受图片
    imgUrl(e){
      this.form.image=e
    }
  }
}
</script>
<style>
  .content-box{
    padding: 20px;
  }
</style>

