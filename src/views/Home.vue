<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

const publicPoints = ref([])
const selectedPoint = ref(null)  
const showModal = ref(false)

onMounted(() => {
  const q = query(collection(db, 'puntos_interes'), where('isPublic', '==', true))
  onSnapshot(q, (snap) => {
    publicPoints.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

function openModal(point) {
  selectedPoint.value = point
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedPoint.value = null
}
</script>

<template>
  <main class="home">
    <header>
      <h1>CadizInteresa</h1>
      <p class="subtitle">
        Descubre y comparte los rincones más especiales y auténticos de Cádiz. <br />
        Una comunidad para amantes de esta ciudad única.
      </p>
    </header>

    <section class="gallery-section">
      <h2>Puntos de Interés Públicos</h2>

      <div v-if="publicPoints.length" class="gallery">
        <article
          v-for="point in publicPoints"
          :key="point.id"
          class="image-card"
          @click="openModal(point)"
          tabindex="0"
          @keyup.enter="openModal(point)"
        >
          <img :src="point.imagePath" :alt="point.nombre" loading="lazy" />
          <h3>{{ point.nombre }}</h3>
          <p>{{ point.descripcion }}</p>
        </article>
      </div>

      <p v-else class="no-points">No hay puntos públicos aún.</p>
    </section>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button class="close-btn" @click="closeModal" aria-label="Cerrar modal">&times;</button>
        <img :src="selectedPoint.imagePath" :alt="selectedPoint.nombre" />
        <h2 id="modalTitle">{{ selectedPoint.nombre }}</h2>
        <p>{{ selectedPoint.descripcion }}</p>
        <p><strong>Coordenadas:</strong> {{ selectedPoint.coords[0].toFixed(5) }}, {{ selectedPoint.coords[1].toFixed(5) }}</p>
        <p><strong>Carpeta:</strong> {{ selectedPoint.carpeta || 'General' }}</p>
        <p><strong>Visibilidad:</strong> {{ selectedPoint.isPublic ? 'Público' : 'Privado' }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  max-width: 960px;
  margin: 4rem auto 3rem;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e1e1e;
  text-align: center;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 0.2rem;
  color: #fcbf49;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.subtitle {
  color: #5e5e5e;
  font-size: 1.25rem;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.gallery-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0077b6;
  font-weight: 600;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.image-card {
  width: 180px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.12);
  overflow: hidden;
  background: #f5f3f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  outline: none;
}

.image-card:hover,
.image-card:focus {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgb(0 0 0 / 0.18);
}

.image-card img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
  border-bottom: 2px solid #fcbf49;
}

.image-card h3 {
  margin: 0.75rem 0 0.25rem 0;
  font-size: 1.1rem;
  color: #023e8a;
}

.image-card p {
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
  color: #333;
  padding: 0 0.5rem;
  min-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-points {
  font-size: 1rem;
  color: #999;
  margin-top: 2rem;
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(30, 30, 30, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

.modal-content {
  background: #f5f3f0;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  padding: 1.5rem 2rem;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.2);
  position: relative;
  text-align: left;
  color: #1e1e1e;
}

.modal-content img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-bottom: 3px solid #fcbf49;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #0077b6;
}

.modal-content p {
  margin: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.4;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #0077b6;
}
</style>
