import type { AxiosResponse } from 'axios';

export const getFilenameFromContentDisposition = (
  header?: string
): string | null => {
  if (!header) return null;

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim());
  }

  const quotedMatch = /filename="([^"]+)"/i.exec(header);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = /filename=([^;]+)/i.exec(header);
  return plainMatch?.[1]?.trim() ?? null;
};

export const triggerBlobDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const savePdfResponseAsDownload = (
  response: AxiosResponse<Blob>,
  fallbackFilename = 'employment-contract.pdf'
): void => {
  const disposition = response.headers['content-disposition'] as
    | string
    | undefined;
  const filename =
    getFilenameFromContentDisposition(disposition) ?? fallbackFilename;
  triggerBlobDownload(response.data, filename);
};
