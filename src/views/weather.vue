<template>
    <div class="wLayout">
        <el-row>
            <el-col :span="6">
                <div class="left">
                    <div class="input">
                        <el-input
                        v-model="searchValue"
                        placeholder="请输入要查询天气的城市..."
                        class="input-with-select"
                        style="font-size: 18px;height: 35px;"
                        >
                        <template #prepend>
                            <el-icon style="vertical-align: middle">
                                <Search />
                            </el-icon>
                        </template>
                        <template #append>
                            <el-button type="primary" @click="searh" >搜索</el-button>
                        </template>
                        </el-input>
                    </div>
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

            </el-col>

            <el-col :span="3"></el-col>

            <el-col :span="15">
                <div class="right" v-if="weatherInfo">
                    <div class="title">
                        <div class="city">
                            <el-icon><OfficeBuilding /></el-icon>
                            <span>{{ weatherInfo.result.city }}</span>
                        </div>
                        <div class="now">
                            {{ nowData(Date.now()) }}
                        </div>
                    </div>
                    <div class="realtime">
                        <div class="left">
                            <div class="img">
                                
                            </div>
                            <div class="tem">
                                {{ weatherInfo.result.realtime.temperature }}°C
                            </div>
                        </div>
                        <div class="box">
                            <div class="wid">
                                {{  weatherInfo.result.realtime.info}}
                                <el-icon><Cloudy /></el-icon>
                            </div>
                            <div>
                                湿度：{{ weatherInfo.result.realtime.humidity }}%
                            </div>
                        </div>
                        <div class="box">
                            <div class="direct">
                                {{  weatherInfo.result.realtime.direct }}
                            </div>
                            <div class="power">
                                {{  weatherInfo.result.realtime.power }}
                            </div>
                        </div>
                    </div>
                    <div class="aqi">
                        <span style="font-weight: 600;">{{ weatherInfo.result.city }}</span> 的空气质量指数为：
                        <span style="font-weight: 600;">
                            {{weatherInfo.result.realtime.aqi}}
                        </span>
                    </div>
                    <div class="life" v-if="lifeList.length">
                        <div class="title">
                            生活指数：
                        </div>
                        <div class="list">
                            <div class="box" v-for="item in lifeList" >
                                <el-popover
                                    placement="top-start"
                                    trigger="hover"
                                    :width="200"
                                    :content="item.des"
                                    :hide-after="10"
                                    popper-style="font-size:17px;border-radius: 15px;opacity: 0.92;color: black;"
                                >
                                    <template #reference >
                                        <div>
                                            <div class="tit">
                                                <IconFont :name="item.type" :size="24"></IconFont>
                                            </div>
                                            <div class="des">{{ item.v }}</div>
                                        </div>
                                    </template>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                    <div class="futureTit">
                        <span style="font-weight: 600;">{{ weatherInfo.result.city }}</span> 未来5天：
                    </div>
                    <div class="future">
                        <div class="box" v-for="item in weatherInfo.result.future">
                            <div class="date ins">
                                {{ formatDate(item.date)}}
                            </div>
                            <div class="wea ins">
                                {{ item.weather }}
                            </div>
                            <div class="tem ins" >
                                {{ item.temperature }}
                            </div>
                            <div class="wid ins">
                                {{ item.direct }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="none" v-else>
                    <img src="../assets/imgs/暂无.png" alt="">
                    <div class="text">暂无数据</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import IconFont from '@/components/IconFont.vue';
import { ref} from 'vue';
import {transformLifeObject,formatDate,nowData} from '@/utils/common'
import { apiGetWeather,apiGetLife } from '@/api';
import {useWeatherStore} from '@/stores/index'

//
const history=ref([])
history.value=localStorage.getItem('historyList')?localStorage.getItem('historyList').split(','):[]
const hotCity=ref(['北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '重庆', '西安', '武汉'])
const searchValue=ref('')
const centerDialogVisible=ref(false)
const weatherInfo=ref()
const lifeInfo=ref()
const lifeList=ref([])

//
const weatherStore=useWeatherStore()
weatherInfo.value=weatherStore.weatherInfoStore
lifeList.value=weatherStore.lifeListStore

//
const getWeather=async (city)=>{
    let res=await apiGetWeather(city)
    weatherInfo.value=res.data
    //console.log(weatherInfo.value)
    //
    weatherStore.setWeatherInfoStore(weatherInfo.value)
}

//
const getLife=async(city)=>{
    let res =await apiGetLife(city)
    lifeInfo.value=res.data
    lifeList.value=transformLifeObject(lifeInfo.value.result.life)
    //console.log(lifeList.value)
    //
    weatherStore.setLifeListStore(lifeList.value)
}


//
const searh=()=>{
    if(searchValue.value){
        history.value=[...new Set([searchValue.value,...history.value])].slice(0,10)
        localStorage.setItem('historyList',history.value)
        //
        getWeather(searchValue.value).then(()=>{
            getLife(searchValue.value)
        })
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
    localStorage.removeItem('historyList')
    centerDialogVisible.value = false
}

</script>

<style scoped lang="scss">
.wLayout{
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    padding: 10px 15px 8px 15px;
    .left{
        .input{
            margin-bottom: 20px;
        }
        .history{
            margin-bottom: 20px;
            font-size: 20px;
        }
        .hot{
            font-size: 20px;
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
                margin-right: 10px;
                margin-bottom: 8px;
                font-size: 15px;
            }
            .el-tag:hover{
                cursor: pointer;
            }
        }
    }
    .right{
        padding: 12px;
        margin-bottom: 15px;
        background-color: rgb(255,240,241);
        border-radius: 15px;
        .title{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 10px;
            border-bottom: 1px solid black;
            .city{
                display: flex;
                align-items: center;
                font-weight: 600;
                margin-right: 20px;
                font-size: 28px;
                span{
                    margin-left: 8px;
                }
            }
            .now{
                font-weight: 500;
                font-size: 20px;
                margin-right: 30px;
            }
        }
        .realtime{
            display: flex;
            align-items: center;
            margin-top: 10px;
            .left{
                .tem{
                    font-size: 50px;
                    font-weight: 700;
                    padding-right: 35px;
                }
            }
            .box{
                font-weight: 600;
                padding-right: 39px;
                .wid{
                    padding-bottom: 5px;
                }
                .direct{
                    padding-bottom: 5px;
                }
            }
        }
        .aqi{
            padding: 10px 0;
            font-weight: 400;
            font-size: 18px;
        }
        .futureTit{
            margin: 15px 0;
            font-weight: 500;
            font-size: 19px;
        }
        .future{
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-top: 15px;
            .box{
                padding: 5px;
                background-color: rgb(236,194,195);
                border-radius: 20px;
                height: 130px;
                width: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .ins{
                    margin-bottom: 9px;
                }
                .tem{
                    font-weight: 600;
                }
                .wid{
                    font-weight: 600;
                }
                .date{
                    font-weight: 400;
                }
                .wea{
                    font-weight: 600;
                }
            }
        }
        .life{
            width: 860px;
            background-color: rgb(228, 196, 198);
            border-radius: 20px;
            padding: 20px;
            .title{
                font-weight: 600;
                font-size: 20px;
            }
            .list{
                display: grid;
                gap: 15px;
                grid-template-columns: repeat(3,1fr); 
                padding: 10px 5px;
                .box{
                    background-color: rgb(208, 168, 169);
                    border-radius: 20px;
                    height: 80px;
                    width: 220px;
                    .el-tooltip__trigger{
                        margin-top: 8px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        .tit{
                            padding: 5px;
                        }
                        .des{
                            margin-top: 5px;
                            font-size: 18px;
                            font-weight: 500;
                        }
                    }

                }
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
</style>