import './Upload.css'
import React, { useState } from "react";
import EditPdfPage from "./Edit";

function UploadPdf() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0]; 

        if(uploadedFile && uploadedFile.type === "application/pdf") {
            setFile(uploadedFile);
        }
        else {
            alert("Please upload PDF file");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const uploadFile = e.dataTransfer.files[0];

        if(uploadFile && uploadFile.type === "application/pdf") {
            setFile(uploadFile);
        }
        else {
            alert("Please upload PDF file");
        }
    };

return (
    <div>
      {!file ? (
        // Upload Page
        <div className="upload-container">
          <div className="Title">Upload File</div>
          <div
            className="upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p className="upload-text">Drag and Drop your PDF here</p>
            <label className="upload-btn">
              Browse
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <p className="upload-text">Supported: PDF only</p>
          </div>
        </div>
      ) : (
           <div>
              <EditPdfPage />
            </div>
      )};
    </div>
  );

};



export default UploadPdf;