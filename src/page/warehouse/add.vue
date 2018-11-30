<template>
  <div>
    <div class="flex jc-sb marginB20">
      <el-button @click='$router.back(-1)'>返回</el-button>
      <el-button type="primary" @click='sub'>保存</el-button>
    </div>
    <div class="padding10 background colorF marginB20 center">
      仓库信息
    </div>
    <div class="flex">
      <div class="marginR40 fg">
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">仓库类型</p>
          <p class="marginB5" v-if='status'>
            <template v-if='obj.warehouse_type==1'>
              总仓
            </template>
            <template v-else>
              分仓库(二级仓库)
            </template>
          </p>
          <p class="marginB5" v-else>
            <template v-if='grade==1'>
              总仓
            </template>
            <template v-else>
              所属总仓&emsp;{{merge_depot}}
              <!-- 分仓库(二级仓库) -->
            </template>
          </p>
        </div>
        <div class="flex marginB20">
          <p class="must height40 width120 fs0">仓库名称</p>
          <p>
           <!--  <el-select v-model="obj.parWhId" placeholder="请选择所属总仓" class='marginB20' v-if='!status && grade==2'>
              <el-option v-for="item in listAll" :key="item.whName" :label="item.whName" :value="item.parWhId"> </el-option>
            </el-select> -->
            <el-input v-model="obj.whName" placeholder="仓库名称"></el-input>
          </p>
        </div>
       <!--  <div class="flex al-ce marginB20">
          <p class="must width120 fs0">仓库所属机构</p>
          <p>
            <el-cascader
              expand-trigger="hover" :options="mechanism_list" v-model="deptName" @change="handleChange">
            </el-cascader>
          </p>
        </div> -->
        <div class="flex marginB20">
          <p class="must height40 width120 fs0">仓库地理位置</p>
          <p>
            <el-input v-model="obj.longitude" placeholder="输入经度" class='marginB20'></el-input>
            <el-input v-model="obj.latitude" placeholder="输入纬度" class='marginB20'></el-input>
            <el-button @click='loca'>确认输入位置</el-button>
          </p>
        </div>
      </div>

      <div class="fg">
        <div class="flex marginB20">
          <p class="must width120 height20 fs0">是否启用</p>
          <p class="marginB5">
            <el-radio v-model="obj.status" label="0">不启用</el-radio>
            <el-radio v-model="obj.status" label="1">启用</el-radio>
          </p>
        </div>
        <div id="allmap" class="allmap width100"></div>
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
      grade:0,
      merge_depot:'',//总仓名称
      edit:false,//编辑状态
    }
  },
  created(){
    this.ajax_list()
    this.merge_depot=this.$route.query.name
    this.grade=this.$route.query.grade
    if(this.$route.query.obj){
      this.obj=JSON.parse(this.$route.query.obj)
      this.status=true
      this.edit=true
    }else{
      this.obj={
        parWhId:this.$route.query.parWhId,
        whType:this.grade,//总仓还是分仓
        whName:'',//分仓库名称
        deptName:'',//机构
        status:'',//是否启用
        longitude:'',//经度
        latitude:'',//纬度
      }
    }
    if(this.$route.query.grade){
      this.$set(this.obj,'warehouse_type',this.$route.query.grade)
      this.$set(this.obj,'status',JSON.parse(this.$route.query.obj).status+'')
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.loadBMapScript();
    })
    
    // window['bMapInit'] = () => {
    //   this.qeuryLocation();
    // };
  },
  methods:{
    sub(){
      var self=this
      var boo
      if(this.grade==2){
        boo=this.obj.parWhId && this.obj.whType && this.obj.whName  && this.obj.status && this.obj.longitude && this.obj.latitude
      }else{
        boo=this.obj.whType && this.obj.whName  && this.obj.status && this.obj.longitude && this.obj.latitude
      }
      if(boo){
        this.obj.createDt = this.obj.created=='--' ? '' : this.obj.created
        var url= this.edit ? '/ems/api/warehouse/update' : '/ems/api/warehouse/save'
        this.ajax({
          mode:'post',
          url:url,
          data:{
            body:self.obj
          },
          success(res){
            self.$message({
              message: '操作成功',
              type: 'success'
            });
            self.$router.push({name:'warehouse_list'})
            console.log(res)
          }
        })
      }else{
        if(!this.obj.whType)
          this.$message({message: '请选择总仓还是分仓',type: 'warning'})
        else if (!this.obj.parWhId && this.grade==2)
          this.$message({message: '请选择所属总仓',type: 'warning'})
        else if(!this.obj.whName)
          this.$message({message: '请填写仓库名称',type: 'warning'});
        else if(!this.obj.longitude)
          this.$message({message: '请填写位置：经度',type: 'warning'});
        else if(!this.obj.latitude)
          this.$message({message: '请填写位置：纬度',type: 'warning'});
        else if(!this.obj.status)
          this.$message({message: '请选择状态',type: 'warning'});
      }
      
      
    },
    change(event){ /*上传图片*/
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target:document.getElementsByClassName('file-box')[0],
      });
      var self=this
      var file = new FileReader();
      file.readAsDataURL(event.currentTarget.files[0]);
      file.onload = function (url) {
          self.$set(self.obj,'file_img',url.currentTarget.result)
          loading.close();
          document.getElementById('file').outerHTML=document.getElementById('file').outerHTML.replace(/(value=\").+\"/i,"$1\""); 
      };
    },
    loadBMapScript () {
      let script = document.createElement('script');
      script.src = 'http://api.map.baidu.com/api?v=3.0&ak=cjaMO2lnsh8qv8Kiacwe9F9kq5MASnH4&callback=bMapInit';
      document.body.appendChild(script);
       window['bMapInit'] = () => {
        if(self.status){
          self.loca()
        }else{
          var map = new BMap.Map("allmap");          // 创建地图实例  
          var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
          map.centerAndZoom(point, 12);                 // 初始化地图，设置中心点坐标和地图级别 
          map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        }
       }
      
    },
    qeuryLocation (jd, wd) {
        var map = new BMap.Map("allmap");          // 创建地图实例
        var point = new BMap.Point(jd, wd);  // 创建点坐标 
        map.centerAndZoom(point, 12);
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        //创建小狐狸
        var marker = new BMap.Marker(point);
        map.addOverlay(marker); 
    },
    loca(){
      this.qeuryLocation(Number(this.obj.longitude),Number(this.obj.latitude))
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
            pageSize:10
          }
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            if(res.data.body.rows[i].whType==1 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    handleChange(value){/*级联选择器*/
      console.log(value)
    }
  },
  watch:{
    
  },
}
</script>

<style scoped>
	.file-img{
    width:150px;
    height:150px;
    border:1px solid #d9d9d9;
    margin-right: 10px;
    display: block
  }
  .file-input{
    width:150px;height: 150px;left: 0px;top: 0px;opacity: 0;
  }
  .allmap{
    height: 400px;
  }
</style>
