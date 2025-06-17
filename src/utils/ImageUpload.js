import ImageKit from 'imagekit-javascript'

const imagekit = new ImageKit({
  publicKey: 'TU_PUBLIC_KEY',  
  urlEndpoint: 'https://ik.imagekit.io/CrownlessTune', 
  authenticationEndpoint: '' 
})

export async function uploadImage(file, userId) {
  const folder = `/users/${userId}` 

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
  console.warn('deleteImage no implementado: requiere backend seguro con API privada')
}
