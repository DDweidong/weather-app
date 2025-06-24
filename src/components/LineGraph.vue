<template>
    <div class="echarsBox" >
        <div :id="'myEchars'+props.type" style="width: 1500px;height: 320px;"></div>
    </div>
</template>

<script setup>
import * as echars from 'echarts'
import { formatter } from 'element-plus';
import { onMounted ,onUnmounted} from 'vue';

//
const props=defineProps({
    obj:{
        type:Object,
        //required:true
    },
    type:{
        type:String,
        //required:true
    }
})

const myEchars=echars
const option = {
    title:{
        text:'',
        left:"center"
    },
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],

  },
  yAxis: {
    type: 'value',
    name: 'AQI',
    nameTextStyle:{
        fontSize:13
    }
  },
  tooltip:{
    trigger:"axis",
    valueFormatter:function(value){
        if (value <= 50) return value+" 优";
        if (value <= 100) return value+" 良";
        if (value <= 150) return value+" 轻度污染";
        if (value <= 200) return value+" 中度污染";
        if (value <= 300) return value+" 重度污染";
        return value+" 严重污染";
    },
    textStyle:{
        color:"#A0101"
    }
  },
  series: [
    {
      data: [10, 22, 28, 23, 19],
      type: 'line',
      smooth: true,
      itemStyle:{
        normal:{
            label:{
                show:true,
                position:'top',
                formatter:"{c}"
            }
        }
      }
    }
  ]
}

//
onMounted(()=>{
    let chart=myEchars.init(document.getElementById(`myEchars${props.type}`))
    //
    if(props.obj.hours){
        option.xAxis.data=props.obj.hours
        option.title.text='AQI指数 近24小时的空气质量'
    }
    else{
        option.xAxis.data=props.obj.days
        option.title.text='AQI指数 近14天的空气质量'
    }
    option.series[0].data=props.obj.aqis
    //
    chart.setOption(option)
})

//
onUnmounted(()=>{
    //myEchars.dispose()
})

</script>

<style lang="scss" scoped>
</style>