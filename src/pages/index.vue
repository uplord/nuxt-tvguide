<template>
  <main>
    <section>
      <h1>TV Guide</h1>
      <div v-if="isLoading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <ul v-if="channels">
        <li v-for="channel in channels" :key="channel.channelid">{{ channel.channelname }}</li>
      </ul>
      -{{ channels }}-
    </section>
  </main>
</template>

<script setup>
import { useChannelsStore } from '~/store/channels';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const channelsStore = useChannelsStore();
const { channels, isLoading, error } = storeToRefs(useChannelsStore());

// Fetch shows when the component is mounted
onMounted(async () => {
  console.log(222)
  channelsStore.fetchChannels(); 
});
</script>