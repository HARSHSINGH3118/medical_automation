import React from "react";
import { getSeasonalAdvisory } from "./seasonalAdvisory"; // Import the function from utility

const Blog = () => {
  const advisory = getSeasonalAdvisory();

  return (
    <div className="blog-section">
      <h3>Seasonal Advisory</h3>
      <p>{advisory ? advisory : "Loading advisory..."}</p>{" "}
      {/* Add fallback in case advisory is not available */}
    </div>
  );
};

export default Blog;
