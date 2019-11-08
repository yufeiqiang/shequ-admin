<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId" clearable filterable placeholder="请选择机构">
        <el-option
          v-for="item in communitySelectList"
          :key="item.id"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.realName" placeholder="请输入用户名" style="width: 200px;"  autocomplete="off"></el-input>
      <el-input v-model="listQuery.username"  placeholder="请输入手机号" style="width: 200px;" autocomplete="off"></el-input>
      <el-input v-model="cardNumber" @focus="cardReading('cardNumber')" clearable  placeholder="读取门禁卡" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加用户</el-button>
      <UploadExcel url="https://www.weaving-comm.com/community/ImportExcelContrller/importUserExcel.do"
        @SuccessReset="SuccessReset">
      </UploadExcel>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="所属小区"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.communityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼栋/房间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mansionHouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="身份证" align="center">
        <template slot-scope="scope">
          {{ scope.row.idcard }}
        </template>
      </el-table-column> -->
      <el-table-column label="手机 / 账号"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生年月"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | parseTime( '{y}/{m}/{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userCategory | translate({2:'普通住户',1:'业主'}) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.image" width="40" height="40"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="修改时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="权限设置" width="140" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.power" 
          active-text="启用"
          inactive-text="禁止"
          @change="updatePower($event,scope.row)"
          active-value='1' inactive-value='0'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="316" label="操作"  fixed="right">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row,'delUserinfo')">删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" @click="binding(scope.row)">绑定</el-button>
            <el-button type="primary" size="mini" @click="doorCard(scope.row)">门卡</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center :class="{user_dialog:dialogTitle=='管理门卡'}">
      <div class="form" v-show="dialogTitle=='修改用户' || dialogTitle=='添加用户'">
         <el-form  
          size="small"
          class="form_style number_style"
          label-width="110px"
          :model="form" 
          ref="form" 
          :rules="rules">
            <el-row>
              <el-col :span="12">
                <el-form-item label="隐藏id" :label-width="formLabelWidth" prop="id" v-show="false">
                  <el-input v-model="form.id" :disabled="isDisabled" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth" prop="username">
                  <el-input v-model="form.username" :disabled="isDisabled" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房间"  :prop="idList" v-show="idList">
                  <el-cascader
                    :options="options2"
                    @active-item-change="handleItemChange"
                    :props="props"
                    v-model="form.idList"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="身份证" prop="idcard">
                  <el-input v-model="form.idcard"></el-input>
                </el-form-item>
                <el-form-item label="出生年月" prop="birthday">
                  <el-date-picker 
                  v-model="form.birthday"
                  type="date" 
                  placeholder="选择出生年月"
                  format="yyyy 年 MM 月 dd 日">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="权限设置" prop="power" class="style_left">
                  <el-switch v-model="form.power" active-text="启用" inactive-text="禁止" active-value='1'
                    inactive-value='0'>
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户类型" :label-width="formLabelWidth" prop="userCategory">
                  <el-select v-model="form.userCategory" filterable placeholder="请选择">
                    <el-option v-for="item in userCategoryList" :key="item.id" :label="item.val" :value="item.type">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择有效期" v-show="vailDate" :prop="vailDate">
                  <el-date-picker v-model="form.vailDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="realName">
                  <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" class="style_left">
                  <el-radio-group v-model="form.sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="上传头像" class="photo_style" prop="image">
                  <upload-photo @imgUrl="imgUrl" :imageUrl.sync="form.image"></upload-photo>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </div>
      <div class="formBind"  v-show="dialogTitle=='绑定'">
        <div style="padding-bottom:12px;font-weight: bold;">已绑定的房间</div>
        <el-tag
            :key="tag.id"
            v-for="tag in houseListData"
            closable
            :disable-transitions="false"
            style="margin:0 12px 12px"
            @close="handleClose(tag)">
            {{tag.commno}} 有效期:{{ tag.vailDate | parseTime( '{y}/{m}/{d}')}}
        </el-tag>
        <div style="padding-bottom:12px;font-weight: bold;">添加新的房间</div>
        <el-form 
          :inline="true" 
          label-width="110px"
          :model="formBind" 
          ref="formBind" 
          class="menka"
          :rules="rules">
          <el-form-item label="选择房间" label-width="80px"  :prop="idList">
              <el-cascader
                :options="options2"
                @active-item-change="handleItemChange"
                :props="props"
                v-model="formBind.idList"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="选择有效期"  :prop="vailDate">
              <el-date-picker
                v-model="formBind.vailDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                >
              </el-date-picker>
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="bindRoom('formBind')" :loading="false">绑定</el-button>
          </div>
        </el-form>
      </div>
      <div class="doorCard" v-show="dialogTitle=='管理门卡'">
        <el-form  
          :inline="true" 
          label-width="60px"
          :model="formCard" 
          ref="formCard" 
          :rules="rulesCard">
          <el-form-item label="读卡" label-width="50px" prop="cardNo">
            <el-input v-model="formCard.cardNo"  @focus="cardReading('cardNo')" clearable placeholder="读取卡号"></el-input>
          </el-form-item>
          <el-form-item label="设备" label-width="50px" prop="doorguardIdList">
            <el-select v-model="formCard.doorguardIdList"  
            multiple
            collapse-tags 
            style="width:200px" 
            clearable  
            filterable 
            placeholder="请选择">
              <el-option
                v-for="item in equipList"
                :key="item.id"
                :label="item.doorGuardName"
                :value="item.cardKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期" label-width="80px" prop="vailDate">
            <el-date-picker 
              style="width:150px"
              v-model="formCard.vailDate"
              type="date"
              clearable
              placeholder="选择日期"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" @click="submitForm('formCard')" :loading="loading" >提交</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="listLoading"
          :data="cardTabeList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="楼栋/设备" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.doorguardName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="卡号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cardNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" width="120" label="操作"  fixed="right">
            <template slot-scope="scope" >
              <el-row>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row,'delCard')">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" v-show="dialogTitle=='修改用户' || dialogTitle =='添加用户'" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {userList,
  cardList,
  writeCard,
  addCard,
  delCard,
  delUserinfo,
  userinfoAdd,
  isUser, 
  MansionList, 
  HouseList,
  BindHouseList,
  addBindRoom,
  delBindRoom,
  updatePower,
  cardReading,
  doorGuardList} from '@/api/userinfo'
import { communityList } from '@/api/house'
import UploadExcel from '@/components/UploadExcel'
import Pagination from '@/components/Pagination'
import UploadPhoto from '@/components/uploadPhoto'
import { setTimeout } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    UploadPhoto,
    UploadExcel
  },
  mixins:[publicIndex],
  data() {
    return {
      list: [],
      cardTabeList:[],
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      dialogTitle:'添加用户',
      isDisabled:false,
      formCard:{
        appUserId:'',
        doorguardIdList:[],
        vailDate:'',
        cardNo:'',
      },
      cardKeyList:[],
      formBind:{
        vailDate:'',
        appUserId:'',
        idList:[]
      },
      cardNumber:'',
      
      houseListData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        realName:'',
        username:'',
        communityId:''
      },
      form:{
        id:"",
        username:"",
        realName:"",
        image:"",
        vailDate:'',
        sex:"",
        idcard:'',
        birthday:"",
        userCategory:"",
        idList:[],
        power:'1',
      },
      userCategoryList:[
        {val:"业主",type:'1'},
        {val:"普通",type:'2'}
      ],
      equipList:[],
      communitySelectList:[],
      rulesCard:{
        doorguardIdList:[
          { required: true, message:'选择设备', trigger: 'change' }
        ],
        vailDate:[
          { required: true, message:'选择有效期', trigger: 'change' }
        ],
        cardNo:[
          { required: true,  message:'请读卡', trigger: 'blur' }
        ],
      },
      options2:[],
      props: {
        value: 'id',
        label:"label",
        children: 'cities'
      },
      idList:'idList',
      vailDate:'vailDate'
    }
  },
  created() {
      this.fetchData()
      this.communityList()
      this.doorGuardList()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        // console.log(this.list)
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    // 请求小区列表
    communityList(){
      communityList().then(res=>{
        // console.log(res)
        this.communitySelectList = res.data.entryList;
        this.options2 = res.data.entryList.map((el)=>{
            return {label: el.communityName, id: el.id, cities:[]}
        })
      })
    },
    // 门禁卡列表
    cardList(id){
      cardList({userId:id}).then(res=>{
        this.cardTabeList= res.data
      })
    },
    // 设备列表
    doorGuardList(){
      doorGuardList().then(res=>{
        console.log(res)
        this.equipList=res.data
      })
    },
    // 请求绑定房间的列表
    BindHouseList(param){
      BindHouseList(param).then(res=>{
        this.houseListData = res.data
      })
    },
    //删除
    handleDelete(index,row,el){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(el=='delUserinfo'){
            delUserinfo({id}).then(res =>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetchData()
            })
        }else if(el=='delCard'){
            delCard({id}).then(res =>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.cardList(this.formCard.appUserId)
            })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //点击添加
    addRole(){
      this.dialogTitle='添加用户'
      this.dialogVisible = true;
      this.isDisabled=false;
      this.idList = 'idList'
      this.vailDate = 'vailDate'
      this.resetForm()
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //点击修改按钮
    revise(row){
      this.dialogTitle='修改用户'
      this.dialogVisible = true;
      this.isDisabled=true;
      this.idList = ''
      this.vailDate = ''
      for(var item in this.form){
        this.form[item]=row[item]
      }
      this.form.idList=[]
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    resetForm(){
      this.form={
        id:"",
        username:"",
        realName:"",
        image:"",
        vailDate:'',
        sex:"",
        idcard:'',
        birthday:"",
        userCategory:"",
        idList:[],
        power:'1',
      }
    },
    //读取门禁卡
    cardReading(param){
      cardReading().then(res=>{
        // console.log(res)
        if(res.code==0){
          param=='cardNo'? this.formCard[param]= res.data : this[param]= res.data
          this.$message({
            type:'success',
            message:'读卡成功'
          })
        }
      }).catch((err)=>{
        if(!err.code){
          this.$message({
            type: 'error',
            message: '请联系技术人员安装读卡软件'
          }); 
        }
      })
    },
    // 制作门禁卡
    writeCard(param={}){
      this.loading=true;
      let data={
              "expireDate":param.expireDate,
              "optType": 0,
              "cardKey":param.cardKey,
              "excludeSectors": [1,5]
              }
      writeCard(data).then(res=>{
        if(res.code==0){
          this.addCard()
        }
      }).catch(res=>{
         this.loading=false
      })
    },
    // 发送到后台
    addCard(){
      let data=this.formCard;
      let listArr=this.equipList;
      let cardNumberList= this.formCard.doorguardIdList;
      let idList = []
      cardNumberList.map(val=>{
          listArr.map(el=>{
            console.log(el['cardKey'])
              return el['cardKey']==val ? idList.push(el['id']) : ''
          })
      }) 
      addCard({
        appUserId:data.appUserId, 
        doorguardIdList:idList, 
        vailDate:data.vailDate,
        cardNo:data.cardNo}).then(res=>{
          this.loading=false;
          if(res.code==200){
            this.cardList(this.formCard.appUserId)
          }
        // console.log(res)
      }).catch(err=>{
          this.loading=false;
      })

    },
    // 点击门卡按钮
    doorCard(row){
      this.dialogTitle='管理门卡'
      this.dialogVisible = true;
      this.formCard.appUserId=row.id;
      this.formCard.doorguardIdList=[],
      this.formCard.vailDate='',
      this.formCard.cardNo='',
      this.$nextTick(function(){
        this.$refs['formCard'].clearValidate()
      })
      this.cardList(row.id)

    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      userinfoAdd(params).then(res=>{
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
    // 接收图片
    imgUrl(e){
      this.form.image=e
    },
    // 权限设置
    updatePower(e,row){
      let data = {
        power:e,
        id:row.id
      }
      updatePower(data).then((res)=>{
        if(res.code==200){
          this.fetchData()
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        }
      })
    },
    // 多级联动选择房间
    handleItemChange(val) {
      this.getPosition(val)
    },
    getPosition(val){
      // console.log(val)
      if(!val){
        console.log('初始化')
      }else if(val.length===1){
        console.log('加载二级数据')
        //传小区请求对应楼栋的列表
        MansionList({communityId:val[0],buildingName:'',pageNum:'',pageSize:''}).then((res)=>{
          //遍历小区列表
          this.options2.map((item)=>{
            //判断id与选项变化相同的一项val[0]
            if(item.id == val[0]){
              // console.log(item.id)
              // 给当前选项的子选项添加数据
              let data = res.data;
              item.cities=data.map(el=>{
                return {label:el.buildingName,id:el.id,cities: []}
              })
              // console.log(item.cities)
            }
          })
        })
      }else{
        // console.log('加载三级级数据')
        HouseList({mansionId:val[1],roomNumber:'',pageNum:'',pageSize:''}).then((res)=>{
            this.options2.map(item => {
              if(item.id == val[0]){
                item.cities.map(el=>{
                  if(el.id == val[1]){
                     let data = res.data;
                      el.cities = data.map(e=>{
                      return {label:e.roomNumber,id:e.id}
                      })
                      // console.log(item.cities)
                  }
                })
              }
            })
        })
      }
    },
    // 在列表绑定房间弹窗
    binding(e){
      this.dialogTitle='绑定'
      this.dialogVisible=true;
      // console.log(e)
      this.formBind.idList = [];
      this.formBind.vailDate = '';
      this.formBind.appUserId = e.id;
      this.BindHouseList({userId:e.id})
      this.$nextTick(function(){
        this.$refs['formBind'].clearValidate()
      })
    },
    // 解绑房间
    delBindRoom(paran){
      delBindRoom(paran).then(res=>{
        if(res.code==200){
           this.BindHouseList({userId:this.formBind.appUserId})
        }
      })
    },
    handleClose(tag) {
        // console.log(tag)
        this.delBindRoom({id:tag.id})
    },
    // 单独绑定房间提交
    bindRoom(fromBindName){
      this.$refs[fromBindName].validate((valid)=>{
          if(valid){
            addBindRoom(this.formBind).then(res=>{
                if(res.code==200){
                  // Message({
                  //   message: res.message || 'success',
                  //   type: 'success',
                  //   duration: 2 * 1000
                  // })
                 this.BindHouseList({userId:this.formBind.appUserId})
                }
            })
          }
      })
    },
    // 批量导入成功后刷新
    SuccessReset(){
      this.fetchData()
    },
    //确认提交
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        if(valid){
          if(fromName=='form'){
            this.insert(this.form)
            this.dialogVisible = false;
          }else{
            let  data=this.formCard
            // this.addCard()
            this.writeCard({ expireDate: data.vailDate, cardKey: data.doorguardIdList})
          }
        }
      })
    },
  }
}
</script>
