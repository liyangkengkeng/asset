

import axios from 'axios';
import { Loading } from 'element-ui';
import { Notification } from 'element-ui';




axios.defaults.timeout =  5000
axios.defaults.baseURL = YBDL_URL;
const ajax=function(obj){
    obj.login = obj.login || false
    if(!obj.login){
      if(!localStorage.getItem('YBDL_name') || !localStorage.getItem('YBDL_token') || !localStorage.getItem('YBDL_update')){
        var str=window.location.href.substring(0,window.location.href.indexOf('#'));
        window.location.href=str+'#/Login'
        return false
      }
    }
    

    var timestamp = (new Date()).valueOf();//时间戳
    var str='0123456789qazwsxedcrfvtgbyhnujmiklopQAZWSXEDCRFVTGBYHNUJMIKLOP'
    var note=''//随机字符串
    for(let i=0;i<8;i++){
      var randomNum = Math.random()*62
      if(note.length<8){
        note+=str[Math.floor(randomNum)]
      }
    }
    obj.data=obj.data||{}

    obj.data.note=note //随机字符串
    obj.data.timestamp=timestamp //时间戳

    let loadingInstance = Loading.service({
        lock: true,
        text: obj.loading || 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    axios({
        method: obj.mode,
        url: obj.url,
        data:obj.data,
        headers:{
          'Authorization': localStorage.getItem('YBDL_token'),
          'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.data.code=='1000'){
          loadingInstance.close()
          obj.success(response)
        }else if(response.data.code=='4000'){
          refreshToken(obj,loadingInstance)
        }else{
          loadingInstance.close()
          if(obj.error){
            obj.error(response)
          }
          Notification({
            title: '警告',
            message: response.data.msg,
            type: 'warning'
          })
        }
    })
    .catch(error => {
       loadingInstance.close();
       if(obj.error){
        obj.error(error)
       }
      if (error.response) {
          Notification({
            title: '警告',
            message: error.response.data.msg,
            type: 'warning'
          })
          console.error(error.response.data.msg)
      } else if (error.request) {
          console.error(error.request);
      }else if(error.config){
          Notification({
            title: '警告',
            message: error.config.data.msg,
            type: 'warning'
          })
          console.error(error.config.data.msg)
      } else {
          Notification({
            title: '警告',
            message: error.msg,
            type: 'warning'
          })
          console.error(error)
      }
    });
}

const refreshToken=function(obj,loadingInstance){
    axios({
        method: obj.mode,
        url: obj.url,
        data:{
          note:obj.data.note,
          timestamp:obj.data.timestamp,
          refreshToken:localStorage.getItem('YBDL_update')
        },
    })
    .then(response => {
        axios({
            method: obj.mode,
            url: obj.url,
            data:obj.data,
        })
        .then(response => {
            if(response.data.code==1000){
              loadingInstance.close()
              obj.success(response)
            }else{
              loadingInstance.close()
              Notification({
                title: '警告',
                message: response.data.message,
                type: 'warning'
              })
            }
        })
    })
    .catch(error => {
       
    })
}

export default ajax;

