<template>
  <div class="map-container">
    <div id="map" class="h-[80vh] rounded-md" />
    <input type="file" accept="image/*" ref="imageInput" class="mb-2" />
    <button @click="addNewMarker" class="btn-primary">Añadir punto de interés</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useUserStore } from '@/context/user'
import { uploadImage, deleteImage } from '@/utils/imageUpload'

const map = ref(null)
const markers = ref([])
const imageInput = ref(null)
const userStore = useUserStore()

onMounted(() => {
  map.value = L.map('map').setView([36.5297, -6.2929], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)

  onSnapshot(collection(db, 'puntos_interes'), snapshot => {
    markers.value.forEach(marker => marker.remove())
    markers.value = []
    snapshot.forEach(docSnap => {
      const data = docSnap.data()
      const marker = L.marker([data.coords.lat, data.coords.lng]).addTo(map.value)
      let popupContent = `<b>${data.nombre}</b><br/>${data.descripcion}`
      if (data.imageUrl) {
        popupContent += `<br/><img src="${data.imageUrl}" style="max-width:200px; border-radius: 8px;">`
      }
      marker.bindPopup(popupContent)

      if (data.autorUID === auth.currentUser?.uid) {
        marker.on('click', async () => {
          if (confirm('¿Eliminar este punto?')) {
            await deleteDoc(doc(db, 'puntos_interes', docSnap.id))
            if (data.imagePath) {
              await deleteImage(data.imagePath)
            }
          }
        })
      }

      markers.value.push(marker)
    })
  })
})

const addNewMarker = () => {
  if (!auth.currentUser) {
    alert('Debes estar logueado para añadir un punto de interés.')
    return
  }

  alert('Haz click en el mapa para añadir el punto de interés')

  map.value.once('click', async e => {
    const nombre = prompt('Nombre del lugar:')
    const descripcion = prompt('Descripción:')
    if (!nombre || !descripcion) return

    const file = imageInput.value?.files?.[0]
    let imageUrl = null
    let imagePath = null

    if (file) {
      try {
        const upload = await uploadImage(file, auth.currentUser.uid)
        imageUrl = upload.url
        imagePath = upload.path
      } catch (err) {
        alert('Error al subir la imagen')
        return
      }
    }

    await addDoc(collection(db, 'puntos_interes'), {
      nombre,
      descripcion,
      coords: e.latlng,
      autorUID: auth.currentUser.uid,
      timestamp: Date.now(),
      imageUrl,
      imagePath
    })

    imageInput.value.value = null
  })
}
</script>

<style scoped>
#map {
  width: 100%;
}
.btn-primary {
  margin-top: 1rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
</style>
