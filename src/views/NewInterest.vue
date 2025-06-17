<script setup>
import { ref, onMounted } from 'vue'
import '../css/PuntosDeInteres.css'
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
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

const editingId = ref(null)

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

  try {
    let imagePath = null
    if (selectedFile.value) {
      imagePath = await uploadImageToImageKit(selectedFile.value)
    }

    if (editingId.value) {
      const pointRef = doc(db, 'puntos_interes', editingId.value)
      const updateData = {
        nombre: pointName.value,
        descripcion: descripcion.value,
        coords: [lat.value, lng.value],
        carpeta: carpeta.value,
        isPublic: isPublic.value,
        timestamp: serverTimestamp(),
      }
      if (imagePath) updateData.imagePath = imagePath

      await updateDoc(pointRef, updateData)
    } else {
      await addDoc(collection(db, 'puntos_interes'), {
        nombre: pointName.value,
        descripcion: descripcion.value,
        coords: [lat.value, lng.value],
        carpeta: carpeta.value,
        isPublic: isPublic.value,
        autorUID: currentUser.uid,
        imagePath: imagePath || null,
        timestamp: serverTimestamp(),
      })
    }

    resetForm()
  } catch (e) {
    alert('Error guardando punto: ' + e.message)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  pointName.value = ''
  descripcion.value = ''
  lat.value = null
  lng.value = null
  carpeta.value = ''
  isPublic.value = false
  selectedFile.value = null
  editingId.value = null
}

function editPoint(point) {
  pointName.value = point.nombre
  descripcion.value = point.descripcion
  lat.value = point.coords[0]
  lng.value = point.coords[1]
  carpeta.value = point.carpeta
  isPublic.value = point.isPublic
  selectedFile.value = null
  editingId.value = point.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deletePoint(pointId) {
  if (!confirm('¿Seguro que quieres eliminar este punto?')) return
  try {
    await deleteDoc(doc(db, 'puntos_interes', pointId))
  } catch (e) {
    alert('Error al eliminar: ' + e.message)
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
        {{ loading ? (editingId ? "Guardando..." : "Subiendo...") : (editingId ? "Guardar cambios" : "Añadir punto") }}
      </button>

      <button v-if="editingId" type="button" @click="resetForm">
        Cancelar edición
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
          <div class="actions">
            <button @click="editPoint(p)">Editar</button>
            <button @click="deletePoint(p.id)">Eliminar</button>
          </div>
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
