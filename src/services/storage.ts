import { documentDirectory, copyAsync, makeDirectoryAsync, getInfoAsync, deleteAsync } from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

const DOC_DIR = `${documentDirectory ?? ''}lifeadmin_attachments/`;

export async function ensureDocDir(): Promise<string> {
  const info = await getInfoAsync(DOC_DIR);
  if (!info.exists) {
    await makeDirectoryAsync(DOC_DIR, { intermediates: true });
  }
  return DOC_DIR;
}

export async function saveAttachment(uri: string, recordId: number, name: string): Promise<string> {
  await ensureDocDir();
  const ext = name.split('.').pop() || 'bin';
  const dest = `${DOC_DIR}record_${recordId}_${Date.now()}.${ext}`;
  await copyAsync({ from: uri, to: dest });
  return dest;
}

export async function pickDocument(): Promise<{ uri: string; name: string } | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['image/*', 'application/pdf'],
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  return { uri: asset.uri, name: asset.name || 'file' };
}

export async function deleteAttachment(path: string): Promise<void> {
  try {
    const info = await getInfoAsync(path);
    if (info.exists) await deleteAsync(path);
  } catch {
    // ignore
  }
}

export function getAttachmentUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}
