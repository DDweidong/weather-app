<template>
    <RouterView></RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router=useRouter()
//
onMounted(()=>{
    router.push('weather')
})
</script>


<style>
.app{
  height: 100%;
}
</style>
