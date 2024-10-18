export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('https://www.freesat.co.uk/tv-guide/api');
    return response; // Send the response back to the client
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch data from the external API',
    });
  }
});