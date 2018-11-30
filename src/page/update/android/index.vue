<template>
  <div class='android'>
    <div class='marginB20'>
      <el-button type="primary" class='width150' @click='add'>创建</el-button>
    </div>
    <el-radio-group v-model="isCollapse">
      <el-radio-button :label="false">安卓</el-radio-button>
      <el-radio-button :label="true">IOS</el-radio-button>
    </el-radio-group>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="描述：">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label='序号' width="50"> </el-table-column>
      <el-table-column prop="versionName" label="版本号"></el-table-column>
      <el-table-column prop="createDt" label="创建时间"></el-table-column>
      <!-- <el-table-column prop="forced" label="升级类型"> </el-table-column> -->
      <el-table-column prop="forced" label="升级状态">
        <template slot-scope='scope'>
          <span v-if='scope.row.forced==1'>强制升级</span>
          <span v-else>非强制升级</span>
        </template>
      </el-table-column>
      <el-table-column prop="trip" label="提示更新">
        <template slot-scope='scope'>
          <span v-if='scope.row.trip==1'>有提示</span>
          <span v-else>无提示</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
      <el-table-column label="操作" width='250'>
        <template slot-scope="scope">
          <el-button type="danger" size="mini">停止</el-button>
          <el-button type="primary" size="mini">下载应用</el-button>
          <el-button type="success" size="mini" @click='see(scope.row)'>查看</el-button>
        </template>
      </el-table-column>
    </el-table>

   <!--  <div class='modal' v-if='show'>
      <div class='modal-box backgroundF'>
        <div class='center pr see paddingTB10 background colorF'>
          查看
          <i class='el-icon-close header-icon pa cp' @click='show=false'></i>
        </div>
        <div class="flex padding20">
          <div class='width200 fs0 marginR20'>
            <p class='app-icon marginB20'><img src="" alt=""></p>
            <p class='center'>
              <el-button type="primary">应用下载</el-button>
            </p>
          </div>
          <div >
            <div class='flex marginB20'>
              <p class='bold fs0 width50'>升级版本：</p>
              <p class='bold'>102</p>
              
            </div>
            <div class='flex marginB20'>
              <p class='bold fs0 width50'>升级类型：</p>
              <p class='bold'>强制升级</p>
              
            </div>
            <div class='flex marginB20'>
              <p class='bold fs0 width50'>升级状态：</p>
              <p class='bold'>进行中&emsp;提示更新：提示/不提示</p>
              
            </div>
            <div class='flex marginB20'>
              <p class='bold fs0 width50'>创建时间：</p>
              <p class='bold'>2011-11-11 11:11:11</p>
              
            </div>
            <div class='flex'>
              <p class='bold fs0 width50'>升级描述：</p>
              大的萨达是反倒是古隔断柜和低功耗电饭煲GV电话费几个水果和世界观啊半年报不是公分三部分女生不给你不GV你说把故事更合适不给你是那边是年性别女不会发广播粉红div的不合适好黄金时代不符合规范与我国还得上班女还上班恢复的计划
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      show:false,
      isCollapse:false,
      tableData: []
    }
  },
  created(){
    this.ajax_list()
  },
  methods:{
    ajax_list(){
      var self=this
      this.ajax({
        mode: 'post',
        url: '/ems/api/update/list',
        data:{},
        success(res){
          self.tableData=res.data.body.rows
        }
      })
    },
    add(){
      this.$router.push({ name: 'android_add' })
    },
    see(obj){
      this.show=true
    }
  },
  watch:{
    
  }
}
</script>

<style scoped>
  .modal-box{
    width:800px;
  }
  .see{

  }
  .width50{
    width:100px;
  }
  .header-icon{
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .app-icon{
    width:200px;height: 200px;border:1px solid;
  }
  .app-icon img{
    width:100%;height: 100%;display: block
  }
  
</style>
