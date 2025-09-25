import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
  RouterProvider,
  Link
} from "react-router-dom";
import EditBtns from "./EditBtns";
import UploadPdf from "./UploadPdf";
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <p>PDF Editor</p>
      </header>
      <Routes>
        <Route path="/" element={<EditBtns />} />
        <Route path="/editPdf" element={<UploadPdf />}/>
      </Routes>
    </div>
  );
}


export default App
