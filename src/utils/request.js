import axios from "axios";
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus'

//
const open = (msg) => {
    ElMessageBox.confirm(
        `${msg}`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
        }
    )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '',
      })
    })
}

//
let loading=''
const openLoading = () => {
   loading = ElLoading.service({
    lock: true,
    text: '数据请求中...',
    background: 'rgba(240, 240, 240, 0.89)',
  })
}

//
const http=axios.create({
    baseURL: '/api',//代理
    timeout: 8000,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
})

//
http.interceptors.request.use(
    (config)=>{
        openLoading()
        if(config.url.includes('fapigw/air')){//空气质量
            config.params['key']='**********************'//聚合数据接口个人密钥
        }else{//天气预报
            config.params['key']='**********************'
        }
        return config
    },
    (error)=>{
        return Promise.reject(error);
    }
)

//
http.interceptors.response.use(
    (response)=>{
        if(response.data.error_code==0){
            loading.close()
            return response
        }
        //错误处理
        loading.close()
        open(response.data.reason)
        return Promise.reject(error)
    },
    (error)=>{
        loading.close()
        return Promise.reject(error);
    }
)

//
export default http