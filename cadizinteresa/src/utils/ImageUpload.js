import imageCompression from 'browser-image-compression'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/firebase'

export async function compressImage(file) {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 720,
    useWebWorker: true
  }
  return await imageCompression(file, options)
}

export async function uploadImage(file, uid) {
  const compressed = await compressImage(file)
  const fileRef = ref(storage, `interests/${uid}/${Date.now()}-${file.name}`)
  await uploadBytes(fileRef, compressed)
  const url = await getDownloadURL(fileRef)
  return { url, path: fileRef.fullPath }
}

export async function deleteImage(path) {
  const fileRef = ref(storage, path)
  await deleteObject(fileRef)
}
