<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId" clearable filterable placeholder="请选择小区">
        <el-option
          v-for="item in communityList"
          :key="item.index"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.status" style="width: 150px;" clearable filterable placeholder="请选择状态">
        <el-option
          v-for="item in statusList"
          :key="item.index"
          :label="item.val"
          :value="item.status">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.phone" placeholder="手机" style="width: 200px;"  autocomplete="off"></el-input>
      <el-input v-model="listQuery.idcard" placeholder="身份证" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <!-- <el-button type="primary"  @click="addRole">添加楼栋</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    > 
      <el-table-column label="所在小区" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.community | extract('communityName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人脸相片" align="center">
        <template slot-scope="scope">
           <span style="cursor: pointer;" @click="faceBigImg($event,scope.row.faceImageUrl)"><img :src="scope.row.faceImageUrl" width="40" height="30%"></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="{active : scope.row.status == '1' }">{{ scope.row.status | translate({0:'未审核',1:'已审核',2:'已过期'})}}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vailDate | parseTime( '{y}/{m}/{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="描述" >
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" fixed="right" width="168" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="examinePopup(scope.row)" :disabled="scope.row.status==1">{{scope.row.status==1 ? '已审核' : '审核'}}</el-button>
            <!-- <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button> -->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"  center>
      <div class="faceImg" v-show="dialogTitle=='人脸相片'">
        <img :src='faceImgUrl' alt="">
      </div>
      <div class="examineDate" v-if="dialogTitle=='提交审核'">
        <el-form label-width="110px"
          :inline="true"
          :model="formDate" 
          ref="formDate" 
          :rules="rules">
            <el-form-item label="隐藏id"  prop="id" v-if='false'>
              <el-input v-model="formDate.id" ></el-input>
            </el-form-item>
            <el-form-item label="选择有效期" prop="vailDate">
              <el-date-picker
                v-model="formDate.vailDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
              >
              </el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="submitForm('formDate')" :loading="false">提交</el-button>
        </el-form> 
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectCommunityList } from '@/api/house'
import { FaceInfoList, delFaceInfo, examine} from '@/api/userinfo'
import Pagination from '@/components/Pagination'
import { setTimeout, setInterval } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination
  },
  mixins:[publicIndex],
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      faceImgUrl:'',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        communityId:'',
        phone:'',
        status:'',
        idcard:''
      },
      formDate:{
        id:'',
        status:'1',
        vailDate:''
      },
      communityList:[],
      dialogTitle:'',
      statusList:[
        {status:0,val:'未审核'},
        {status:1,val:'已审核'},
        {status:2,val:'已过期'},
      ],
      rules:{
        vailDate:[
          { required: true, message:'选择有效期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
      this.fetchData()
      this.selectCommunityList()
      // this.cardReading()
      // this.total = 10
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      FaceInfoList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    // 请求小区列表
    selectCommunityList(){
      selectCommunityList().then(res=>{
        let { data } = res
        this.communityList = data
      })
    },
    //删除人脸
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFaceInfo({id}).then(res =>{
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
    // 查看大人脸图片
    faceBigImg(e,img){
      this.dialogTitle = '人脸相片'
      this.faceImgUrl=img
      this.dialogVisible= true;
    },
    // 审核弹窗
    examinePopup(e){
      this.dialogVisible=true;
      this.dialogTitle='提交审核';
      this.formDate.id=e.id;
      this.$nextTick(function(){
        this.$refs['formDate'].clearValidate()
        this.$refs['formDate'].resetFields()
      })
    },
    examine(){
      // console.log(e)
      examine(this.formDate).then(res=>{
        if(res.code==200){
          this.$message({
            type: 'success',
            message: '审核成功!'
          });
          this.fetchData()
        }
      })
    },
    //确认提交
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        if(valid){
          this.examine()
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
<style scope>
.faceImg{
  text-align: center;
}
.faceImg img{
  max-width: 50%;
}
</style>


