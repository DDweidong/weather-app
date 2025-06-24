<template>
  <i :class="['iconfont', `icon-${name}`]" :style="iconStyle"></i>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 16 },
  color: { type: String, default: 'inherit' }
})

const iconStyle = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color
}))
</script>

<style scoped>
.iconfont {
  display: inline-block;
  font-style: normal;
  line-height: 1;
  vertical-align: middle;
}
</style>