import type { UploadFileRecord } from '../types';
import { adminApiRequest } from './client';

export function uploadAdminFile(token: string, file: File): Promise<UploadFileRecord> {
  const formData = new FormData();
  formData.append('file', file);

  return adminApiRequest<UploadFileRecord>('/api/admin/upload', token, {
    method: 'POST',
    body: formData,
  });
}
