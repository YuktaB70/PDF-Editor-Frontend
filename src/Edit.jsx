import React, { useEffect, useRef, useState } from "react";
import "./EditLayout.css";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function EditPdfPage({ FileId }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);

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

  
  return (
    <div className="editor-container">
      <div className="editor-page-scroll-container">
      </div>  

      <div className="editor-tool-view-container">
        <div className="editor-toolbar">
          <button>Add Text</button>
          <button>Highlight</button>
          <button>Draw</button>
          <button>Download</button>
        </div>
      

        <div className="editor-main">
          <div className="pdf-viewer"  ref={containerRef}>
            {pdfDoc ? (
                <canvas ref={canvasRef}></canvas>
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


export default EditPdfPage;
