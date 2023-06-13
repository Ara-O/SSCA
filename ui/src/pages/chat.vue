<template>
  <h2>hi</h2>
  <input type="text" v-model="userInput" />
  <MainButton @click="test">Test</MainButton>
</template>
<script lang="ts" setup>
import MainButton from "../components/Buttons/MainButton.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
// import axios from "axios";
import { io, Socket } from "socket.io-client";

const route = useRoute();
const router = useRouter();
let socket: Socket;
let userInput = ref<string>("hola hola");
let userId = "test";
function test() {
  socket.emit(`sendMessage`, {
    roomId: route.params.id,
    userId,
    message: userInput.value,
  });
}

function initializeSocketConnection(roomId: string) {
  socket = io("http://localhost:8080");
  socket.emit("joinRoom", {
    roomId,
    userId,
  });

  socket.on("confirmation", (data) => {
    console.log("ROOM JOINED", data);
  });

  socket.on("receiveMessage", (message) => {
    console.log("Message received", message);
  });
}

onMounted(() => {
  let roomId = route.params.id as string;
  if (roomId) {
    initializeSocketConnection(roomId);
  } else {
    alert("No room id");
    router.push("/");
  }
});
</script>
