<template>
  <button @click="$emit('click')" class="font-medium h-full text-sm">
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
defineEmits(["click"]);
</script>
