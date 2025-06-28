import { defineStore } from "pinia";

export const useAirStore=defineStore('airInfo',{
    state:()=>{
        return {
            nowDataStore:undefined,
            nowDateListStore:[],
            hoursDataListStore:undefined,
            daysDataListStore:undefined
        }
    },
    actions:{
        setNowDataStore(obj){
            this.nowDataStore=obj
        },
        setNowDateListStore(arr){
            this.nowDateListStore=arr
        },
        setHoursDataListStore(obj){
            this.hoursDataListStore=obj
        },
        setDaysDataListStore(obj){
            this.daysDataListStore=obj
        }
    }
})

export const useWeatherStore=defineStore('weatherInfo',{
     state:()=>{
        return {
            weatherInfoStore:undefined,
            lifeListStore:[],
        }
    },
    actions:{
        setWeatherInfoStore(obj){
            this.weatherInfoStore=obj
        },
        setLifeListStore(arr){
            this.lifeListStore=arr
        }
    }
})