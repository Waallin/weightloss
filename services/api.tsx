import { API_URL } from "@env";

const globalApi = async (
  method: string,
  endpoint: string,
  body: object | FormData | null = null,
  token: string | null = null,
  disableConsoleLog: boolean = false
) => {
  const url = `${API_URL}${endpoint}`;
  const headers = new Headers();

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  if (!(body instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  if (body instanceof FormData) {
    console.log("FormData objekt:", body);
  }

  const options: {
    method: string;
    headers: Headers;
    body?: string | FormData;
  } = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!disableConsoleLog) {
      try {
        const testJson = await response.clone().json();
      } catch (e) {
        console.log("🔗 ~ globalApi ~ error-url:", url);

        console.log(
          "🔗 ~ globalApi ~ error-response:",
          await response.clone().text()
        );
      }
    }

    const data = await response.json();

    if (data.success) {
      if (!disableConsoleLog) {
        console.log("🔗 ~ globalApi ~ 🌟 endpoint:", endpoint);
        console.log("🚀 ~ globalApi ~ 🌟 Success: ", data);
      }
      return data;
    } else {
      console.log("Request URL:", url);
      console.log("Request Headers:", Object.fromEntries(headers.entries()));
      console.log("Response Status:", response.status);
      console.log("Response Data:", data);
      alert(data.message || "API Error, message unknown🚨");
    }

    return data;
  } catch (error: any) {
    if (error.message.includes("JSON Parse error")) {
      const textResponse = await fetch(url, options);
      const rawText = await textResponse.text();
      console.log("❌ ~ globalApi ~ Raw response text:", rawText);
      console.log("❌ ~ globalApi ~ JSON Parse error:", error);
      console.log("🔗 ~ globalApi ~ error-url:", url);
      console.log("📦 ~ globalApi ~ error-body:", body);
      alert("API Error, JSON Parse error🚨");
      return;
      throw error;
    }
    console.log("❌ ~ globalApi ~ error:", error.message);
    console.log("🔗 ~ globalApi ~ error-url:", url);
    console.log("📦 ~ globalApi ~ error-body:", body);
    throw error;
  }
};

export default globalApi;
