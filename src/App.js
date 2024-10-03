import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import JobDescription from "./JobDescription";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/job-decription" element={<JobDescription />} />
        </Routes>
      </BrowserRouter>
      <></>
    </div>
  );
}

export default App;
