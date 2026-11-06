import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order } from '../types';

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses Google Drive');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Check if user is connected
export const isGoogleConnected = (): boolean => {
  return Boolean(cachedAccessToken);
};

// Find or create "SKTSP FOTOGRAFI 2026" folder in Google Drive
export async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  const folderName = 'SKTSP_FOTOGRAFI_2026';
  const query = encodeURIComponent(
    `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder rasmi rekod dan sandaran tempahan gambar kelas SK Taman Sri Pulai',
    }),
  });

  const newFolder = await createRes.json();
  return newFolder.id;
}

// Generate CSV content from orders
export function generateOrdersCsvContent(orders: Order[]): string {
  const headers = [
    'No Tempahan',
    'Nama Murid',
    'Kelas',
    'Tahun',
    'Nama Penjaga',
    'No Telefon (WhatsApp)',
    'Emel Penjaga',
    'Pakej',
    'Harga (RM)',
    'Status Tempahan',
    'Status Bayaran',
    'Kaedah Bayaran',
    'Tarikh Tempahan',
    'Catatan / Resit',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.studentName.replace(/"/g, '""')}"`,
    `"${o.className}"`,
    `"${o.year}"`,
    `"${o.parentName.replace(/"/g, '""')}"`,
    `"${o.parentPhone}"`,
    `"${o.parentEmail || '-'}"`,
    `"${o.packageNameSnapshot.replace(/"/g, '""')}"`,
    o.totalAmount.toFixed(2),
    `"${o.orderStatus}"`,
    `"${o.paymentStatus}"`,
    `"${o.paymentMethod}"`,
    `"${new Date(o.createdAt).toLocaleString('ms-MY')}"`,
    `"${o.paymentReference || o.paymentProofFileName || '-'}"`,
  ]);

  return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

// Sync all orders to Google Drive as a spreadsheet / CSV file
export async function syncOrdersToGoogleDrive(
  orders: Order[],
  accessToken: string
): Promise<{ success: boolean; fileId?: string; fileName?: string; webViewLink?: string; error?: string }> {
  try {
    const folderId = await getOrCreateAppFolder(accessToken);
    const fileName = 'REKOD_TEMPAHAN_GAMBAR_SKTSP_2026.csv';
    const csvContent = generateOrdersCsvContent(orders);

    // Check if file already exists in the folder
    const query = encodeURIComponent(
      `name = '${fileName}' and '${folderId}' in parents and trashed = false`
    );
    const checkRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const checkData = await checkRes.json();
    const existingFile = checkData.files?.[0];

    if (existingFile) {
      // Update existing file content
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/csv;charset=utf-8',
          },
          body: csvContent,
        }
      );

      if (!updateRes.ok) {
        throw new Error(`Gagal mengemaskini fail di Google Drive (Status: ${updateRes.status})`);
      }

      const updatedData = await updateRes.json();
      return {
        success: true,
        fileId: updatedData.id,
        fileName,
        webViewLink: existingFile.webViewLink,
      };
    } else {
      // Create new file with multipart metadata
      const boundary = '-------314159265358979323846';
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const metadata = {
        name: fileName,
        mimeType: 'text/csv',
        parents: [folderId],
        description: 'Pangkalan data tempahan gambar kelas murid SK Taman Sri Pulai (Autosync)',
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/csv; charset=UTF-8\r\n\r\n' +
        csvContent +
        closeDelim;

      const uploadRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!uploadRes.ok) {
        throw new Error(`Gagal memuat naik fail ke Google Drive (Status: ${uploadRes.status})`);
      }

      const uploadData = await uploadRes.json();
      return {
        success: true,
        fileId: uploadData.id,
        fileName,
        webViewLink: uploadData.webViewLink,
      };
    }
  } catch (err: any) {
    console.error('Error syncing to Google Drive:', err);
    return {
      success: false,
      error: err.message || 'Ralat semasa menyegerakkan ke Google Drive',
    };
  }
}
