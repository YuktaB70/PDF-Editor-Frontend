import React, { useEffect, useRef, useState } from "react";
import "./EditLayout.css";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { Rnd } from "react-rnd";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function EditPdfPage({ FileId }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [text, setText] = useState([])
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  //UseEffect allows function to be called immediately
  useEffect(() => {
    if (!FileId) return;
    const loadPdf = async () => {
      const doc = await fetchPDF(FileId);
      setPdfDoc(doc);
    }
    loadPdf();
  }, [FileId]);

  useEffect(() => {
    if (!pdfDoc) return;
    renderPage(pdfDoc, containerRef, canvasRef);
  },[pdfDoc, containerRef]);

  const handleAddText = () => {
    const newBox = {
      id: Date.now(),
      x: 50, 
      y: 50, 
      text: "Add Text..."
    };
    setText((prev)=> [...prev, newBox]);
  };

  const handleDeleteBox = (id) => {
    setText((prev) => prev.filter((b) => b.id !== id));
  };
 



  
  return (
    <div className="editor-container">
      <div className="editor-page-scroll-container">
      </div>  

      <div className="editor-tool-view-container">
        <div className="editor-toolbar">
          <button onClick={handleAddText}>Add Text</button>
          <button>Highlight</button>
          <button>Draw</button>
          <button >Download</button>
        </div>
      

        <div className="editor-main">
          <div className="pdf-viewer" >
            {pdfDoc ? (
              <div className="pdf-wrapper" ref={containerRef}>
                <canvas ref={canvasRef}> </canvas>
               {text.map((box) => (
                  <AddTextBox key={box.id} box={box} onDelete={handleDeleteBox} />
               ))}


              </div>
              ):(<p>Loading pdf</p>
            )}      
          </div>

      </div>

      </div>
    </div>
  );
}



async function fetchPDF(FileId) {

    try {
      const response = await fetch(`http://localhost:8090/pdf/${FileId}`);
      if (!response.ok) throw new Error("Failed to fetch PDF");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const pdf = await (pdfjsLib.getDocument(url)).promise;
        return pdf;

      }
      catch(error) {
        console.error(error);
      }
}

async function renderPage (pdfDoc,containerRef, canvasRef) {
       const page = await pdfDoc.getPage(1);
        const containerX = containerRef.current.clientWidth;
        const containerY = containerRef.current.clientHeight;
        const PRINT_RESOLUTION = 250;
        const PRINT_UNITS = PRINT_RESOLUTION / 72.0;

        const unscaledViewport = page.getViewport({scale: 1});
        const scaleX = containerX / unscaledViewport.width;
        const scaleY = containerY / unscaledViewport.height;
        const scale = Math.min(scaleX, scaleY);

        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * PRINT_UNITS);
        canvas.height = Math.floor(viewport.height * PRINT_UNITS);
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';

        await page.render({
          canvasContext: context,
          viewport: viewport,
          transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
        }).promise;
}

function AddTextBox({ box, onDelete }) {
  //Tracks whether user is editing or not
  const [isEditing, setIsEditing] = useState(false);
  //stores content of textbox
  const [content, setContent] = useState(box.text);
  const [isFocused, setIsFocused] = useState(false);   // track if box is selected

  //a ref for div 
  const divRef = useRef(null);

// --------EVENT HANDLERS---------------

//If user double clicks textbox, we want to enter "edit mode"
  const handleDoubleClicked = (e) => {
    e.stopPropagation(); //Stops event from impacting parent components/elements
    setIsEditing(true); 
    setTimeout(() => { //Wait for a small amount of time and then focus on div
      // Focus the div when editing starts
      divRef.current?.focus();
    }, 0);

  }
  const handleSingleClicked = () => {
    //checks if user is currently interacting with text(like highlighting)
  if (window.getSelection().toString().length === 0) {
      setIsEditing(false);
      setIsFocused(true);
    }  }

  //Called when div loses focus (such as if user clicks outside the textbox)
  const handleBlur = () => {
    const newText = divRef.current?.textContent || "";
    setContent(newText);
    setIsFocused(false);
    setIsEditing(false);
  }

  const handleDelete = (e) => {
    if (!isEditing && (e.key == "Delete")) {
      e.preventDefault();
      if (onDelete) onDelete(box.id);
    }
  }

  return (
    <Rnd
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}  
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onKeyDown={(e) => handleDelete(e)}
      bounds="parent"
      enableResizing={{
        bottomRight: true,
        bottom: true,
        right: true
      }}
      disableDragging={isEditing}
      style={{
        border: "none",        // remove the dashed border
        background: "transparent",
        padding: 0,
        cursor: isEditing ? "text" : "move"
      }}
    >
      <div
        ref={divRef}
        className="TextBox"
        onClick={handleSingleClicked}
        onDoubleClick={(e) => handleDoubleClicked(e)}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
      >
        {content}
      </div>   
    </Rnd>
  );
}



export default EditPdfPage;
