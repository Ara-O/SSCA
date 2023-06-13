<template>
  <button @click="$emit('click')" class="font-medium mt-4 text-sm">
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
defineEmits(["click"]);
</script>
