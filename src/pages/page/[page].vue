<template>
  <main>
    <section class="py-6">
      <div class="container mx-auto px-4">
        <h1 class="text-center text-2xl font-bold mb-4">TV Guide</h1>

        <div class="text-center mb-4">
          <strong>{{ currentPage }}</strong>
          <span class="mx-1">/</span>
          <span>{{ totalPages }}</span>
        </div>

        <!-- Search Field -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search channels..."
          class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:border-transparent mb-6"
        />

        <div v-if="isLoading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        
        <div v-if="paginatedChannels.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="channel in paginatedChannels"
            :key="channel.channelid"
            class="border p-4 rounded"
          >
            <h2 class="text-xl font-semibold">{{ channel.channelname }}</h2>
          </div>
        </div>
        
        <div v-if="!paginatedChannels.length && !isLoading">No channels found.</div>

        <!-- Pagination Component -->
        <pagination
          :totalPages="totalPages"
          :currentPage="currentPage"
          :handlePageChange="handlePageChange"
        />
      </div>
    </section>
  </main>
</template>


<script setup>
import { useChannelsStore } from '~/store/channels';
import { storeToRefs } from 'pinia';
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pagination from '~/components/Pagination.vue'; // Import Pagination component

const channelsStore = useChannelsStore();
const { channels, isLoading, error } = storeToRefs(channelsStore);
const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.params.page) || 1);
const postsPerPage = ref(20);
const searchQuery = ref('');

// Dynamically compute pagination indices
const indexOfLastPost = computed(() => currentPage.value * postsPerPage.value);
const indexOfFirstPost = computed(() => indexOfLastPost.value - postsPerPage.value);
const totalPages = computed(() => Math.ceil(filteredChannels.value.length / postsPerPage.value));

// Filtered channels based on search query
const filteredChannels = computed(() => {
  if (!searchQuery.value) return channels.value;
  return channels.value.filter((channel) =>
    channel.channelname.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Get current channels based on pagination after filtering
const paginatedChannels = computed(() =>
  filteredChannels.value.slice(indexOfFirstPost.value, indexOfLastPost.value)
);

// Handle page change and update route
const handlePageChange = (page) => {
  currentPage.value = page;
  router.push({ path: `/page/${page}` });
};

onMounted(async () => {
  await channelsStore.fetchChannels(); // Fetch channels once when the component is mounted
});
</script>
