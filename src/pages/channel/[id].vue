<template>
  <main>
    <section class="py-6">
      <div class="container mx-auto px-4 max-w-full lg:max-w-screen-xl">
        <h1 class="text-center text-2xl font-bold mb-4">{{  currentChannel.channelname }}</h1>
        <nuxt-link to="/">Back</nuxt-link>
        <ul v-if="next7Days" class="flex gap-2 mb-4">
          <li v-for="(day, index) in next7Days" :key="index">
            <NuxtLink :to="index ==0 ? `/channel/${id}` : `/channel/${id}?day=${day}`" @click.prevent="updateChannel(day)" :class="{ 'font-bold': day === currentDay }">{{ day }}</NuxtLink>
          </li>
        </ul>
        <div v-if="!isLoading" class="flex flex-col gap-4">
          <div v-for="program in channel" :key="program.evtId">
            <div class="border border-x-0 md:border p-4 md:rounded -mx-4 md:mx-0 flex items-start md:flex-col gap-4">
              <nuxt-img :src="'https://fdp-sv15-image-v1-0.gcprod1.freetime-platform.net/540x360-0/' + program.image" style="height: 76px" loading="lazy" width="135" height="76" />
              <h2 class="text-lg md:text-xl font-semibold">{{ program.name }}</h2>
              <p class="text-xs md:text-base">{{ convertTimestampToTime(program.startTime)}} - {{ convertTimestampToTime(program.startTime + program.duration)}}</p>
              <p class="text-xs md:text-base">{{ program.description }}</p>
            </div>
          </div>
        </div>
        <nuxt-link v-if="!isLoading" to="/">Back</nuxt-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useChannelsStore } from '~/store/channels';
import { storeToRefs } from 'pinia';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const id = ref(parseInt(route.params.id) || 1);
const currentDay = ref(route.query.day || 'Saturday');
const next7Days = ref([])
const currentChannel = ref([]);

const todayIndex = new Date().getDay()

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayMapping = {};
daysOfWeek.forEach((dayName, index) => {
  // Shift the index so that the current day is 0
  dayMapping[dayName] = (index - todayIndex + 7) % 7;
});

// Setup store and refs
const channelsStore = useChannelsStore();
const { channels, channel, isLoading, error } = storeToRefs(channelsStore);

// Fetch channels on component mount
onMounted(async () => {
  await channelsStore.fetchChannels();
  await fetchCurrentChannel(currentDay.value);
  next7Days.value = getNext7Days();
});

const fetchCurrentChannel = async (selectedDay) => {
  const dayNumber = dayMapping[selectedDay];
  console.log(dayNumber)
  await channelsStore.fetchChannel(id.value, dayNumber);
  currentChannel.value = channels.value.find(current => current.channelid === id.value) || {};
};

const updateChannel = async (selectedDay) => {
  currentDay.value = selectedDay; // Update the day value
  await fetchCurrentChannel(selectedDay); // Fetch the updated channel data
};

const convertTimestampToTime = (timestamp) => {
  // Convert the timestamp from seconds to milliseconds
  const date = new Date(timestamp * 1000);

  // Get hours, minutes, and determine AM/PM
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero to minutes if needed

  // Return the formatted time
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const getNext7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);

    const day = nextDay.toLocaleDateString('en-GB', {
      weekday: 'long', // Day name
    });

    days.push(day);
  }

  return days;
};

</script>
