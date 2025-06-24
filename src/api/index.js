import request from '@/utils/request'

const AIR_URL='/fapigw/air'
const WEATHER_URL='/simpleWeather'

export const apiGetWeather=(city)=>{
    return request({
        url:WEATHER_URL+'/query',
        params:{
            city
        },
        method:'GET'
    })
}

export const apiGetLife=(city)=>{
     return request({
        url:WEATHER_URL+'/life',
        params:{
            city
        },
        method:'GET'
    })
}


//支持城市清单
export const apiGetCity=(pId)=>{
     return request({
        url:AIR_URL+'/citys',
        params:{
            pId
        },
        method:'GET'
    })
}

//城市实时空气质量
export const apiGetAir=(cityId)=>{
     return request({
        url:AIR_URL+'/live',
        params:{
            cityId
        },
        method:'GET'
    })
}

//查询近14天空气质量
export const apiGetDays=(cityId)=>{
     return request({
        url:AIR_URL+'/history',
        params:{
            cityId
        },
        method:'GET'
    })
}

//查询近24小时空气质量
export const apiGetHours=(cityId)=>{
     return request({
        url:AIR_URL+'/historyHours',
        params:{
            cityId
        },
        method:'GET'
    })
}