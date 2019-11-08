<template>
  <div class="app-container">
    <div class="head_box">
      <!-- <el-select v-model="listQuery.communityId"  @change='buildingList' clearable filterable placeholder="请选择小区">
        <el-option
          v-for="item in CommunityList"
          :key="item.index"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.mansionId" clearable filterable placeholder="请选择楼栋">
        <el-option
          v-for="item in NewmansionList"
          :key="item.index"
          :label="item.buildingName"
          :value="item.id">
        </el-option>
      </el-select> -->
      <ul class="search_list">
        <li>
          <buildingselect :idList.sync="listQuery.roomIds" ></buildingselect>
        </li>
        <li>
          <el-input v-model="listQuery.name" placeholder="电表名称" style="width: 200px;"  autocomplete="off"></el-input>
        </li>
        <li>
          <el-input v-model="listQuery.IMEI" placeholder="请填IMEI" style="width: 200px;"  autocomplete="off"></el-input>
        </li>
        <li>
          <div style="width:380px" >
            <el-date-picker
              v-model="listQuery.dateTime"
              type="datetimerange"
              range-separator="至"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </li>
        <li>
          <el-button type="primary" @click="handleFilter"  icon="el-icon-search">抄表</el-button>
          <el-button type="primary"  @click="addRole">添加电表</el-button> 
          <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">
          导出 Excel
          </el-button>
        </li>
      </ul>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      ref="table"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
      align="center"
      type="selection"
      
      width="40">
      </el-table-column>
      <el-table-column label="电表名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="IMEI" align="center">
        <template slot-scope="scope">
          {{ scope.row.IMEI }}
        </template>
      </el-table-column>
      <el-table-column label="电表位置"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomnum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前电表读数"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用度数"  align="center">
        <template slot-scope="scope">
          <span class='active'>{{ scope.row.userNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态" >
        <template slot-scope="scope">
          <el-popover
            ref="popover2"
            placement="top"
            trigger="click"
           >
            <p style="text-align: center; color: #409eff;">{{stateContent}}</p>
            <el-button type="primary"  slot="reference"  size="mini" @click="seeState(scope.row)">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" fixed="right" width="248" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row,'modify')">修改</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row,'record')">用电记录</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData(true)" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center>
      <div class="modify" v-if="dialogTitle!='用电记录'">
        <el-form  
        size="small"
        class="form_style number_style"
        label-width="110px"
        :model="form" 
        ref="form" 
        :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="隐藏id" prop="id" v-show="false">
                <el-input v-model="form.id" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="IMEI号" prop="IMEI">
                <el-input v-model="form.IMEI" :disabled="isDisabled" controls-position="right" :min="1"></el-input>
              </el-form-item>
              <el-form-item label="电表名称" prop="name">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IMSI号" prop="IMSI">
                <el-input v-model="form.IMSI" :disabled="isDisabled" controls-position="right" :min="1"></el-input>
              </el-form-item>
              <el-form-item label="选择房间" prop="roomIds">
                <!-- <el-select v-model="form.roomIds" filterable :disabled="disabled" placeholder="请选择">
                  <el-option v-for="item in mansionList" :key="item.index" :label="item.buildingName" :value="item.id">
                  </el-option>
                </el-select> -->
                <Buildingselect :idList.sync="form.roomIds"></Buildingselect>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="record" v-if="dialogTitle=='用电记录'">
        <div>
          <el-row :gutter="20">
            <el-col :span="16" >
              <el-date-picker
                v-model="log.dateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                :picker-options="pickerOptions"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <el-button type="primary"  @click="queryLog">查询</el-button>
            </el-col>
          </el-row>
          <div style="margin-top:20px">
            <el-table
              v-loading="listLoading"
              :data="logList"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="IMEI号" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.imei}}</span>
                </template>
              </el-table-column>
              <el-table-column label="度数" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.number}}</span>
                </template>
              </el-table-column>
              <el-table-column label="推送时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>
            </el-table>
             <pagination v-show="totalLog>10" :total="totalLog" small :pageNum.sync="log.pageNum" :pageSize.sync="log.pageSize" @pagination="queryLog(false)" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-show='dialogTitle!="用电记录"'>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { elecMeterList, buildingList, delElecMeter, addelecMeter, logList,seeStateList,elecMeterDetails,excelList} from '@/api/equip'
import { selectCommunityList, MansionHouseList } from '@/api/house'
import Buildingselect from '@/components/Buildingselect';
import { MansionList } from '@/api/userinfo';
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { setTimeout } from 'timers';
import { log } from 'util';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    Buildingselect
  },
  mixins:[publicIndex],
  data() {
    return {
      pickerOptions:{
        disabledDate(time) {
            return time.getTime() > Date.now();
          }
      },
      exportList:[],
      list: null,
      downloadLoading:false,
      dialogTitle:'添加电表',
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      disabled:false,
      isDisabled:false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        roomIds:[],
        dateTime:[],
        IMEI:'',
        name:'',
        ids:[]
      },
      form:{
        id: "",
        name: "",
        IMEI: "",
        IMSI: "",
        address: "",
        roomIds:[],
      },
      mansionPar: {
        pageNum: 1,
        pageSize: 10,
        communityId:'',
        buildingName:''
      },
      log:{
        dateTime:[],
        deviceId:'',
        pageNum: 1,
        pageSize: 10,
      },
      logList:null,
      totalLog:0,
      CommunityList:[],
      mansionList:[],
      NewmansionList:[],
      stateContent:'',
    }
  },
  created() {
      this.fetchData()
      // this.buildingList()
      this.selectCommunityList()
      this.MansionHouseList()
  },
  methods: {
    //请求列表
    fetchData(flag=false) {
      let param = this.listQuery;
      // flag ? (param.ids=[]) : param
      if(flag){
        this.$nextTick(()=>{
          this.$refs.table.clearSelection('selection')
        })
      }
      
      this.listLoading = true
      elecMeterList(param).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
        // this.listQuery.ids=[] 
        if(param.ids.length>0){
          this.$nextTick(()=>{
            this.checked(this.list)
          })
        }
      })
    },
    // 请求楼栋
    MansionList(id){
      MansionList({communityId:id,buildingName:'',pageNum:'',pageSize:''}).then(res=>{
        this.NewmansionList = res.data
        // console.log(res)
      }).catch(err=>{
        // console.dir(err)
        
      })
    },
    // 搜索按钮
    handleFilter(){
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 添加的时候楼栋接口
    MansionHouseList(){
      MansionHouseList().then(res =>{
        if (res.code ==200 && res.data.length>0) {
          let { data } = res
          // console.log(data)
          this.mansionList = data
        }
      })
    },
    // 请求小区 
    selectCommunityList(){
      selectCommunityList().then(res=>{
        this.CommunityList = res.data
      })
    },
     // 动态请求楼栋
    buildingList(e){
      this.listQuery.mansionId='';
      this.MansionList(e)
    },

    //删除机构
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delElecMeter({id}).then(res =>{
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
    //点击添加设备
    addRole(){
      this.dialogVisible = true;
      this.disabled = false;
      this.dialogTitle='添加电表'
      this.isDisabled=false;
      this.resetForm()
      this.$nextTick(()=>{
        this.$refs['form'].clearValidate()
      })
      // this.form = {};
    },
    //点击修改按钮
    revise(row,type){
      if(type=='modify'){
        this.dialogVisible = true;
        this.disabled = true;
        this.dialogTitle='修改电表'
        this.isDisabled=true;
        this.resetForm()
        this.$nextTick(()=>{
          this.$refs['form'].clearValidate()
        })
        this.elecMeterDetails(row.id)
      }else if(type=='record'){
        this.dialogVisible = true;
        this.disabled = true;
        this.dialogTitle='用电记录'
        this.log.IMEI= row.IMEI;
        this.totalLog = 0;
        this.logList = null;
        this.queryLog(true)
      }
     
    },
    // 电表详情
    elecMeterDetails(e){
      elecMeterDetails({id:e}).then(res=>{
        if(res.code==200){
          let data=res.data;
          let from = this.form
          for(var item in from) {
            from[item] = data[item]
          }
          if(from.roomIds==null){
            from.roomIds=[];
          }
          this.listLoading = false
        }
      }).catch(err=>{
        
      })
    },
    // 查询用电记录
    queryLog(flag){
      if(flag){
        this.log.pageNum=1
      }
      logList(this.log).then(res=>{
        // console.log(res)
        if(res.code==200){
          this.logList=res.data.entryList;
          this.totalLog = res.data.totalCount;
          this.listLoading = false
        }
      })
    },
    // 查看状态
    seeState(e){
      seeStateList({deviceId:e.deviceId}).then(res=>{
        if(res.code==200){
          this.stateContent=res.data;
        }
      })
    },
    resetForm(){
      this.form={
        id: "",
        name: "",
        IMEI: "",
        IMSI: "",
        address: "",
        roomIds: [],
      }
    },
    checked(rows){
        rows.forEach(row=>{
          this.$refs.table.toggleRowSelection(row);
        })  
    },
    // 表格多选
    handleSelectionChange(val){
      // console.log(val)
      this.listQuery.ids=[]
      let data = this.listQuery.ids
      val.forEach(item => {
          // console.log(item['id'])
          data.push(item['id'])
      });
    },
    // 请求导出列表数据
    excelList(){
      excelList(this.listQuery).then(response => {
        this.exportList = response.data;
        this.listQuery.ids=[]
        // console.log( this.exportList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['电表名称', 'IMEI', 'IMSI', '电表位置', '当前电表读数', '使用度数','地址','创建时间']
          const filterVal = ['name', 'IMEI', 'IMSI','roomnum', 'number','userNumber','address','createDate']
          const list = this.exportList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      })
    },
    //导出exec
    handleDownload() {
      this.downloadLoading = true;
      this.excelList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createDate') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addelecMeter(params).then(res=>{
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
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
<style scoped>
.head_box{
  margin-bottom: 0;
}
.search_list{
  display: flex;
  align-content: flex-start;
  list-style: none;
  flex-wrap:wrap;
  padding: 0;
  margin: 0;
}
.search_list li{
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
