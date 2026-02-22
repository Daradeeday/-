/* ============================================
   Storage Module — LocalStorage Persistence
   ============================================ */

const STORAGE_KEYS = {
  SUBJECTS: 'tgpa_subjects',
  SEMESTERS: 'tgpa_semesters',
  TARGET: 'tgpa_target',
};

/** Save data to localStorage */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

/** Load data from localStorage */
function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Storage load failed:', e);
    return fallback;
  }
}

/** Remove a key from localStorage */
function removeData(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Storage remove failed:', e);
  }
}

export { STORAGE_KEYS, saveData, loadData, removeData };
