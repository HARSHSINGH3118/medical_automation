// src/components/Blog.js
const Blog = () => {
  const getSeasonalAdvisory = () => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) {
      return "Spring: Beware of pollen allergies and seasonal flu.";
    } else if (currentMonth >= 5 && currentMonth <= 8) {
      return "Summer: Stay hydrated and protect yourself from heat strokes and dehydration.";
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      return "Autumn: Watch out for respiratory infections and allergies.";
    } else {
      return "Winter: Keep warm to avoid colds, flu, and joint pain.";
    }
  };

  return (
    <div className="blog-section">
      <h3>Seasonal Advisory</h3>
      <p>{getSeasonalAdvisory()}</p>
    </div>
  );
};

export default Blog;
