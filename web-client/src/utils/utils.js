export const getAsync = (url, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return fetch("http://localhost:8080/" + url, { headers });
};

export const fetchAllEndpoints = async (urls, accessToken) => {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  const fetchPromises = urls.map((url) => fetch("http://localhost:8080/" + url, { headers }));
  const responses = await Promise.all(fetchPromises);

  const data = await Promise.all(
    responses.map(async (response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
  );

  return data;
};

export const putAsync = (url, data, token = null, isImage = false) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let body = data;
  if (!isImage) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  return fetch(`http://localhost:8080/${url}`, {
    method: "PUT",
    headers, // Do not set Content-Type for FormData
    body,
  });
};

export const postAsync = (url, data, token = null, isFormData = false) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Check if the request is not FormData, then set Content-Type to 'application/json'
  // and stringify the body.
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
    data = JSON.stringify(data);
  }

  // For FormData, do not set Content-Type. Let the browser set it.
  return fetch(`http://localhost:8080/${url}`, {
    method: "POST",
    headers, // Content-Type is not set for FormData, allowing the browser to handle it
    body: data,
  });
};

export const deleteAsync = (url, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : undefined),
  };

  return fetch(`http://localhost:8080/${url}`, {
    method: "DELETE",
    headers,
  });
};
