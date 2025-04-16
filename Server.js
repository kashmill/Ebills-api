const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Replace with your actual JWT token stored securely
const EBILLS_BASE_URL = "https://ebills.africa/wp-json";
const JWT_TOKEN = "your_jwt_token_here";

app.post("/purchase", async (req, res) => {
  const { type, phone, amount, service_id, request_id } = req.body;
  let endpoint = "";

  if (type === "airtime") {
    endpoint = "/api/v2/airtime";
  } else if (type === "data") {
    endpoint = "/api/v2/data";
  } else if (type === "electricity") {
    endpoint = "/api/v2/electricity";
  } else if (type === "cable") {
    endpoint = "/api/v2/tv";
  } else {
    return res.status(400).json({ error: "Invalid purchase type" });
  }

  try {
    const response = await axios.post(`${EBILLS_BASE_URL}${endpoint}`, {
      request_id,
      phone,
      amount,
      service_id
    }, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
