const DATABASE_NAME = "jobkhojo-creator-files";
const DATABASE_VERSION = 1;
const PDF_STORE = "pdfs";
const sessionFiles = new Map();
let databasePromise;

function openDatabase() {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("Browser file storage (IndexedDB) is unavailable."));
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PDF_STORE)) database.createObjectStore(PDF_STORE, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open browser file storage."));
      request.onblocked = () => reject(new Error("Browser file storage is blocked by another tab. Close the other JobKhojo tab and retry."));
    }).catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

function storageError(error) {
  if (error?.name === "QuotaExceededError") return new Error("Browser storage is full. Remove some site data or choose a smaller PDF (maximum 10 MB).", { cause: error });
  if (error?.name === "SecurityError") return new Error("The browser blocked persistent file storage. Allow site storage and retry.", { cause: error });
  return new Error(error?.message || "The PDF could not be saved to browser storage.", { cause: error });
}

export async function savePdfToBrowserStorage(id, file) {
  if (!id || !(file instanceof Blob) || file.size === 0) throw new Error("Choose a readable PDF before saving.");
  try {
    const database = await openDatabase();
    const transaction = database.transaction(PDF_STORE, "readwrite");
    const completed = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("The PDF could not be written to browser storage."));
      transaction.onabort = () => reject(transaction.error || new Error("Saving the PDF to browser storage was interrupted."));
    });
    transaction.objectStore(PDF_STORE).put({
      id,
      name: file.name || "template.pdf",
      type: file.type || "application/pdf",
      lastModified: file.lastModified || Date.now(),
      blob: file,
    });
    await completed;
    sessionFiles.set(id, file);
    return { id, saved: true };
  } catch (error) {
    throw storageError(error);
  }
}

export async function loadPdfFromBrowserStorage(id) {
  if (!id) return null;
  if (sessionFiles.has(id)) return sessionFiles.get(id);
  try {
    const database = await openDatabase();
    const transaction = database.transaction(PDF_STORE, "readonly");
    const request = transaction.objectStore(PDF_STORE).get(id);
    const value = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Could not read the saved PDF."));
    });
    if (!value) return null;
    if (!(value.blob instanceof Blob) || value.blob.size === 0 || !value.name) {
      throw new Error("The saved PDF data is incomplete or corrupted. Choose the PDF again.");
    }
    const file = new File([value.blob], value.name, { type: value.type || "application/pdf", lastModified: value.lastModified || Date.now() });
    sessionFiles.set(id, file);
    return file;
  } catch (error) {
    throw storageError(error);
  }
}

// Kept as synchronous cache access for places that can use a PDF already loaded in this tab.
export function getPdfFromSession(id) { return sessionFiles.get(id) || null; }
