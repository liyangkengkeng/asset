<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <el-input v-model="asset_number" placeholder="报废编号搜索" class='search width200'></el-input>
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="报废起始日期" end-placeholder="报废起始日期"></el-date-picker>
        <el-select v-model="categoryName" placeholder="所属仓库">
          <el-option label='全部' value=''></el-option>
          <el-option v-for='(val,key) in listAll' :label='val.whName' :key='val.whId' :value='val.whNo'></el-option>
        </el-select>
        <el-select v-model="status" placeholder="状态">
          <el-option label='全部' value=''></el-option>
          <el-option label='待审核' value='1'></el-option>
          <el-option label='已报废' value='2'></el-option>
          <el-option label='已撤销' value='3'></el-option>
        </el-select>
      </div>
      <div class="flex jc-sb">
        <div>
          <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
        </div>
        <div>
          <!-- <el-select v-model="batch" placeholder="选择批量状态修改">
            <el-option label='类型1' value='类型1'></el-option>
          </el-select> -->
          <el-button type="primary" @click='revoke'>批量报废</el-button>
          <el-button type="primary" @click='batch_scrap'>批量撤销报废</el-button>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="使用寿命" class='width30 marginB0' v-if='props.row.serviceLife'> <span>{{ props.row.serviceLife }}</span> </el-form-item>
            <el-form-item label="采购时间" class='width30 marginB0' v-if='props.row.buyDt'> <span>{{ props.row.buyDt }}</span> </el-form-item>
            <el-form-item label="审核人" class='width30 marginB0' v-if='props.row.checkBy'> <span>{{ props.row.checkBy }}</span> </el-form-item>
            <el-form-item label="审核时间" class='width30 marginB0' v-if='props.row.checkDt'> <span>{{ props.row.checkDt }}</span> </el-form-item>
            <el-form-item label="报废说明" class='width30 marginB0' v-if='props.row.checkNotes'> <span>{{ props.row.checkNotes }}</span> </el-form-item>
            <el-form-item label="属性分类" class='width30 marginB0' v-if='props.row.categoryName'> <span>{{ props.row.categoryName }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="报废编号" prop="bcNo"> </el-table-column>
      <el-table-column label="资产名称" prop="devName"> </el-table-column>
      <el-table-column label="标签号" prop="labNo"> </el-table-column>
      <el-table-column label="申请人" prop="applyBy"> </el-table-column>
      <el-table-column label="所属仓库" prop="branchWh"> </el-table-column>
      <el-table-column label="报废状态" prop="status">
        <template slot-scope="scope">
          <span v-if='scope.row.status==1'>待审核</span>
          <span v-else-if='scope.row.status==2'>已报废</span>
          <span v-else-if='scope.row.status==3'>已撤销</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="checkDt" width='160'> </el-table-column>
      <!-- <el-table-column label="报废说明" prop="applyNotes"> </el-table-column> -->
      <!-- <el-table-column label="撤销时间" prop="desc" width='160'> </el-table-column> -->
      <el-table-column label="操作" width='200'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.status==1' type="primary" size="mini" @click='is_modal=!is_modal,device=scope.row'>报废</el-button>
          <el-button v-if='scope.row.status==1' type="danger" size="mini" @click='scrap([scope.row.bcId])'>撤销报废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          是否报废物品
        </div>
        <div class="marginB20">
          <textarea v-model='note' class="textarea padding10" name="" placeholder="报废说明100字以内" maxlength="100"></textarea>
        </div>
        <div class="center">
          <el-button @click='no_finish'>取消</el-button>
          <el-button type="primary" @click='finish'>确定</el-button>
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
      list: [],
      is_modal:false,
      is_query:false,//是否是查询
      total:100,//总信息条数，
      listAll:[],//仓库列表
      device:{},
      index:1,
      batch:false,//是否是批量操作
      note:'',//报废说明
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
        url: '/ems/api/billCancel/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].applyDt=res.data.body.rows[i].applyDt ? self.TIME(res.data.body.rows[i].applyDt) : ''
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : ''
          //   res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
          //   res.data.body.rows[i].checkDt=res.data.body.rows[i].checkDt ? self.TIME(res.data.body.rows[i].checkDt) : '--'
          // }
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
    revoke(){/*批量报废按钮*/
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择表单',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectionChange.length;i++){
          if(this.selectionChange[i].status==2){
            this.$message({
              message: '所选表单中含有已报废表单',
              type: 'warning'
            });
            return false
          }
        }
        this.is_modal=!this.is_modal
        this.batch=true
      }
    },
    finish(){
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
          arr.push(this.selectionChange[i].bcId)
        }
      }else{
        arr=[self.device.bcId]
      }
      this.ajax({
        mode: 'post',
        url: '/ems/api/billCancel/changeStatus',
        data: {
          body:{
            ids:arr,
            status:2,
            dt:(new Date()).valueOf(),
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
    batch_scrap(){//批量撤销报废
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择表单',
          type: 'warning'
        });
      }else{
        var arr=[]
        for(let i=0;i<this.selectionChange.length;i++){
          if(this.selectionChange[i].status!=2){
            this.$message({
              message: '所选表单中含有未报废表单',
              type: 'warning'
            });
            return false
          }
          arr.push(this.selectionChange[i].bcId)
        }
        this.scrap(arr)
      }
    },
    scrap(arr){/*撤销报废*/
      var self=this
      self.$confirm('此操作将撤销报废, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
              mode: 'post',
              url: '/ems/api/billCancel/changeStatus',
              data: {
                body:{
                  ids:arr,
                  status:3,
                  dt:(new Date()).valueOf()
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
