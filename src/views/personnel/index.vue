<template>
  <div class="app-container">
    <div class="head_box">
      <el-input v-model="listQuery.servicemanName" placeholder="名字" style="width: 200px;" autocomplete="off"></el-input>
      <el-input v-model="listQuery.phone" placeholder="手机" style="width: 200px;" autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加维修人员</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="名字"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.servicemanName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="性别"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.image" width="40" height="40"></span>
        </template>
      </el-table-column> -->
      <el-table-column label="身份证" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.organization | extract('organizationName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="修改时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="148" fixed="right" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog title="添加维修人员" :visible.sync="dialogVisible"  center>
      <el-form  
      size="small"
      class="form_style number_style"
      label-width="110px"
      :model="form" 
      ref="form" 
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名字" prop="servicemanName">
              <el-input v-model="form.servicemanName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="性别" class="style_left" prop="sumArea">
              <el-radio-group v-model="form.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份证" prop="countFloor">
              <el-input v-model="form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="图片" class="photo_style" prop="countFloor">
              <upload-photo @imgUrl="imgUrl" :imageUrl.sync="form.image"></upload-photo>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {ServicemanList, delRepairPerson, addRepairPerson } from '@/api/repair'
import Pagination from '@/components/Pagination'
import UploadPhoto from '@/components/uploadPhoto'
import { setTimeout } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    UploadPhoto
  },
  mixins:[publicIndex],
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        servicemanName:'',
        phone:'',
        communityId:''
      },
      form:{
        id: "",
        servicemanName: "",
        phone: "",
        address: "",
        sex: "",
        image: "",
        idcard: ""
      },
    }
  },
  created() {
      this.fetchData()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      ServicemanList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        // console.log(this.list)
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    //删除
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRepairPerson({id}).then(res =>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    resetForm(){
      this.form={
        id: "",
        servicemanName: "",
        phone: "",
        address: "",
        sex: "",
        image: "",
        idcard: ""
      }
    },
    //点击添加角色按钮
    addRole(){
      this.dialogVisible = true;
      // this.form = {};
      this.resetForm()
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //点击修改按钮
    revise(row){
      this.dialogVisible = true;
      this.form = Object.assign({}, row)
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addRepairPerson(params).then(res=>{
        if(res.code==200){
          this.$message({
            type: 'success',
            message:res.message
          });
          this.fetchData();
          this.loading = false;
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
          delete  this.form.pass
          console.log(this.form)
          this.dialogVisible = false;
        }
      })
    },
    // 接受图片
    imgUrl(e){
      this.form.image=e
    }
  }
}
</script>
