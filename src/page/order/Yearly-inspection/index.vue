<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <el-input v-model="asset_number" placeholder="年检编号搜索" class='search width200'></el-input>
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="年检起始日期" end-placeholder="年检起始日期"></el-date-picker>
        <el-select v-model="categoryName" placeholder="所属仓库">
          <el-option label='全部' value=''></el-option>
          <el-option v-for='(val,key) in listAll' :label='val.whName' :key='val.whId' :value='val.whId'></el-option>
        </el-select>
        <el-select v-model="status" placeholder="状态">
          <el-option label='全部' value=''></el-option>
          <el-option label='待审核' value='1'></el-option>
          <el-option label='已完成' value='2'></el-option>
          <el-option label='报废' value='3'></el-option>
        </el-select>
      </div>
      <div class="flex jc-sb">
        <div>
          <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
        </div>
        <div>
          <el-button type="primary" @click='batch_yearly'>批量完成年检</el-button>
          <el-button type="primary" @click='batch_scrap'>批量报废</el-button>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="使用寿命" class='width30 margin0' v-if='props.row.serviceLife'> <span>{{ props.row.serviceLife }}</span> </el-form-item>
            <el-form-item label="总仓名称" class='width30 margin0' v-if='props.row.masterWh'> <span>{{ props.row.masterWh }}</span> </el-form-item>
            <el-form-item label="年检人" class='width30 margin0' v-if='props.row.yearCheckPeople'> <span>{{ props.row.yearCheckPeople }}</span> </el-form-item>
            <el-form-item label="年检说明" class='width30 margin0' v-if='props.row.checkNotes'> <span>{{ props.row.checkNotes }}</span> </el-form-item>
            <el-form-item label="采购时间" class='width30 margin0' v-if='props.row.buyDt'> <span>{{ props.row.buyDt }}</span> </el-form-item>
            <el-form-item label="供应商" class='width30 margin0' v-if='props.row.supplier'> <span>{{ props.row.supplier }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="年检编号" prop="chkNo"> </el-table-column>
      <el-table-column label="资产名称" prop="devName"> </el-table-column>
      <el-table-column label="标签号" prop="labNo"> </el-table-column>
      <!-- <el-table-column label="标签规则" prop="desc"> </el-table-column> -->
      <!-- <el-table-column label="所属公司" prop="desc"> </el-table-column> -->
      <!-- <el-table-column label="申请人" prop="checkBy"> </el-table-column> -->
      <el-table-column label="所属仓库" prop="branchWh"> </el-table-column>
      <el-table-column label="年检状态">
        <template slot-scope="scope">
          <span v-if='arr[scope.$index]==1'>待年检</span>
          <span v-else-if='arr[scope.$index]==2'>已完成</span>
          <span v-else-if='arr[scope.$index]==3'>报废</span>
        </template>
      </el-table-column>
      <el-table-column label="年检时间" prop="yearCheckDt" width='200'> </el-table-column>
      <!-- <el-table-column label="年检说明" prop="checkNotes"></el-table-column> -->
      <el-table-column label="操作" width='260'>
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click='del(scope.row,scope.$index)'>删除</el-button> -->
          <el-button v-if='arr[scope.$index]==1' type="primary" size="mini" @click='is_modal=!is_modal,device=scope.row,yearCheckDt=scope.row.yearCheckDt'>完成年检</el-button>
          <!-- <el-button type="warning" size="mini" @click='is_modal=!is_modal'>撤销</el-button> -->
          <el-button v-if='arr[scope.$index]==1' type="danger" size="mini" @click='scrap([scope.row.chkId])'>报废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          设备年检重置
        </div>
        <div class="marginB20">
          <div class="flex al-ce marginB20">
            <p class="must width120 fs0">年检到期时间</p>
            <el-date-picker class='width100' v-model="yearCheckDt" type="date" placeholder="选择年检时间"> </el-date-picker>
          </div>
          <!-- <div class="flex al-ce marginB20">
            <p class="must width120 fs0">年检临期预警时间</p>
            <el-input v-model="days" placeholder="请输入天数"></el-input>
          </div> -->
          <textarea class="textarea padding10" name="" v-model='note' placeholder="年检说明100字以内" maxlength="100"></textarea>
        </div>
        <div class="center">
          <el-button @click='no_finish'>取消</el-button>
          <el-button type="primary" @click='finish'>完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      asset_number:'',
      create_time:'',
      categoryName:null,
      status:null,
      selectionChange:[],//多选框
      batch:'',//批量修改的状态
      list: [],
      is_modal:false,
      is_query:false,//是否是查询
      total:100,//总信息条数，
      listAll:[],//仓库列表
      device:{},
      index:1,
      yearCheckDt:'',//年检时间
      days:'',//年检预警
      batch:false,//是否是批量操作
      note:'',//年检说明
      arr:[],//状态数组
    }
  },
  created(){
    this.ajax_list()
    this.belong_to()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取人员列表*/
      this.index=1
      var body={},self=this
      this.list=[]
      self.is_query=boo
      if(boo){
        body={
            keyWord:self.asset_number,//订单编号
            status:self.status,
            beginDate:self.create_time[0] ? self.TIME(self.create_time[0],true) : "",
            endDate:self.create_time[0] ? self.TIME(self.create_time[1],true) : "",
            type:self.categoryName,//分仓
            page:page,
            pageSize:10,
          }
      }else{
        body={
          page: page, 
          pageSize: 10
        }
      }
      self.ajax({
        mode: 'post',
        url: '/ems/api/billCheck/list',
        data: {
          body
        },
        success(res){
          self.arr=[]
          for(let i=0;i<res.data.body.rows.length;i++){
            self.arr.push(res.data.body.rows[i].status)
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : ''
            // res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
            res.data.body.rows[i].yearCheckDt=res.data.body.rows[i].yearCheckDt.substring(0,10)
          }
          console.log(self.arr)
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    handleSelectionChange(arr){ /*表格多选*/
      this.selectionChange=arr
    },
    handleCurrentChange(val){ /*分页获取数据*/
     this.index=val
      this.ajax_list(true,this.is_query,val)
    },
    no_finish(){
      this.is_modal=false
    },
    batch_yearly(){
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择表单',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectionChange.length;i++){
          if(this.selectionChange[i].status!=1){
            this.$message({
              message: '所选表单中含有已完成年检表单',
              type: 'warning'
            });
            return false
          }
        }
        this.is_modal=!this.is_modal
        this.batch=true
      }
    },
    finish(){/*完成年检*/   
      var self=this
      var arr=[]
      if(this.batch){
        if(this.selectionChange.length<1){
          this.$message({
            message: '请选择资产',
            type: 'warning'
          });
          return false
        }
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].chkId)
        }
      }else{
        arr=[self.device.chkId]
      }
      if(this.yearCheckDt){
        this.ajax({
          mode: 'post',
          url: '/ems/api/billCheck/changeStatus',
          data: {
            body:{
              ids:arr,
              status:2,
              dt:self.TIME(this.yearCheckDt,true),
              note:self.note
            }
          },
          success(res){
            self.$message({
                    message: '恭喜你，操作成功',
                    type: 'success'
                  });
            self.is_modal=false
            self.ajax_list(true,self.is_query,self.index)
            self.selectionChange=[]
            self.batch=false
          }
        })
      }else{
        this.$message({
          message: '请选择年检时间',
          type: 'warning'
        });
      }
    },
    belong_to(){/*仓库列表*/
      var self=this
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:1,
            pageSize:1000
          }
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
            if(res.data.body.rows[i].whType==2 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    batch_scrap(){//批量报废
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择资产',
          type: 'warning'
        });
      }else{
        var arr=[]
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].brId)
        }
        this.scrap(arr)
      }
    },
    scrap(arr){/*报废*/
      var self=this
      self.$confirm('此操作将该设备置为报废状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
              mode: 'post',
              url: '/ems/api/billCheck/changeStatus',
              data: {
                body:{
                  ids:arr,
                  status:3
                }
              },
              success(res){
                self.$message({
                  message: '恭喜你，操作成功',
                  type: 'success'
                });
                self.ajax_list(true,self.is_query,self.index)
              }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
  },
  watch:{
    
  }
}
</script>

<style scoped>
  .textarea{
    width:500px;
    height:200px;
  }
</style>
