<template>
  <section class="flex items-center flex-col">
    <div class="w-96 max-h-[33rem] overflow-auto">
      <ul class="flex flex-col gap-10">
        <li
          v-for="msg in chatMessages"
          class="bg-[#1a1a1a] w-full rounded-md relative py-5 text-left px-10 box-border"
        >
          <h3 class="text-sm">{{ msg.userId }}</h3>
          <h3 class="mt-3">{{ msg.message }}</h3>
        </li>
      </ul>
    </div>
    <span class="absolute bottom-20 w-96 h-10 flex gap-7 items-center">
      <input
        type="text"
        v-model="userInput"
        class="h-full rounded-md px-4 font-light text-sm"
      />
      <MainButton @click="sendMessage" class="mt-0">Send Message</MainButton>
    </span>
  </section>
</template>
<script lang="ts" setup>
import MainButton from "../components/Buttons/MainButton.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
// import axios from "axios";
import { io, Socket } from "socket.io-client";
import generateRandomString from "../utils/randomStringGenerator";

type ChatMessage = {
  message: string;
  userId: string;
};
const route = useRoute();
const router = useRouter();
let socket: Socket;
let userInput = ref<string>("");
let userId = ref<string>("");
let chatMessages = ref<ChatMessage[]>([]);
function sendMessage() {
  let message: ChatMessage = {
    message: userInput.value,
    userId: userId.value,
  };

  socket.emit(`sendMessage`, {
    roomId: route.params.id,
    message,
  });

  userInput.value = "";
}

function initializeSocketConnection(roomId: string) {
  socket = io("http://localhost:8080");
  socket.emit("joinRoom", {
    roomId,
    userId: userId.value,
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
    userId.value = `User-${generateRandomString(5)}`;
    initializeSocketConnection(roomId);
  } else {
    alert("No room id");
    router.push("/");
  }
});
</script>
