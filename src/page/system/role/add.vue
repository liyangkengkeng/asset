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
        <!-- <div class="flex al-ce marginB20">
          <p class="must width120 fs0">角色编码</p>
          <el-input v-model="obj.user_name" maxlength='8' placeholder="输入8个字以内的用户真实名称"></el-input>
        </div> -->
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">角色名称</p>
          <el-input v-model="obj.roleName" placeholder="输入角色名称"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">用户状态</p>
          <el-select v-model="obj.status" placeholder="请选择用户状态" class='width100'>
            <!-- <el-option label="删除" value="0"> </el-option> -->
            <el-option label="正常" value="1"> </el-option>
            <el-option label="停用" value="2"> </el-option>
          </el-select>
        </div>
        <div class="flex height40 marginB20">
          <p class="width120 fs0">角色说明</p>
          <textarea name="" class="textarea width100 padding10" v-model='obj.remark'></textarea>
        </div>
      </div>
      <div class="width100">
        <el-tree
          ref='tree'
          :data="items"
          show-checkbox
          node-key="value"
          :default-expanded-keys="[1,2,3,4,5,6,7,8,9]"
          :default-checked-keys="select_arr"
          :props="defaultProps"  @check-change="handleCheckChange">
        </el-tree>
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
      status:false,
      checkAll:[],
      checkedCities:[],
      items:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checked_keys:[12],
      arr:[],
      select_arr:[]
    }
  },
  created(){
    if(this.$route.query.obj){
      this.obj=JSON.parse(this.$route.query.obj)
      this.$set(this.obj,'status',JSON.parse(this.$route.query.obj).status.toString())
      this.status=true
    }else{
      this.obj={
        roleName:'',
        status:'',
        remark:'',
        resIds:[],
      }
    }
    var self=this
    this.ajax({
      mode:'get',
      url:'/ems/api/role/listAllRes',
      body:{},
      success(res){
        self.items=res.data.body
        if(self.obj.roleId){
          self.ajax({
            mode:'get',
            url:'/ems/api/role/listResInfoByRoleId/'+self.obj.roleId,
            body:{},
            success(res){
              self.arr=res.data.body
              self.select_arr=res.data.body
              self.$refs.tree.setCheckedKeys(self.select_arr)
            }
          })
        }
      }
    })
  },
  methods:{
    sub(val){
      var self=this
      if(this.obj.roleName && this.obj.status){
        this.obj.status=Number(this.obj.status)
        this.obj.resIds=this.arr
        this.ajax({
          mode:'post',
          url:'/ems/api/role/saveUserRole',
          data:{body:self.obj},
          success(res){
            self.$message({
              message: '创建成功',
              type: 'success'
            });
            self.$router.push({name:'roleList'})
          }
        })
      }else{
        if(!this.obj.roleName){
          this.$message({
            message: '请填写角色名称',
            type: 'warning'
          });
        }else if(!this.obj.status){
          this.$message({
            message: '请选择状态',
            type: 'warning'
          });
        }
      }
    },
    handleCheckChange(data, checked, indeterminate) {
        if(checked){
          this.arr.push(Number(data.value))
        }else{
          for(let j=0;j<this.arr.length;j++){
            if(this.arr[j]==data.value){
              this.arr.splice(j,1)
            }
          }
        }
    },
  },
  watch:{
    
  }
}
</script>

<style scoped>
	.textarea{
    height:200px;
  }
  .senior{
    padding-left: 20px;
  }
</style>
