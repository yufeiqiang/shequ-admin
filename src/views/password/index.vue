<template>
  <div class="app-container">
      <h4>修改密码</h4>
      <el-form  
      label-width="110px"
      :model="form" 
      ref="form" 
      :rules="rules" class="el_form_pass">
        <el-form-item label="原密码" prop="password">
          <el-input type="password" v-model="form.password" style="width:400px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="form.pass" style="width:400px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="newPassword">
          <el-input type="password" v-model="form.newPassword"  style="width:400px" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <div style="padding-left:112px;">
          <el-button @click="back">返回</el-button>
          <el-button type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import { changePass } from '@/api/app'
import { setTimeout } from 'timers';
import { mapActions } from 'vuex'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.password !== '') {
          this.$refs.form.validateField('password');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      listLoading: true,
      loading:false,
      form:{
        password:'',
        pass:'',
        newPassword:''
      },
      rules:{
        pass:[
            {required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPassword: [
            {required: true, validator: validatePass2, trigger: 'blur' }
        ],
        password:[
           {required: true, message: '原密码必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    
  },  
  methods: {
    changePass(param){
      changePass(param).then(res=>{
        if(res.code==200){
          this.$message({
            type: 'success',
            message: '修改成功，重新登录!'
          });
          setTimeout(()=>{
            this.resetToken()
            this.$router.push({path:'/login',query:{}})
          },800)
        }
      })
    },
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        if(valid){
          let pass=this.form;
          delete pass.pass
          this.changePass(pass)
        }
      })
    },
    // 返回
    back(){
      this.$router.go(-1)
    },
    ...mapActions('user',[
      'resetToken'
    ])
  }
}
</script>
<style scoped>
.el_form_pass{
  text-align: left;
}
</style>


