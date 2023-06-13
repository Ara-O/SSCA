<template>
  <h2>hi</h2>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { io } from "socket.io-client";

const route = useRoute();
onMounted(() => {
  console.log(route.params.id);
  if (route.params.id) {
    const socket = io("http://localhost:8080");
    console.log(socket);
    socket.emit("test");
  }
});
</script>
