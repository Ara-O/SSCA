<template>
  <main>
    <h3 class="text-2xl font-semibold">Welcome</h3>
    <h4 class="mt-3 text-md">Start a secure chat now</h4>
    <MainButton @click="startSecureChat" class="mt-4">Start</MainButton>
  </main>
</template>
<script setup lang="ts">
import randomStringGenerator from "../utils/randomStringGenerator";
import MainButton from "../components/Buttons/MainButton.vue";
import { useClipboard } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();
const { copy, isSupported } = useClipboard({ source: "bob" });

function startSecureChat() {
  let randomString = randomStringGenerator(50);
  if (isSupported) {
    copy(`http://localhost:5173/chat/${randomString}`);
    router.push(`/chat/${randomString}`);
    alert("The room link has been copied to your clipboard");
  }
  console.log(randomString);
}
</script>
