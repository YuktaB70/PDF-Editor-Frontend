import React from "react";
import "./EditLayout.css";

function EditPdfPage() {
  return (
    <div className="editor-container">
      <div className="editor-page-scroll-container">
        Hello
      </div>  

      <div className="editor-tool-view-container">
        <div className="editor-toolbar">
          <button>Add Text</button>
          <button>Highlight</button>
          <button>Draw</button>
          <button>Save</button>
        </div>
      

        <div className="editor-main">
          <div className="pdf-viewer">
            <p>PDF will be displayed here</p>
          
        </div>

      </div>

      </div>
    </div>
  );
}

export default EditPdfPage;
