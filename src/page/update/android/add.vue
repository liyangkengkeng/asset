<template>
  <div class=''>
    <div class='flex jc-sb marginB20'>
      <el-button type="success" @click='$router.back(-1)'>返回</el-button>
      
    </div>
    <div>
      <div class='marginB20 flex al-ce'>
        <p class='width120 must'>升级渠道：</p>
        <p>
          <el-radio v-model="radio" label="1">安卓端升级</el-radio>
        </p>
      </div>
      <div class='marginB20 flex al-ce'>
        <p class='width120 must'>软件名称：</p>
        <p>
          <el-input v-model="versionName" placeholder="输入版本名称"></el-input>
        </p>
      </div>
      <div class='marginB20 flex'>
        <p class='width120 must height40'>软件版本：</p>
        <p>
          <el-input v-model="versionCode" placeholder="输入整数" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
          <span class='size12'>输入比上一版本更大的整数，否则将升级失败</span>
        </p>
      </div>
      <div class='marginB20 flex al-ce'>
        <p class='width120 must'>升级包上传：</p>
        <p class='flex pr'>
          <el-input v-model="apk" disabled class='marginR20'></el-input>
          <el-button type="primary" @click='sub'>上传</el-button>
          <input type="file" name="" class='pa file cp' id='file' @change='change'>
        </p>
      </div>
      <div class='marginB20 flex al-ce'>
        <p class='width120 must'>升级类型：</p>
        <p>
          <el-radio v-model="forced" label="1">强制升级</el-radio>
          <el-radio v-model="forced" label="0">非强制升级</el-radio>
        </p>
      </div>
      <div class='marginB20 flex al-ce'>
        <p class='width120 must'>更新提示：</p>
        <p>
          <el-radio v-model="trip" label="1">有提示</el-radio>
          <el-radio v-model="trip" label="0">无提示</el-radio>
        </p>
      </div>
      <div class='flex marginB20'>
        <p class='width120'>升级描述：</p>
        <p>
          <textarea v-model='remark' class='textarea padding10' name="" placeholder="升级包描述200字以内，" maxlength="200"></textarea>
        </p>
      </div>
      <div class='flex marginB20'>
        <p class='width120'></p>
        <p>
          <el-button type="primary" class='width120' @click='sub'>保存</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio:'1',
      versionCode:'',//版本号
      versionName:'',//升级包名称
      forced:'1',//类型
      trip:'1',//提示
      remark:'',//描述
      appUrl:'',//升级地址
      apk:'',
    }
  },
  created(){
    
  },
  methods:{
    sub(){
      var self=this
      if(this.versionCode && this.versionName && this.forced && this.trip){
        this.ajax({
          mode: 'post',
          url: '/ems/api/update/save',
          data:{
            body:{
              versionCode:Number(self.versionCode),
              versionName:self.versionName,
              forced:Number(self.forced),
              trip:Number(self.trip),
              remark:self.remark,
              appUrl:self.appUrl
            }
          },
          success(res){
            self.$message({
              message: '保存成功',
              type: 'success'
            });
            self.$router.push({ name: 'android' })
          }
        })
      }else{
        if(!this.versionCode){
            this.$notify({
              title: '警告',
              message: '请输入升级版本',
              type: 'warning'
            });
        }else if(!this.versionName){
          this.$notify({
            title: '警告',
            message: '请上传升级包',
            type: 'warning'
          });
        }else if(!this.forced){
          this.$notify({
            title: '警告',
            message: '请选择升级类型',
            type: 'warning'
          });
        }else if(!this.trip){
          this.$notify({
            title: '警告',
            message: '请选择更新提示',
            type: 'warning'
          });
        }
      }
    },
    change(e){
      const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
      var self=this
      let file0 = event.target.files[0]
      let param = new FormData()  // 创建form对象
      param.append('upload', file0)  // 通过append向form对象添加数据
      
      self.axios.post(YBDL_URL+'/ems/api/file/uploadFile',param,{
        headers:{'Authorization': localStorage.getItem('YBDL_token')},
      })
      .then(response=>{
        loading.close();
        if(!response.data.error){
          self.apk=e.target.files[0].name
          self.appUrl=response.data.url
          self.$message({
            message: '上传成功',
            type: 'success'
          });
        }else{
          self.$notify({
            title: '警告',
            message: response.data.error,
            type: 'warning'
          })
        }
      })
      .catch((error)=>{
        loading.close();
        if (error.response) {
          self.$notify({
            title: '警告',
            message: error.response.data.msg,
            type: 'warning'
          })
        }else if(error.config){
            self.$notify({
              title: '警告',
              message: error.config.data.msg,
              type: 'warning'
            })
        } else {
            self.$notify({
              title: '警告',
              message: error.msg,
              type: 'warning'
            })
        }
      })

    },
  },
  watch:{
    
  }
}
</script>

<style scoped>
  .file{
    right: 0px;
    top: 0px;
    width: 70px;
    opacity: 0;
    height: 40px;
  }
  .textarea{
    width:300px;height: 200px;
  }
</style>
