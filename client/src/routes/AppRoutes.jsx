import { Routes, Route } from "react-router-dom";
import RecommendationsPage from "../modules/recommendations/pages/RecommendationsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/recommendations" element={<RecommendationsPage />} />
    </Routes>
  );
}

export default AppRoutes;