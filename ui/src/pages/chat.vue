<template>
  <h2>hi</h2>
  <input type="text" v-model="userInput" />
  <MainButton @click="test">Send Message</MainButton>
  <div>
    <ul>
      <li v-for="msg in chatMessages">{{ msg }}</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import MainButton from "../components/Buttons/MainButton.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
// import axios from "axios";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
  message: string;
  userId: string;
};
const route = useRoute();
const router = useRouter();
let socket: Socket;
let userInput = ref<string>("hola hola");
let userId = "test";
let chatMessages = ref<[]>([]);
function test() {
  let message: ChatMessage = {
    message: userInput.value,
    userId,
  };

  socket.emit(`sendMessage`, {
    roomId: route.params.id,
    message,
  });
}

function initializeSocketConnection(roomId: string) {
  socket = io("http://localhost:8080");
  socket.emit("joinRoom", {
    roomId,
    userId,
  });

  socket.on("roomJoined", (data) => {
    chatMessages.value = data;
  });

  socket.on("userThresholdBreached", () => {
    alert("Room threshold has been reached");
    router.push("/");
  });

  socket.on("newMessage", (message) => {
    console.log("Message received", message);
    chatMessages.value = message;
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
