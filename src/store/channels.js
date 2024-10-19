import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';

export const useChannelsStore = defineStore('channelsStore', () => {

  const state = reactive({
    channels: [],
    channel: [],
    error: null,
    isLoading: true
  });

  const fetchChannels = async () => {
    state.channels = [];
    state.isLoading = true;
    state.error = null;
    try {
      const response = await fetch('/api/channels');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      state.channels = data;
    } catch (err) {
      state.error = err.message;
    } finally {
      state.isLoading = false;
    }
  };

  const fetchChannel = async (id, day = 0) => {
    state.channel = [];
    state.isLoading = true;
    state.error = null;
    try {
      const response = await fetch(`/api/channel?id=${id}&day=${day}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      state.channel = data[0].event;
    } catch (err) {
      state.error = err.message;
    } finally {
      state.isLoading = false;
    }
  };

  return {
    ...toRefs(state),
    fetchChannels,
    fetchChannel,
  };
});