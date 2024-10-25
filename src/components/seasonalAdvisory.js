import React, { useEffect, useState } from "react";
import "../components/seasonalAdvisory.css";

// Helper function to determine the current season based on the month
const determineSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "summer";
  if (month >= 5 && month <= 8) return "monsoon";
  if (month >= 9 && month <= 11) return "post-monsoon";
  return "winter";
};

const SeasonalAdvisory = () => {
  const [season, setSeason] = useState(determineSeason()); // Default to current season
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);

  // Fetch diseases based on selected season
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/diseases/${season}`
        );
        if (!response.ok) throw new Error("Failed to fetch disease data");

        const data = await response.json();
        setDiseases(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDiseases();
  }, [season]);

  // Handle season change from dropdown
  const handleSeasonChange = (e) => {
    setSeason(e.target.value); // Update the selected season
  };

  return (
    <div className="seasonal-advisory">
      <h2>
        {season.charAt(0).toUpperCase() + season.slice(1)} Seasonal Disease
        Advisory
      </h2>

      {/* Dropdown to select season */}
      <label htmlFor="season">Select Season: </label>
      <select id="season" value={season} onChange={handleSeasonChange}>
        <option value="summer">Summer</option>
        <option value="monsoon">Monsoon</option>
        <option value="post-monsoon">Post-Monsoon</option>
        <option value="winter">Winter</option>
      </select>

      {/* Display data or error */}
      {error ? (
        <p>Error: {error}</p>
      ) : diseases.length > 0 ? (
        <div>
          {diseases.map((disease, index) => (
            <div key={index} className="disease-card">
              <h4>{disease.disease}</h4>
              <p>{disease.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Display the dynamic precautions based on the selected diseases */}
      <Precautions diseases={diseases} />
    </div>
  );
};

// Precautions Component that dynamically changes based on the diseases
export const Precautions = ({ diseases = [] }) => {
  const getPrecautions = () => {
    const precautions = [];

    if (diseases.some((disease) => disease.disease === "Heat Stroke")) {
      precautions.push(
        "Stay hydrated and avoid direct sun exposure during peak hours."
      );
      precautions.push("Wear light and breathable clothing.");
    }

    if (
      diseases.some(
        (disease) =>
          disease.disease === "Malaria" || disease.disease === "Dengue"
      )
    ) {
      precautions.push(
        "Use mosquito repellents and sleep under mosquito nets."
      );
      precautions.push("Ensure there is no stagnant water around the house.");
    }

    if (diseases.some((disease) => disease.disease === "Cold & Flu")) {
      precautions.push("Wash your hands regularly.");
      precautions.push("Avoid close contact with people who are sick.");
      precautions.push("Keep yourself warm.");
    }

    if (diseases.some((disease) => disease.disease === "Leptospirosis")) {
      precautions.push("Avoid walking in floodwaters.");
      precautions.push("Wear protective gear if you must enter flooded areas.");
    }

    if (precautions.length === 0) {
      precautions.push("Maintain general hygiene to avoid diseases.");
      precautions.push(
        "Follow the necessary precautions to prevent infections."
      );
    }

    return precautions;
  };

  const precautions = getPrecautions();

  return (
    <div className="precautions">
      <h2>Precautions</h2>
      <ul>
        {precautions.map((precaution, index) => (
          <li key={index}>{precaution}</li>
        ))}
      </ul>
    </div>
  );
};

export default SeasonalAdvisory;
