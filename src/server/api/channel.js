export default defineEventHandler(async (event) => {
  // Extract the id from the query parameters
  const { id, day } = getQuery(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'No channel ID provided',
    });
  }

  try {
    // Use the id in the external API request URL
    const response = await $fetch(`https://www.freesat.co.uk/tv-guide/api/${day}?channel=${id}`);
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
