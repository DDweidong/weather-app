<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                <div class="tabs">
                    <div class="title">
                        <img src="../assets/title.png" alt="">
                        天气查询网
                    </div>
                    <router-link  :class="lightShow[0].now" to="weather" @click="updateTabState('weather')">
                        天气情况
                    </router-link >
                    <router-link :class="lightShow[1].now" to="air" @click="updateTabState('air')">
                        空气情况
                    </router-link>
                </div>
            </el-header>
            <el-main class="main">
                <div class="box" style="height: 50px;">1</div>
                <RouterView></RouterView>
            </el-main>
        </el-container>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { ref,onMounted } from 'vue';

//
const lightShow=ref([
    {
        name:"weather",
        now:'tab'
    },
    {
        name:"air",
        now:'tab'
    }
])

//
function updateTabState(activeName) {
  // 遍历外部数组 tabs
  for (let i = 0; i < lightShow.value.length; i++) {
    const tab = lightShow.value[i];
    // 如果当前项的 name 匹配传入的 activeName
    if (tab.name === activeName) {
      // 将该项的 now 设置为 'tab2'
      tab.now = 'tab2';
    } else {
      // 不匹配的项，now 设置为 'tab'
      tab.now = 'tab';
    }
  }
}

//
onMounted(()=>{
    updateTabState('weather')
})

</script>

<style  scoped>
.common-layout{
    margin-top: 10px;
}
.common-layout .header{
    background-color: rgb(10,91,172);
    border-radius: 8px;
    height: 63px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
}
.common-layout .tabs{
    display: flex;
    align-items: center;
    width: 550px;
    height: 100%;
    padding: 0 10px;
}
.common-layout .tabs .tab{
    color:  rgb(99, 158, 216);
    font-size: 22px;
    margin-right: 45px;
    text-decoration: none;
}
.common-layout .tabs .tab2{
    color: #fff;
    font-size: 26px;
    margin-right: 45px;
    text-decoration: none;
}
.common-layout .tabs .title{
    display: flex;
    align-items: center;
    color: #fff;
    margin-right: 60px;
}
.common-layout .tabs .title img{
    width: 30px;
    height: 30px;
    margin-right: 8px;
    border-radius: 8px;
}
.common-layout .tabs .tab:hover{
    cursor: pointer;
    color: #fff;
}
.common-layout .main{
    padding: 20px 100px;
}
</style>