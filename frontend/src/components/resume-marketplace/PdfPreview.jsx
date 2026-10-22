import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function getFailureType(error) {
  if (error?.name === "PasswordException" || error?.name === "InvalidPDFException" || error?.name === "MissingPDFException" || error?.name === "FormatError") return "file";
  if (/worker|fetch|dynamically imported|module script/i.test(`${error?.name || ""} ${error?.message || ""}`)) return "renderer";
  return "file";
}

function getErrorMessage(error) {
  if (error?.name === "PasswordException") return "This PDF is password protected. Choose an unencrypted PDF.";
  if (error?.name === "InvalidPDFException" || error?.name === "MissingPDFException" || error?.name === "FormatError") return "This PDF is damaged or uses an unsupported format. Choose a readable PDF.";
  if (getFailureType(error) === "renderer") return "The PDF preview could not load. Restart the Vite server with --force and reload the page.";
  return "This PDF page could not be rendered. Choose a readable, supported PDF.";
}

export default function PdfPreview({ file, enlarged = false, onPageCount }) {
  const canvasRef = useRef(null);
  const documentRef = useRef(null);
  const loadTaskRef = useRef(null);
  const renderTaskRef = useRef(null);
  const renderSequenceRef = useRef(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentRevision, setDocumentRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let previewUrl = "";
    let loadingTask = null;
    documentRef.current = null;
    setPageCount(0);
    setCurrentPage(1);
    setLoading(true);
    setError("");
    onPageCount?.(0, "");

    const loadDocument = async () => {
      try {
        previewUrl = URL.createObjectURL(file);
        loadingTask = pdfjs.getDocument({ url: previewUrl });
        loadTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;
        if (!active) { await pdf.destroy(); return; }
        documentRef.current = pdf;
        setPageCount(pdf.numPages);
        setCurrentPage(1);
        setDocumentRevision((revision) => revision + 1);
      } catch (loadError) {
        if (!active || loadError?.name === "AbortException") return;
        setLoading(false);
        setError(getErrorMessage(loadError));
        onPageCount?.(0, getFailureType(loadError));
      }
    };

    loadDocument();
    return () => {
      active = false;
      renderSequenceRef.current += 1;
      renderTaskRef.current?.cancel();
      const destroyPromise = loadingTask?.destroy();
      if (previewUrl) Promise.resolve(destroyPromise).catch(() => {}).finally(() => URL.revokeObjectURL(previewUrl));
      renderTaskRef.current = null;
      loadTaskRef.current = null;
      documentRef.current = null;
    };
  }, [file, onPageCount]);

  useEffect(() => {
    let active = true;
    const sequence = ++renderSequenceRef.current;
    const renderPage = async () => {
      const pdf = documentRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;
      setLoading(true);
      setError("");
      try {
        const page = await pdf.getPage(currentPage);
        if (!active || sequence !== renderSequenceRef.current) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const maxWidth = enlarged ? 900 : 520;
        const availableWidth = Math.min(maxWidth, Math.max(220, canvas.parentElement?.clientWidth || maxWidth));
        const scale = Math.min(enlarged ? 1.2 : 1, availableWidth / baseViewport.width);
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext("2d", { alpha: false });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        if (!active || sequence !== renderSequenceRef.current) return;
        setLoading(false);
        renderTaskRef.current = null;
        onPageCount?.(pdf.numPages, "");
      } catch (renderError) {
        if (!active || sequence !== renderSequenceRef.current || renderError?.name === "RenderingCancelledException" || renderError?.name === "AbortException") return;
        setLoading(false);
        renderTaskRef.current = null;
        setError(getErrorMessage(renderError));
        onPageCount?.(0, getFailureType(renderError));
      }
    };

    renderPage();
    return () => {
      active = false;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [currentPage, documentRevision, enlarged, onPageCount]);

  const changePage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= pageCount && !loading) setCurrentPage(nextPage);
  };

  return <div className={`creator-pdf-preview${enlarged ? " enlarged" : ""}`} aria-busy={loading}>
    {error ? <div className="creator-pdf-message" role="alert">{error}</div> : <>
      <canvas ref={canvasRef} aria-label={`PDF page ${currentPage}`} />
      {loading && <p className="creator-pdf-message" role="status">{pageCount ? `Rendering page ${currentPage}…` : "Loading PDF preview…"}</p>}
      {pageCount > 1 && <nav className="creator-pdf-pages" aria-label="PDF page navigation">
        <button className="btn btn-secondary" type="button" aria-label="Previous page" onClick={() => changePage(currentPage - 1)} disabled={loading || currentPage <= 1}><ChevronLeft size={16} /> Previous</button>
        <span aria-live="polite">Page {currentPage} of {pageCount}</span>
        <button className="btn btn-secondary" type="button" aria-label="Next page" onClick={() => changePage(currentPage + 1)} disabled={loading || currentPage >= pageCount}>Next <ChevronRight size={16} /></button>
      </nav>}
    </>}
  </div>;
}
