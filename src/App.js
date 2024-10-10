import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import JobDescription from "./JobDescription";
import SkillSearch from "./SkillSearch";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/job-decription" element={<JobDescription />} />
          <Route path="/skill-search" element={<SkillSearch />} />
        </Routes>
      </BrowserRouter>
      <></>
    </div>
  );
}

export default App;
