<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useUserStore } from '@/context/user'

const pointName = ref('')
const descripcion = ref('')
const lat = ref(null)
const lng = ref(null)
const carpeta = ref('')
const isPublic = ref(false)
const selectedFile = ref(null)
const loading = ref(false)
const myPoints = ref([])
const publicAndFriendsPoints = ref([])

const userStore = useUserStore()
const currentUser = auth.currentUser

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) selectedFile.value = file
}

async function uploadImageToImageKit(file) {
  const url = 'https://upload.imagekit.io/api/v1/files/upload'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('folder', `/puntos_interes/${carpeta.value || 'general'}`)

  const privateKey = 'private_BZuJI8NW1IWBFIJzDAmNtJzz0Vc='
  const authHeader = 'Basic ' + btoa(privateKey + ':')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al subir imagen')
  return data.url
}

async function submitPoint() {
  if (!currentUser) return alert('No estás autenticado')
  loading.value = true

  let imagePath = null
  try {
    if (selectedFile.value) {
      imagePath = await uploadImageToImageKit(selectedFile.value)
    }

    await addDoc(collection(db, 'puntos_interes'), {
      nombre: pointName.value,
      descripcion: descripcion.value,
      coords: [lat.value, lng.value],
      carpeta: carpeta.value,
      isPublic: isPublic.value,
      autorUID: currentUser.uid,
      imagePath,
      timestamp: serverTimestamp(),
    })

    pointName.value = ''
    descripcion.value = ''
    lat.value = null
    lng.value = null
    carpeta.value = ''
    isPublic.value = false
    selectedFile.value = null
  } catch (e) {
    alert('Error añadiendo punto: ' + e.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!currentUser) return
  const currentUID = currentUser.uid

  const qMyPoints = query(
    collection(db, 'puntos_interes'),
    where('autorUID', '==', currentUID)
  )
  onSnapshot(qMyPoints, (snap) => {
    myPoints.value = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  })

  const qPublicFriends = collection(db, 'puntos_interes')
  onSnapshot(qPublicFriends, (snap) => {
    publicAndFriendsPoints.value = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((p) => {
        if (p.isPublic) return true
        if (userStore.friends?.includes(p.autorUID)) return true
        return false
      })
  })
})
</script>

<template>
  <div class="container">
    <h1>Puntos de Interés</h1>

    <form @submit.prevent="submitPoint" class="form" enctype="multipart/form-data">
      <input v-model="pointName" placeholder="Nombre del punto" required />
      <textarea v-model="descripcion" placeholder="Descripción"></textarea>

      <input
        type="number"
        v-model.number="lat"
        step="0.000001"
        placeholder="Latitud"
        required
      />

      <input
        type="number"
        v-model.number="lng"
        step="0.000001"
        placeholder="Longitud"
        required
      />

      <input v-model="carpeta" placeholder="Carpeta (ej: Miradores)" required />

      <label>
        <input type="checkbox" v-model="isPublic" />
        Público
      </label>

      <input type="file" accept="image/*" @change="onFileChange" />

      <button type="submit" :disabled="loading">
        {{ loading ? "Subiendo..." : "Añadir punto" }}
      </button>
    </form>

    <section>
      <h2>Mis Puntos</h2>
      <ul>
        <li v-for="p in myPoints" :key="p.id" class="point-item">
          <strong>{{ p.nombre }}</strong> — {{ p.descripcion }} —
          ({{ p.coords[0].toFixed(5) }}, {{ p.coords[1].toFixed(5) }})
          <img
            v-if="p.imagePath"
            :src="p.imagePath"
            alt="Imagen del punto"
            class="point-image"
          />
        </li>
      </ul>
    </section>

    <section>
      <h2>Puntos Públicos y de Amigos</h2>
      <ul>
        <li v-for="p in publicAndFriendsPoints" :key="p.id" class="point-item">
          <strong>{{ p.nombre }}</strong> — {{ p.descripcion }} —
          ({{ p.coords[0].toFixed(5) }}, {{ p.coords[1].toFixed(5) }})
          <img
            v-if="p.imagePath"
            :src="p.imagePath"
            alt="Imagen del punto"
            class="point-image"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="number"],
input[type="text"],
textarea,
input[type="file"] {
  padding: 0.5rem;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

button {
  padding: 0.7rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.point-image {
  max-width: 100px;
  max-height: 80px;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.point-item {
  margin-bottom: 0.75rem;
}
</style>
