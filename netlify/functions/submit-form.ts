// File: netlify/functions/submit-form.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

import fetch from "node-fetch"; // Cần cài 'node-fetch'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Lấy dữ liệu đã được mã hóa từ body request
  const body = event.body;
  if (!body) {
    return { statusCode: 400, body: "Missing form data" };
  }

  try {
    // Gửi dữ liệu đến endpoint nội bộ của Netlify Forms
    // URL này sẽ tự động được Netlify xử lý đúng form dựa vào 'form-name' trong body
    const response = await fetch(process.env.URL || "http://localhost:8888", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });

    if (!response.ok) {
      // Nếu Netlify trả về lỗi, chuyển tiếp lỗi đó
      const errorBody = await response.text();
      console.error("Netlify Forms submission error:", errorBody);
      return { statusCode: response.status, body: `Netlify Forms Error: ${errorBody}` };
    }

    // Nếu thành công, trả về 200 OK
    return { statusCode: 200, body: "Form submitted successfully" };

  } catch (error) {
    console.error("Error submitting form to Netlify:", error);
    return { statusCode: 500, body: "Internal Server Error submitting form" };
  }
};

export { handler };