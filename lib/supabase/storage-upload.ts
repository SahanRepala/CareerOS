/**
 * Uploads a file directly to a Supabase Storage bucket's REST endpoint using
 * `XMLHttpRequest` instead of the `supabase-js` storage client.
 *
 * The `supabase-js` storage client uploads via `fetch`, which has no
 * upload-progress event in browsers. `XMLHttpRequest` does (`upload.onprogress`),
 * so we call the same REST endpoint the client SDK calls
 * (`POST /storage/v1/object/{bucket}/{path}`) ourselves to drive a real
 * progress bar during the upload.
 */

export interface StorageUploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadFileWithProgressParams {
  supabaseUrl: string;
  anonKey: string;
  accessToken: string;
  bucket: string;
  path: string;
  file: File;
  onProgress?: (progress: StorageUploadProgress) => void;
}

/** Uploads (or overwrites, via upsert) a single file, reporting progress as it goes. */
export function uploadFileWithProgress({
  supabaseUrl,
  anonKey,
  accessToken,
  bucket,
  path,
  file,
  onProgress,
}: UploadFileWithProgressParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${supabaseUrl}/storage/v1/object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', anonKey);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'true');

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100),
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(parseStorageError(xhr)));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Couldn't reach the server. Check your connection and try again."));
    };

    xhr.send(file);
  });
}

function parseStorageError(xhr: XMLHttpRequest): string {
  try {
    const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
    return body.message || body.error || 'Upload failed. Please try again.';
  } catch {
    return 'Upload failed. Please try again.';
  }
}
