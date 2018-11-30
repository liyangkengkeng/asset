<template>
  <div class="">
    <div class="flex jc-sb marginB20">
      <el-button @click='$router.back(-1)'>返回</el-button>
      <el-button type="primary" @click='sub'>保存</el-button>
    </div>
    <div class="flex">
      <div class="marginR40 fg">
        <div class="padding10 background colorF marginB20">
          基本信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">部门名称</p><el-input class='width200' v-model="obj.deptName" maxlength='8' placeholder="部门名称"></el-input>
        </div>
        <!-- <div class="flex al-ce marginB20">
          <p class="width120 fs0">排序</p><el-input class='width200' v-model="obj.orderNum" placeholder="排序"></el-input>
        </div> -->
        <div class="flex height40 marginB20">
          <p class="width120 fs0">上级部门</p>
          <!-- <el-select v-model="obj.parentDeptId" placeholder="请选择上级部门" class='width200'>
            <el-option v-for="item in parent_list" :key="item.deptName" :label="item.deptName" :value="item.deptId"> </el-option>
          </el-select> -->
          <!-- <el-cascader :options="parent_list" v-model="obj.parentDeptId" @change="handleChange"> </el-cascader> -->
          <p class="flex parent width200">
            <el-input v-model="parentDeptId.label" :disabled='true' placeholder="请选择上级部门" class='marginB20'></el-input>
            <el-tree :data="parent_list" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
      status:false,
      parent_list:[],
      parentDeptId:{},
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created(){
    var self=this
    // 获取组织树
    self.ajax({
      mode: 'get',
      url: '/ems/api/dept/getDeptLis',
      data: {},
      success(res){
        self.parent_list=res.data.body
      }
    })
    if(this.$route.query.obj){
      this.obj={
        orderNum:JSON.parse(this.$route.query.obj).orderNum,
        deptName:JSON.parse(this.$route.query.obj).deptName, 
        parentDeptId:{
          label:JSON.parse(this.$route.query.obj).parentDeptName,
          value:JSON.parse(this.$route.query.obj).parentDeptId+'',
        },
        parentDeptName:JSON.parse(this.$route.query.obj).parentDeptName,
      }
      this.parentDeptId={
          label:JSON.parse(this.$route.query.obj).parentDeptName,
          value:JSON.parse(this.$route.query.obj).parentDeptId+'',
        }
      this.status=true
    }else{
      this.obj={
        orderNum:'',
        deptName:'',
        parentDeptId:'',
        parentDeptName:'',
      }
    }
  },
  methods:{
    sub(val){
      var self=this
      if(this.obj.deptName){
        this.obj.parentDeptId=this.parentDeptId.value
        this.obj.parentDeptName=this.parentDeptId.label
        this.ajax({
          mode:'post',
          url:'/ems/api/dept/save',
          data:{body:self.obj},
          success(res){
            self.$router.push({name:'organize'})
          }
        })
      }else{
        this.$message({
          message: '请填写部门名称',
          type: 'warning'
        });
      }
    },
    handleNodeClick(val){
      this.parentDeptId=val
    }
  },
  watch:{
    
  }
}
</script>

<style scoped>
	.textarea{
    height:200px;
  }
  .parent{
    flex-direction: column;
  }
</style>
