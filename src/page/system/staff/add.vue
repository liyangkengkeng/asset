<template>
  <div class="">
    <div class="flex jc-sb marginB20">
      <el-button @click='$router.back(-1)'>返回</el-button>
      <el-button type="primary" @click='sub'>保存</el-button>
    </div>
    <div class="flex">
      <div class="marginR40 width100">
        <div class="padding10 background colorF marginB20">
          基本信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">用户真实名称</p><el-input v-model="obj.realName" maxlength='8' placeholder="输入8个字以内的用户真实名称"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">身份证</p><el-input v-model="obj.cardNo" placeholder="输入正确的身份证号"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">联系电话</p><el-input v-model="obj.mobile" placeholder="输入联系电话"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">选择部门</p>
          <p class="width100 flex">
            <el-cascader
              :options="organize_list"
              v-model="deptIds"
              change-on-select
              class='fg'
            ></el-cascader>
            <!-- <el-cascader class='fg'
              expand-trigger="hover"
              :props='props'
              :options="organize_list"
              v-model="deptIds"
              :show-all-levels="false"
              @change="handleChange">
            </el-cascader> -->
          </p>
        </div>
        
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">电子邮箱</p><el-input v-model="obj.email" placeholder="输入正确的电子邮箱"></el-input>
        </div>
        <div class="flex marginB20">
          <p class="width120 fs0 height40">备注信息</p><textarea name="" v-model="obj.remarks" class="textarea width100 padding10" placeholder="输入200字以内的备注信息"></textarea>
        </div>
      </div>
      <div class="width100">
        <div class="padding10 background colorF marginB20">
          账号信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">登录账号</p><el-input v-model="obj.loginName" maxlength='13' placeholder="请输入您要设置的登录账号 2-13位"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">登录密码</p><el-input v-model="obj.password" maxlength='10' placeholder="输入密码6-10位数密码"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">选择用户类型</p>
          <el-select v-model="obj.userType" placeholder="请选择用户类型" class='width100'>
              <el-option label="平台管理员" value="1"> </el-option>
              <el-option label="仓库管理员" value="2"> </el-option>
              <el-option label="施工管理员" value="3"> </el-option>
              <!-- <el-option label="临时工" value="4"> </el-option> -->
            </el-select>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">选择角色</p>
          <p class="width100 flex">
            <template v-if='obj.userType==1'>
              <el-select v-model="roleName" placeholder="请选择角色" class='fg'>
                <el-option v-for='(val,key) in role_list' :label='val.roleName' :key='val.roleId+1000' :value='key' v-if='val.roleId!=2 && val.roleId!=3 && val.roleId!=4'></el-option>
              </el-select>
            </template>
            <template v-else-if='obj.userType==2'>
              <el-select v-model="roleName" placeholder="请选择角色" class='fg'>
                <el-option v-for='(val,key) in role_list' :label='val.roleName' :key='val.roleId+1000' :value='key' v-if='val.roleId==3 || val.roleId==2'></el-option>
              </el-select>
            </template>
            <template v-else-if='obj.userType==3'>
              <el-select v-model="roleName" placeholder="请选择角色" class='fg'>
                <el-option v-for='(val,key) in role_list' :label='val.roleName' :key='val.roleId+1000' :value='key' v-if='val.roleId==4'></el-option>
              </el-select>
            </template>
            <!-- <template v-else>
              <el-select v-model="roleName" placeholder="请选择角色" class='fg'>
                <el-option v-for='(val,key) in role_list' :label='val.roleName' :key='val.roleId+1000' :value='key'></el-option>
              </el-select>
            </template> -->
          </p>
        </div>
        <div class="flex al-ce marginB20" v-if='obj.userType==2'>
          <p class="must width120 fs0">选择所属总仓</p>
          <p class="width100 flex">
            <el-select v-model="whNo_obj" placeholder="请选择总仓" class='fg'>
              <el-option v-for="(item,index) in listAll" :key="item.whNo" :label="item.whName" :value="item.whNo"> </el-option>
            </el-select>
          </p>
        </div>
        <div class="flex al-ce marginB20" v-if='obj.userType==2 && roleId!=2'>
          <p class="width120 fs0">选择所属分仓</p>
          <!-- <p class="width100 flex" v-if='roleId!="3"'>
            <el-select v-model="obj.branchWhNo" placeholder="请选择分仓" class='fg'>
              <el-option label='全部' value=''></el-option>
              <el-option v-for="(item,index) in listF" :key="item.whNo" :label="item.whName" :value="item.whNo"> </el-option>
            </el-select>
          </p> -->
          <p class='width100 flex' v-if='listF.length>0'>
            <el-checkbox-group v-model="branchWh_obj_1" @change="handleCheckedCitiesChange" class='flex fw width100'>
                <el-checkbox class='width30 marginB10 marginL0 nowrap' :indeterminate="isIndeterminate" v-model="all_check" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox class='width30 marginB10 marginL0 nowrap' v-for="(item,index) in listF" :label="item.whNo" :key="index+100">{{item.whName}}</el-checkbox>
            </el-checkbox-group>
          </p>
        </div>
        
        <div class="flex marginB20">
          <p class="must width120 height20 fs0">账户状态</p>
          <p class="marginB5">
            <el-radio v-model="obj.status" label="1">正常启用</el-radio>
            <el-radio v-model="obj.status" label="3">停用</el-radio>
            <el-radio v-model="obj.status" label="4">冻结</el-radio>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input:'',
      obj:{},
      central_warehouse_list:[],//总仓列表
      subdepot_list:[],//分仓列表
      organize_list:[],//组织
      role_list:[],//角色
      roleId:'',//角色id
      organize_val:[],//部门
      deptIds:[],
      whNo_obj:'',//总仓ID
      whno:'',//总仓编码
      branchWh_obj:null,//分仓
      listAll:[],//总仓列表
      listF:[],//分仓列表
      props:{
        label:'label',
        value:'value'
      },
      is_flag:false,//是否是编辑
      roleName:null,//角色数据
      branchWh_obj_1:[],
      isIndeterminate:false,//分仓是否全选
      all_check:false,//分仓是否全选
    }
  },
  created(){
    var self=this
    if(this.$route.query.obj){
      this.ajax({
        mode: 'get',
        url: '/ems/api/user/info/'+this.$route.query.obj,
        data: {},
        success(res){
          self.obj=res.data.body
          self.whNo_obj=self.obj.whNo
          self.ajax_list()
          self.$set(self.obj,'status',self.obj.status.toString())
          self.is_flag=true
          self.role()
          self.branchWh_obj_1=self.obj.branchWhNo ? self.obj.branchWhNo.split(',') : []
          self.organize()
        }
      })
    }else{
      this.obj={
        realName:'',//用户昵称
        cardNo:'',//身份证
        mobile:'',//手机号
        deptName:'',//部门名称
        roleName:'',//角色名称
        roleId:'',//角色id
        email:'',//邮箱
        remarks:'',//备注
        loginName:'',//登录账号
        password:'',//密码
        whNo:'',//总仓编号
        branchWhNo:null,//分仓
        userType:'',//用户类型
        status:'',//状态
        deptIds:[],
      }
      this.ajax_list()
      this.role()
      this.organize()
    }
  },
  methods:{
    handleCheckedCitiesChange(val){
      // console.log(val)
    },
    handleCheckAllChange(val){
      if(val){
        for(let i=0;i<this.listF.length;i++){
          this.branchWh_obj_1.push(this.listF[i].whNo)
        }
      }else{
        this.branchWh_obj_1 = []
      }
      this.isIndeterminate = false;
    },
    sub(val){
      var self=this
      self.obj.deptName=self.organize_val[self.organize_val.length-1]

      self.obj.whNo=self.whNo_obj


      if(self.roleName>0 || self.roleName==0){  //角色名称 id
        self.obj.roleName=self.role_list[Number(self.roleName)].roleName
        self.obj.roleId=self.role_list[Number(self.roleName)].roleId
      }
      if(self.obj.roleId==3){ //角色是否是分仓
        var arr=[]
        for(let i=0;i<this.branchWh_obj_1.length;i++){
          if(this.branchWh_obj_1[i]){
            arr.push(this.branchWh_obj_1[i])
          }
        }
        self.obj.branchWhNo=arr.join(',')
      }
      var boo
      if(self.obj.userType!=2){
        self.obj.whNo='',self.obj.branchWhNo=''
        boo=this.obj.realName && this.obj.mobile && self.obj.deptName && self.obj.roleName && this.obj.loginName.length>1  && this.obj.password.length>5 && this.obj.userType && this.obj.status
      }else{
        boo=this.obj.realName && this.obj.mobile && self.obj.deptName && self.obj.roleName && this.obj.loginName.length>1  && this.obj.password.length>5 && this.obj.userType && this.obj.status && this.obj.whNo
      }
      if(boo){
        if(this.obj.createDt)
          this.obj.updateDt=(new Date()).valueOf()
        else
          this.obj.createDt=(new Date()).valueOf()

        this.obj.deptIds=this.deptIds.join(',')
        this.ajax({
          mode:'post',
          url:self.is_flag ? '/ems/api/user/update' : '/ems/api/user/save',
          data:{
            body:self.obj
          },
          success(res){
            self.$message({
              message: '恭喜你，创建成功',
              type: 'success'
            });
            self.$router.push({name:'staffList'})
          }
        })
      }else{
        if(!this.obj.realName){
          this.$message({
            message: '请填写用户真实姓名',
            type: 'warning'
          });
        }else if(!this.obj.mobile){
          this.$message({
            message: '请填写联系电话',
            type: 'warning'
          });
        }else if(this.obj.loginName.length<2){
          this.$message({
            message: '登录账号长度不符合要求',
            type: 'warning'
          });
        }else if(!this.obj.deptName){
          this.$message({
            message: '请选择部门',
            type: 'warning'
          });
        }else if(this.obj.password.length<6){
          this.$message({
            message: '登录密码不符合要求',
            type: 'warning'
          });
        }else if(!this.obj.userType){
          this.$message({
            message: '请选择用户类型',
            type: 'warning'
          });
        }else if(!this.obj.roleName){
          this.$message({
            message: '请选择角色',
            type: 'warning'
          });
        }else if(!this.obj.whNo && self.obj.userType==2){
          this.$message({
            message: '请选择总仓',
            type: 'warning'
          });
        }else if(!this.obj.status){
          this.$message({
            message: '请选择账号状态',
            type: 'warning'
          });
        }
      }
    },
    organize(){//部门列表
      var self=this
      self.ajax({
        mode: 'get',
        url: '/ems/api/dept/getDeptLis',
        data: {},
        success(res){
          self.organize_list=res.data.body
          if(self.is_flag){
            self.deptIds=self.obj.deptIds ? self.obj.deptIds.split(',') : []
            self.organize_val[0]=self.obj.deptName
          }
        }
      })
    },
    role(){
       var self=this
        this.ajax({
          mode: 'post',
          url: '/ems/api/role/list',
          data: {
            body:{
              page: 1, 
              pageSize: 100
            }
          },
          success(res){
            self.role_list=res.data.body.rows
            if(self.is_flag){
              for(let i=0;i<self.role_list.length;i++){
                if(self.role_list[i].roleId==self.obj.roleId){
                  self.roleName=i
                }
              }
            } 
          }
        })
    },
    ajax_list(page=1){/*总仓列表*/
      var self=this
      self.listAll=[]
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:page,
            pageSize:1000
          }
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==1 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
            if(res.data.body.rows[i].whId==self.whNo_obj){
              self.whno=res.data.body.rows[i].whNo
            }
          }
          // self.whNo_obj=self.listAll[0].whId
        }
      })
    },
    ajax_listF(id){/*分仓列表*/
      var self=this
      self.listF=[]
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:1,
            pageSize:1000,
            parId:id
          }
        },
        success(res){
          // self.listF.push({whName:'全部',whId:''})
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==2 && res.data.body.rows[i].status==1){
              self.listF.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    getArray(arr,arr2){
        for (var i=0;i<arr.length;i++) {
          for(var j=0;j<arr2.length;j++){
            if(arr2[j]==arr[i].value){
              this.organize_val.push(arr[i].label)
            }
          }
          if (arr[i].children && arr[i].children.length>0) {
            this.getArray(arr[i].children,arr2);
          } else {
            break;
          }
        }
    }
  },
  watch:{
    whNo_obj(val){
      this.$set(this.obj,'branchWhNo',null)
      
      for(let i=0;i<this.listAll.length;i++){
        if(val==this.listAll[i].whNo){
          // this.whno=this.listAll[i].whNo
          this.ajax_listF(this.listAll[i].whId)
        }
      }
    },
    roleName(val){
      this.roleId=val ? this.role_list[val].roleId+'' : null
    },
    deptIds(val){
      this.organize_val=[]
      this.getArray(this.organize_list,val)
    }
}
}
</script>

<style scoped>
	.textarea{
    height:200px;
  }
  .nowrap{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
