<template>
  <main>
    <section class="py-6">
      <div class="container mx-auto px-4 max-w-full lg:max-w-screen-xl">
        <h1 class="text-center text-2xl font-bold mb-4">TV Guide</h1>

        <div class="flex mb-6">
          <input
            v-model="searchQuery"
            @input="changeSearchQuery"
            type="text"
            placeholder="Search channels..."
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:border-transparent"
            ref="searchInput"
          />
          <button
            @click="clearSearch"
            class="ml-2 p-3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>

        <div v-if="paginatedChannels.length" class="text-center mb-4">
          <strong>{{ currentPage }}</strong>
          <span class="mx-1">/</span>
          <span>{{ totalPages }}</span>
        </div>

        <div v-if="isLoading" class="text-center">Loading...</div>
        <div v-if="error" class="text-center">{{ error }}</div>

        <div v-if="paginatedChannels.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          v-if="paginatedChannels.length"
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
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pagination from '~/components/Pagination.vue'; // Import Pagination component

// Setup store and refs
const channelsStore = useChannelsStore();
const { channels, isLoading, error } = storeToRefs(channelsStore);
const route = useRoute();
const router = useRouter();

// Reactive variables
const currentPage = ref(parseInt(route.params.page) || 1);
const postsPerPage = ref(18);
const searchQuery = ref('');

// Computed properties for pagination
const indexOfLastPost = computed(() => currentPage.value * postsPerPage.value);
const indexOfFirstPost = computed(() => indexOfLastPost.value - postsPerPage.value);
const totalPages = computed(() => Math.ceil(filteredChannels.value.length / postsPerPage.value));

// Filtered channels based on search query
const filteredChannels = computed(() => {
  return searchQuery.value
    ? channels.value.filter(channel =>
        channel.channelname.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : channels.value;
});

// Get current channels based on pagination after filtering
const paginatedChannels = computed(() =>
  filteredChannels.value.slice(indexOfFirstPost.value, indexOfLastPost.value)
);

// Handle page change and update URL
const handlePageChange = (page) => {
  currentPage.value = page;
  const query = searchQuery.value ? { search: searchQuery.value } : {};
  const queryString = new URLSearchParams(query).toString();
  
  const newPath = page === 1
    ? queryString ? `/?${queryString}` : '/'
    : queryString ? `/page/${page}?${queryString}` : `/page/${page}`;

  window.history.pushState({}, null, newPath);
};

// Watch for route changes to keep currentPage updated
watch(route, () => {
  currentPage.value = parseInt(route.params.page) || 1;
  searchQuery.value = route.query.search || '';
});

// Handle search query changes
const changeSearchQuery = () => {
  currentPage.value = 1; // Reset to page 1 on search
  const query = searchQuery.value ? { search: searchQuery.value } : {};
  const queryString = new URLSearchParams(query).toString();

  const newPath = queryString ? `/?${queryString}` : '/';
  window.history.pushState({}, null, newPath);
};

// Clear search input and reset pagination
const clearSearch = () => {
  searchQuery.value = ''; // Clear the search query
  currentPage.value = 1; // Reset to page 1
  window.history.pushState({}, null, '/');
};

// Fetch channels on component mount
onMounted(async () => {
  await channelsStore.fetchChannels(); // Fetch channels once when the component is mounted
  searchQuery.value = route.query.search || ''; // Initialize searchQuery from the route
});
</script>
