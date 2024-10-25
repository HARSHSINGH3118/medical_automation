const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Seasonal disease data (including post-monsoon)
const seasonalDiseases = {
  summer: [
    {
      disease: "Heat Stroke",
      description: "Caused by prolonged exposure to high temperatures.",
    },
    {
      disease: "Dehydration",
      description: "Loss of body fluids due to excessive heat.",
    },
    {
      disease: "Typhoid",
      description:
        "Bacterial infection spread through contaminated food and water.",
    },
    {
      disease: "Gastroenteritis",
      description:
        "Inflammation of the stomach and intestines, often due to contaminated food.",
    },
    {
      disease: "Sunburn",
      description: "Skin damage from overexposure to UV radiation.",
    },
  ],
  monsoon: [
    { disease: "Malaria", description: "Mosquito-borne infectious disease." },
    {
      disease: "Dengue",
      description: "Viral infection transmitted by Aedes mosquitoes.",
    },
    {
      disease: "Cholera",
      description:
        "Infection of the small intestine caused by contaminated water.",
    },
    {
      disease: "Leptospirosis",
      description:
        "Bacterial disease spread by water contaminated with animal urine.",
    },
  ],
  post_monsoon: [
    {
      disease: "Leptospirosis",
      description:
        "Bacterial disease spread by water contaminated with animal urine.",
    },
    {
      disease: "Dengue",
      description: "Viral infection transmitted by Aedes mosquitoes.",
    },
    {
      disease: "Viral Fever",
      description: "Common viral infections after the monsoon season.",
    },
    {
      disease: "Chikungunya",
      description:
        "Viral disease transmitted by Aedes mosquitoes, causing fever and joint pain.",
    },
    {
      disease: "Hepatitis A",
      description:
        "Liver infection caused by consuming contaminated food and water.",
    },
  ],
  winter: [
    {
      disease: "Cold & Flu",
      description: "Viral infections more common in winter.",
    },
    {
      disease: "Asthma",
      description: "Respiratory condition worsened by cold weather.",
    },
    {
      disease: "Pneumonia",
      description: "Lung infection common during cold seasons.",
    },
    {
      disease: "Bronchitis",
      description:
        "Inflammation of the bronchial tubes, often triggered by cold air.",
    },
    {
      disease: "Hypothermia",
      description:
        "Dangerously low body temperature due to prolonged exposure to cold.",
    },
  ],
};

// Route for the home page
app.get("/", (req, res) => {
  res.send("Welcome to the Andhra Pradesh Seasonal Disease API");
});

// Route to get diseases by season
app.get("/api/diseases/:season", (req, res) => {
  const { season } = req.params;
  // Replace "-" with "_" to handle post-monsoon as post_monsoon
  const diseases = seasonalDiseases[season.toLowerCase().replace("-", "_")];

  if (diseases) {
    res.json(diseases);
  } else {
    res.status(404).json({
      message:
        "Season not found. Please enter summer, monsoon, post-monsoon, or winter.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
