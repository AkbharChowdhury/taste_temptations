const headers = { 'Content-Type': 'application/json' };

export const apiRequest = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText || 'Request failed',
      url,
      method: 'GET',
    };
  }

  return response.json();
};
export async function fetchRequest(url, values) {
  const body = JSON.stringify({ values });
  const init = {
    method: 'POST',
    headers,
    body,
  };
  try {
    const response = await fetch(url, init);
    return await response.json();

  } catch (error) {
    console.error(`There was an error with this request for the URL ${url}`, error);
  }

};