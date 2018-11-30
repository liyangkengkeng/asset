<template>
  <div>
    <div class='flex marginB20'>
      <div class='fg marginR40'>
        <div class="padding10 background colorF marginB20 flex al-ce jc-sb">
           <span class="">总仓</span>
           <router-link class='btnF marginL20' :to='{name:"addWarehouse",query:{grade:1}}'>创建</router-link> 
        </div>
        <el-table ref="singleTable" :data="listAll"  class=''>
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column property="whName" label="总仓名称"> </el-table-column>
          <el-table-column property="deptName" label="所属机构"> </el-table-column>
          <el-table-column property="createDt" label="创建时间" width='160'> </el-table-column>
          <el-table-column label="操作" width='160'>
            <template slot-scope="scope">
              <router-link class='min-btn marginL20' :to='{name:"addWarehouse",query:{grade:1,obj:JSON.stringify(scope.row)}}'>编辑</router-link>
              <el-button type="danger" size="mini" @click='del(scope.row,scope.$index,false)'>删除</el-button>
            </template>
          </el-table-column>
          <el-table-column property="createDt" label="选择">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" >选择</el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div class='fg'>
        <div class="padding10 background colorF marginB20 flex al-ce jc-sb">
           <span class="">分仓</span>
           <router-link class='btnF marginL20' :to='{name:"addWarehouse",query:{grade:2,parWhId:parWhId,name:merge_depot}}'>创建</router-link> 
        </div>
        <el-table ref="singleTable" :data="listF"  class=''>
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column property="whName" label="分仓名称"> </el-table-column>
          <el-table-column property="createDt" label="创建时间"> </el-table-column>
          <el-table-column property="createDt" label="状态">
            <template slot-scope="scope">
              <span v-if='scope.row.status==1'>启用</span>
              <span v-if='scope.row.status==0'>不启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width='220'>
            <template slot-scope="scope">
              <router-link class='min-btn' :to='{name:"addWarehouse",query:{grade:2,obj:JSON.stringify(scope.row)}}'>编辑</router-link>
              <el-button type="primary" size="mini" @click='merge(scope.row,scope.$index)' class='marginL10'>合仓</el-button>
              <el-button type="danger" size="mini" @click='del(scope.row,scope.$index,true)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <!-- <v-entering v-if='entering' :edit_data='edit_data' :status='status' @sub='sub' @cancel='cancel'></v-entering> -->
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="modal-header width100 center marginB20 size18 background colorF">
          分仓合并确认
        </div>
        <div class="marginB20">
          <div class="flex al-ce marginB20">
            <p class="width120 fs0">所属总仓</p>
            <p>{{merge_depot}}</p>
          </div>
          <div class="flex al-ce marginB20">
            <p class="must width120 fs0">仓库1</p>
            <el-select v-model="obj.whId1" placeholder="选择要合并的分仓">
              <el-option v-for='(item,key) in listF' :key='item.whNo' :label='item.whName' :value='item.whId'></el-option>
            </el-select>
          </div>
          <div class="flex al-ce marginB20">
            <p class="must width120 fs0">仓库2</p>
            <el-select v-model="obj.whId2" placeholder="选择要合并的分仓">
              <el-option v-for='(item,key) in listF' :key='item.whName' :label='item.whName' :value='item.whId'></el-option>
            </el-select>
          </div>
          <div class="flex marginB20">
            <p class="must height40 width120 fs0">仓库名称</p>
            <el-input v-model="obj.whName" placeholder="新仓库名称" class='search width200'></el-input>
          </div>
          <div class="flex marginB20">
            <p class="must height40 width120 fs0">地理位置</p>
            <p>
              <el-input v-model="obj.longitude" placeholder="输入经度" class='marginB20'></el-input>
              <el-input v-model="obj.latitude" placeholder="输入纬度" class='marginB20'></el-input>
            </p>
          </div>
          <div class="flex marginB20">
            <p class="must width120 height20 fs0">是否启用</p>
            <p class="marginB5">
              <el-radio v-model="obj.status" label="0">不启用</el-radio>
              <el-radio v-model="obj.status" label="1">启用</el-radio>
            </p>
          </div>
          <div class="marginB20">
            注意：仓库合并后新仓库会拥有原始两个仓库的设备包括基站设备
          </div>
        </div>
        <div class="center">
          <el-button @click='is_modal=false'>取消</el-button>
          <el-button type="primary" @click='sub'>确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import vEntering from './entering'
export default {
  data () {
    return {
      asset_number:'',//资产编号搜索
      create_time:'',//创建时间
      asset_type:'',//资产类型
      asset_state:'',//资产状态
      depot:'',//所属仓库
      batch:'',//批量修改的状态
      radio:'',
      listAll: [],
      listF:[],
      total:0,//总信息条数，
      selectionChange:[],//多选框
      is_modal:false,
      obj:{
        whId:'',//总仓
        whId1:'',//合仓
        whId2:'',//合仓
        whName:'',//合仓
        longitude:'',//经度
        latitude:'',//纬度
        status:'',//是否启用
      },
      merge_depot:'',//合并仓库数据
      merge_ID:'',
      parWhId:'',//所属总仓
    }
  },
  created(){
    this.ajax_list()
  },
  methods:{
    ajax_list(page=1){/*总仓列表*/
      var self=this
      self.listAll=[]
      self.listF=[]
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
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
            if(res.data.body.rows[i].whType==1 && (res.data.body.rows[i].status==1 || res.data.body.rows[i].status==0)){
              self.listAll.push(res.data.body.rows[i])
            }
          }
          self.radio=0
          self.merge_depot=self.listAll[0].whName
          // self.ajax_listF(self.listAll[0].parWhId)
          self.total=self.listAll.length
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
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
            if(res.data.body.rows[i].whType==2 && (res.data.body.rows[i].status==1 || res.data.body.rows[i].status==0)){
              self.listF.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    del(val,index,boo){/*删除*/
      var self=this
      self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
            mode:'post',
            url:'/ems/api/warehouse/deleteBatch',
            data:{
              body:{
                ids:[val.whId]
              }
            },
            success(res){
              if(boo){
                self.listF.splice(index,1)
              }else{
                self.listAll.splice(index,1)
              }
              self.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleCurrentChange(val){ /*分页获取数据*/
      this.ajax_list(val)
    },
    merge(val,index){/*和仓*/
      this.is_modal=true
    },
    sub(){  //确认合仓
      var self=this
      this.obj.whId=this.parWhId
      if(this.obj.whId1 && this.obj.whId2 && this.obj.whName && this.obj.longitude && this.obj.latitude && this.obj.status){
        this.ajax({
          mode:'post',
          url:'/ems/api/warehouse/combinStorage',
          data:{
            body:self.obj
          },
          success(res){
            self.$message({
              message: '创建成功',
              type: 'success'
            });
            self.is_modal=false
            self.$router.push({name:'warehouse_list'})
          }
        })
      }else{
        if(!this.obj.whId1)
          this.$message({message: '请选择仓库2',type: 'warning'})
        else if (!this.obj.whId2)
          this.$message({message: '请选择仓库2',type: 'warning'})
        else if(!this.obj.whName)
          this.$message({message: '请填写仓库名称',type: 'warning'});
        else if(!this.obj.longitude)
          this.$message({message: '请填写位置：经度',type: 'warning'});
        else if(!this.obj.latitude)
          this.$message({message: '请填写位置：纬度',type: 'warning'});
        else if(!this.obj.status)
          this.$message({message: '请选择是否启用',type: 'warning'});
      }
    }
  },
  watch:{
    radio(val){
      this.merge_depot=this.listAll[val].whName
      this.parWhId=this.listAll[val].whId
      this.merge_ID=this.listAll[val].whNo
      this.ajax_listF(this.listAll[val].whId)
    }
  },
  components:{
    // vEntering
  }
}
</script>

<style scoped>
	.thumbnail{
    width: 50px;height: 50px;
  }
  .btn{
    padding:0px 20px;
    height:40px;
    line-height: 40px;
  }
  .modal-header{
    margin-left: -30px;
    margin-top: -30px;
    padding: 10px 30px;
  }
</style>
