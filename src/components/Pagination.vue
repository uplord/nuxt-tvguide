<template>
  <div class="flex justify-center items-center my-4 space-x-2">
    <!-- First Page Button -->
    <button
      @click="goToFirstPage"
      :disabled="currentPage === 1"
      :class="buttonClass(currentPage === 1)"
    >
      &laquo;
    </button>

    <!-- Previous Page Button -->
    <button
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
      :class="buttonClass(currentPage === 1)"
    >
      &lsaquo; Prev
    </button>

    <!-- Current Page / Total Pages -->
    <div class="px-4 py-2">
      <strong>{{ currentPage }}</strong>
      <span class="mx-1">/</span>
      <span>{{ totalPages }}</span>
    </div>

    <!-- Next Page Button -->
    <button
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
      :class="buttonClass(currentPage === totalPages)"
    >
      Next &rsaquo;
    </button>

    <!-- Last Page Button -->
    <button
      @click="goToLastPage"
      :disabled="currentPage === totalPages"
      :class="buttonClass(currentPage === totalPages)"
    >
      &raquo;
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Props to pass currentPage, totalPages, and pageChange handler
const props = defineProps({
  totalPages: Number,
  currentPage: Number,
  handlePageChange: Function
});

const route = useRoute();
const router = useRouter();

// Button CSS class generator based on disabled state
const buttonClass = (isDisabled) =>
  `px-3 py-2 bg-gray-200 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`;

// Methods for navigating between pages
const goToFirstPage = () => {
  if (props.currentPage > 1) props.handlePageChange(1);
};

const goToPreviousPage = () => {
  if (props.currentPage > 1) props.handlePageChange(props.currentPage - 1);
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) props.handlePageChange(props.currentPage + 1);
};

const goToLastPage = () => {
  if (props.currentPage < props.totalPages) props.handlePageChange(props.totalPages);
};
</script>
