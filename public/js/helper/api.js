const headers = { 'Content-Type': 'application/json' };

function createApiError(res, data, url, method = 'GET') {
  return {
    status: res.status,
    message: data?.error?.message || res.statusText || 'Request failed',
    details: data?.error?.details || null,
    url,
    method,
  };
}


export const apiRequest = async (url) => {
  const res = await fetch(url);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw createApiError(res, data, url)
    // throw new Error(data?.error?.message || 'Request failed');
  }

  



  return data;
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