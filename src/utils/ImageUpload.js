import ImageKit from 'imagekit-javascript'

const imagekit = new ImageKit({
  publicKey: 'TU_PUBLIC_KEY',   // Pon aquí tu public key
  urlEndpoint: 'https://ik.imagekit.io/CrownlessTune', // Tu url endpoint
  authenticationEndpoint: '' // vacío para subida sin firma (público)
})

export async function uploadImage(file, userId) {
  const folder = `/users/${userId}` // carpetas organizadas por usuario

  try {
    const response = await imagekit.upload({
      file,
      fileName: file.name,
      folder
    })
    return {
      url: response.url,
      path: response.filePath
    }
  } catch (error) {
    throw new Error('Error uploading image: ' + error.message)
  }
}

export async function deleteImage(path) {
  // Para eliminar imágenes con ImageKit necesitas la API privada en backend.
  // Si no tienes backend, no podrás borrar imágenes desde frontend por seguridad.
  // Aquí deberías llamar a tu backend que use la API privada para eliminar imágenes.
  console.warn('deleteImage no implementado: requiere backend seguro con API privada')
}
