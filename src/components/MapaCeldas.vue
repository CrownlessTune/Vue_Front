<template>
  <div class="modal-wrapper">
    <div class="map-section">
      <div class="grid-wrapper">
        <div 
          v-for="(cell, index) in gridSize * gridSize" 
          :key="index" 
          class="grid-tile" 
          :class="{ active: selectedCell === index }"
          @click="cellClick(index)"
        >
          <span v-if="selectedCell === index" class="pin">📍</span>
          <span v-for="punto in getPuntosInCell(index)" :key="punto.id" class="pin">📍</span>
        </div>
      </div>

      <img src="../assets/cadiz-map.jpg" alt="Mapa de Cádiz" class="map-photo" />
    </div>

    <div class="form-section">
      <div class="coordinates-info">
        <p><strong>Coordenadas aproximadas:</strong></p>
        <p v-if="selectedCell !== null">
          Lat: {{ lat.toFixed(5) }}<br />
          Lng: {{ lng.toFixed(5) }}
        </p>
        <p v-else class="warning-text">Selecciona una celda en el mapa para continuar</p>

        <form @submit.prevent="submitPoint">
          <div>
            <label>Nombre:</label><br />
            <input v-model="nombre" :disabled="selectedCell === null" required />
          </div>
          <div>
            <label>Descripción:</label><br />
            <textarea v-model="descripcion" :disabled="selectedCell === null" required></textarea>
          </div>
          <div>
            <label>Imagen:</label><br />
            <input type="file" accept="image/*" @change="onFileChange" :disabled="selectedCell === null" required />
          </div>
          <div>
            <label>
              <input type="checkbox" v-model="isPublic" :disabled="selectedCell === null" /> Público
            </label>
          </div>
          <button type="submit" class="btn-save" :disabled="selectedCell === null">Guardar punto de interés</button>
          <button type="button" @click="cancel" class="btn-cancel">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>
