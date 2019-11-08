import { isUser } from '@/api/userinfo'
import { isUserName } from '@/api/app'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          if (!this.form.id) {
            isUser({ username: value }).then(res => {
              callback()
            }).catch(res => {
              return callback(new Error(res.message))
            })
          } else {
            callback()
          }
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkPhone01 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var usernameCheck = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('账号不能为空'));
      } else {
        if (!this.form.id) {
          isUserName({ username: value }).then(res => {
            callback()
          }).catch(res => {
            return callback(new Error(res.message))
          })
        } else {
          callback()
        }
      }
    }
    return {
      rules: {
        roomNumber: [
          { required: true, message: '请输入房号', trigger: 'blur' },
        ],
        mansionId: [
          { required: true, message: '请选择楼栋', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择房屋类型', trigger: 'change' }
        ],
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        organizationName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ],
        organizationEnName: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
        ],
        communityName: [
          { required: true, message: '请输入小区名字', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入地址', trigger: ['blur'] }
        ],
        organizationId: [
          { required: true, message: '选择机构', trigger: 'change' },
        ],
        buildingName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
        ],
        street: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        communityId: [
          { required: true, message: '请选择小区', trigger: 'change' },
        ],
        username: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        idList: [
          { required: true, message:'请选择房间', trigger: 'change' }
        ],
        vailDate: [
          { required: true, message:'选择有效期', trigger: 'change' }
        ],
        userCategory: [
          { required: true, message:'选择住户类型', trigger: 'change' }
        ],
        servicemanName: [
          { required: true, message: '请输入名字', trigger: 'blur' },
        ],
        phone:[
          { required: true, validator: checkPhone01, trigger: 'blur' }
        ],
        mac: [
          { required: true, message: '请输入mac', trigger: 'blur' },
        ],
        doorGuardName:[
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        doorGuardType:[
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        IMEI: [
          { required: true, message: '请输入IMEI', trigger: 'blur' },
        ],
        IMSI: [
          { required: true, message: '请输入IMSI', trigger: 'blur' },
        ],
        name:[
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        roomIds: [
          { required: true, message: '请选择房间', trigger: 'change' },
        ],
        rolesId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      formLabelWidth: '110px'
    }
  },
  methods: {
    // 搜索按钮
    handleFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    }
  }
}
