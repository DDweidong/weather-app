<template>
    <div class="aLayout">
        <div class="searchArea">
            <el-row>
                <el-col :span="10" class="input" style="margin-top: 30px;">
                    <div class="search">
                        <el-input
                        v-model="searchValue"
                        size="large"
                        placeholder="请输入要查询城市名称..."
                        style="font-size: 18px;width: 360px;"
                        @focus="show"
                        @blur="noShow"
                        >
                            <template #prefix>
                                <el-icon class="el-input__icon"><search /></el-icon>
                            </template>
                            <template #append>
                                <el-button type="primary" @click="searh" >搜索</el-button>
                             </template>
                        </el-input>
                    </div>
                    <div class="panel" v-show="(showPanel||searchValue)&& noSearch">
                        <div class="history" v-if="history.length">
                            <div class="title">
                                <div class="text">历史搜索</div>
                                <div class="delete" @click="centerDialogVisible = true">
                                    <el-icon style="vertical-align: middle">
                                        <DeleteFilled />
                                    </el-icon>
                                </div>
                            </div>
                            <div class="tabs">
                                <el-tag
                                v-for="item in history"
                                :key="item"
                                effect="plain"
                                round
                                @click="tagSearch(item)"
                                >
                                    {{ item }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="hot">
                            <div class="title">
                                <div class="text">热门城市</div>
                            </div>
                            <div class="tabs">
                                <el-tag
                                v-for="item in hotCity"
                                :key="item"
                                effect="plain"
                                round
                                @click="tagSearch(item)"
                                >
                                    {{ item }}
                                </el-tag>
                            </div>
                        </div>

                        <el-dialog
                            v-model="centerDialogVisible"
                            title="提示"
                            width="500"
                            align-center
                        >
                            <span style="font-size: 20px;">确认删除历史搜索记录</span>
                            <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="centerDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="deleteCenter">
                                确定
                                </el-button>
                            </div>
                            </template>
                        </el-dialog>
                    </div>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="12">
                    <div class="nowData" v-if="nowData">
                        <div class="title">
                            <div class="loc">
                                <el-icon><MapLocation /></el-icon>
                            </div>
                            <span>{{ nowData.result.CityName }}</span>
                        </div>
                        <div class="main">
                            <div class="aqi">
                                <div class="tit">AQI</div>
                                 <el-progress type="dashboard" :percentage="nowData.result.AQI" 
                                    :stroke-width="14" 
                                    color="LIGHTSALMON"
                                >
                                    <template #default="{ percentage }">
                                        <div class="in" style="color: azure;display: 
                                            flex;flex-direction: column;justify-content: center;"
                                        >
                                            <div style="font-size: 22px;font-weight: 600;
                                                margin-top: 8px;margin-bottom: 5px;"
                                            >
                                                {{ nowData.result.AQI }}
                                            </div>
                                            <div style="font-weight: 600;font-size: 18px;margin-top: 5px;">
                                                {{ getQualityByAQI(nowData.result.AQI) }}
                                            </div>
                                        </div>
                                    </template>
                                </el-progress>
                            </div>
                            <div class="list" v-if="nowDateList.length">
                                <div class="box" v-for="item in nowDateList">
                                    <div class="title">{{item.type }}:</div>
                                    <div class="content">
                                        <div class="value">
                                            <span style="font-weight: 600;font-size: 20px;">{{ item.value }}</span>
                                            <span>
                                                {{ item.unit }}
                                            </span>
                                        </div>
                                        <div class="show">
                                            <el-progress :percentage="item.value" :stroke-width="8" >
                                                {{ '' }}
                                            </el-progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tips">
                            <span style="margin-right: 20px;font-size: 30px;"><el-icon><Bicycle /></el-icon></span>
                            <div>{{ nowData.result.Unheathful }}</div>
                        </div>
                    </div>
                    <div class="none" v-else>
                        <img src="../assets/imgs/暂无.png" alt="">
                        <div class="text">暂无数据</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="hours" v-if="hoursDataList">
            <div class="title">
                <div class="box">1</div>
                {{nowData.result.CityName}}
            </div>
            <div class="char1">
                <LineGraph :obj="hoursDataList" type="hours"></LineGraph>
            </div>
        </div>
        <div class="days" v-if="daysDataList ">
            <div class="title">
                <div class="box">1</div>
                {{ nowData.result.CityName }}
            </div>
            <div class="char2">
                <LineGraph :obj="daysDataList" type="days"></LineGraph>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,h } from 'vue';
import {transformPollutionData,processData,processDailyData,getQualityByAQI,getCityCode} from '@/utils/common'
import { useAirStore } from '@/stores/index'
import LineGraph from '@/components/LineGraph.vue';
import { apiGetAir,apiGetDays,apiGetHours } from '@/api';
import { ElMessageBox  } from 'element-plus'


//
const searchValue=ref('')
const nowData=ref()
const nowDateList=ref([])
const hoursData=ref()
const hoursDataList=ref()
const daysData=ref()
const daysDataList=ref()
//
const hotCity=ref(['北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '重庆', '西安', '武汉','桂林'])
const history=ref([])
history.value=localStorage.getItem('historyListAir')?localStorage.getItem('historyListAir').split(','):[]
const centerDialogVisible=ref(false)
const showPanel=ref(false)
const noSearch=ref(true)

//
const airInfo=useAirStore()
nowData.value=airInfo.nowDataStore
nowDateList.value=airInfo.nowDateListStore
hoursDataList.value=airInfo.hoursDataListStore
daysDataList.value=airInfo.daysDataListStore

//
const getNowData=async(id)=>{
    let res=await apiGetAir(id)
    nowData.value=res.data
    nowDateList.value=transformPollutionData(nowData.value)
    //
    airInfo.setNowDataStore(nowData.value)
    airInfo.setNowDateListStore(nowDateList.value)
}

//
const getHours=async(id)=>{
    let res=await apiGetHours(id)
    hoursData.value=res.data
    hoursDataList.value=processData(hoursData.value.result.Data)
    //
    airInfo.setHoursDataListStore(hoursDataList.value)
}

//
const getDays=async(id)=>{
    let res=await apiGetDays(id)
    daysData.value=res.data
    daysDataList.value=processDailyData(daysData.value.result)
    //
    airInfo.setDaysDataListStore(daysDataList.value)
}

//
const show=()=>{
    showPanel.value=true
    noSearch.value=true
}
//
const noShow=()=>{
    setTimeout(()=>{
        showPanel.value=false
    },300)
}

//
const open = () => {
  ElMessageBox({
    title: '提示',
    message: h('p', null, [
      h('span', { style: 'font-size:16px' }, '由于接口文档问题：目前暂时只支持'),
      h('i', { style: 'color: teal;font-size:20px' }, '热门城市查询'),
    ]),
  })
}

//
const searh=()=>{
    if(searchValue.value){
        history.value=[...new Set([searchValue.value,...history.value])].slice(0,10)
        localStorage.setItem('historyListAir',history.value)
        showPanel.value=false
        noSearch.value=false
        //
        let id=getCityCode(searchValue.value)
        if(id!==-1){
            getNowData(id).then(()=>{
                getHours(id)
            }).then(()=>{
                getDays(id)
            })
        }
        else{
            open()
        }
    }
}

//
const tagSearch=(item)=>{
    searchValue.value=item
    searh()
}

//
const deleteCenter=()=>{
    history.value=[]
    localStorage.removeItem('historyListAir')
    centerDialogVisible.value = false
}

</script>

<style scoped lang="scss">
.aLayout{
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    padding: 10px 15px 20px 15px;
    .searchArea{
        margin-bottom: 20px;

        .input{
            width: 100%;
            height: 240px;
            background-image: url(../assets/imgs/bg.jpg);
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            .search{
                margin-top: 40px;
                height: 42px;
                box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            }
            .panel{
                position: absolute;
                top: 120px;
                background-color:rgba(240,255,255,0.69);
                border: 1px solid rgba(0,0,0,0.3);
                width: 360px;
                padding: 10px;
                border-radius: 20px;
                .history{
                    margin-bottom: 10px;
                }
                .title{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                 .tabs{
                    .el-tag{
                        margin-right: 3px;
                        margin-bottom: 3px;
                    }
                    .el-tag:hover{
                        cursor: pointer;
                    }
                }
            }
        }
        .nowData{
            background: linear-gradient(135deg, #4da0ff 0%, #6dccff 100%);
            border-radius: 20px;
            padding: 15px 15px 5px 15px;
            height: 100%;
            .title{
                color: azure;
                font-size: 22px;
                font-weight: 600;
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .loc{
                    height: 34px;
                    width: 34px;
                    border-radius: 34px;
                    background-color: rgba(58, 147, 237, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                span{
                    margin-left: 15px;
                }
            }
            .main{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                .aqi{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-left: 5px;
                    .tit{
                        margin-bottom: 8px;
                        font-size: 26px;
                        font-weight: 600;
                        color: azure;
                    }
                }
                .list{
                    display: grid;
                    gap: 18px;
                    grid-template-columns: repeat(3,1fr); 
                    width: 100%;
                    margin-left: 50px;
                    margin-bottom: 18px;
                    padding-top: 18px;
                    .box{
                        display: flex;
                        align-items: center;
                        color: azure;
                        margin-bottom: 20px;
                        width: 100%;
                        .title{
                            font-size: 20px;
                            font-weight: 500;
                            margin-right: 20px;
                        }
                        .content{
                            width: 90px;
                            .value{
                                margin-bottom: 8px;
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }
                            .show{
                                width: 145px;
                            }
                        }
                    }
                }
            }
            .tips{
                background-color: rgb(84,160,222);
                width: fit-content;
                height: 42px;
                border-radius: 40px;
                color: azure;
                font-size: 20px;
                font-weight: 600;
                display: flex;
                align-items: center;
                padding: 5px 5px 5px 15px;
                div{
                    padding: 5px;
                }
            }
        }
        .none{
            width: 100%;
            border-radius: 24px;
            overflow: hidden;
            img{
                width: 100%;
            }
            .text{
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                font-weight: 600;
            }
        }
    }
    .hours{
        margin-top: 50px;
        padding: 10px 15px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        width: 1500px;
        height: 350px;
        .title{
            display: flex;
            align-items: center;
            font-size: 26px;
            font-weight: 600;
            .box{
                color: #4da0ff;
                width: 30px;
                height: 50pox;
                background-color: #4da0ff;
                margin-right: 10px;
            }
        }
    }
    .days{
        margin-top: 50px;
        padding: 10px 15px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        width: 1500px;
        height: 350px;
        .title{
            display: flex;
            align-items: center;
            font-size: 26px;
            font-weight: 600;
            .box{
                color: #4da0ff;
                width: 30px;
                height: 50pox;
                background-color: #4da0ff;
                margin-right: 10px;
            }
        }
    }
}
</style>