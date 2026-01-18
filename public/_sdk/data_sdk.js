// LocalStorage-backed Data SDK shim for billing.source.html with Firebase Sync
// Provides the same surface area the exported app expects.
(function () {
  if (window.dataSdk) return;

  const STORAGE_KEY = "billing_system_data_v1";
  const CLOUD_COLLECTION = "billing_records";

  /** @type {any[]} */
  let data = [];
  /** @type {{ onDataChanged?: (data:any[]) => void } | null} */
  let handler = null;

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const notify = () => {
    try {
      handler?.onDataChanged?.(data);
    } catch (e) {
      console.error("onDataChanged error", e);
    }
  };

  const ensureId = (record) => {
    if (record?.__backendId) return record;
    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      `local-${Date.now()}-${Math.random().toString(36).slice(2, 11)}-${Math.random().toString(36).slice(2, 11)}`;
    return { ...record, __backendId: id };
  };

  const syncToCloud = async (record, method = 'set') => {
    if (!window.firebaseDb || !window.firebaseFirestore) {
      console.warn("⚠️ Cloud sync skipped - Firebase not available. Record saved locally only.");
      return;
    }
    const { doc, setDoc, deleteDoc } = window.firebaseFirestore;
    const db = window.firebaseDb;

    try {
      const docId = record.__backendId;
      if (!docId) return;

      const docRef = doc(db, CLOUD_COLLECTION, docId);
      if (method === 'delete') {
        await deleteDoc(docRef);
        console.log("Deleted from cloud:", docId);
      } else {
        await setDoc(docRef, { ...record, updatedAt: Date.now() });
        console.log("Synced to cloud:", docId);
      }
    } catch (e) {
      console.error("Firebase sync error", e);
    }
  };

  window.dataSdk = {
    async init(h) {
      handler = h || null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        data = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error("Failed to load local data", e);
        data = [];
      }
      notify();

      // Check if Firebase is already loaded or wait for it
      if (window.firebaseDb) {
        console.log("Firebase detected, syncing from cloud...");
        this.syncFromCloud();
      } else {
        console.log("Waiting for Firebase to initialize...");
        window.addEventListener('firebase-ready', () => {
          console.log("Firebase ready event received, syncing from cloud...");
          this.syncFromCloud();
        });

        // Timeout warning if Firebase doesn't load within 5 seconds
        setTimeout(() => {
          if (!window.firebaseDb) {
            console.warn("⚠️ Firebase not available after 5 seconds. Cloud sync disabled. Data will only be stored locally.");
          }
        }, 5000);
      }

      return { isOk: true };
    },

    async syncFromCloud() {
      if (!window.firebaseDb || !window.firebaseFirestore) return;
      const { collection, getDocs } = window.firebaseFirestore;
      const db = window.firebaseDb;

      try {
        console.log("Starting cloud sync...");
        const querySnapshot = await getDocs(collection(db, CLOUD_COLLECTION));
        const cloudData = [];
        querySnapshot.forEach((doc) => {
          cloudData.push(doc.data());
        });

        if (cloudData.length > 0) {
          // Merge logic: For now, cloud is source of truth if it exists
          // In a production app, we would perform complex merging based on updatedAt
          data = cloudData;
          persist();
          notify();
          console.log("Synced successfully from cloud:", cloudData.length, "records");
        } else if (data.length > 0) {
          // Cloud is empty but we have local data, back it up to cloud
          console.log("Cloud is empty, backing up local data...");
          for (const record of data) {
            await syncToCloud(record);
          }
        }
      } catch (e) {
        console.error("Cloud sync failed", e);
      }
    },

    async create(record) {
      try {
        const withId = ensureId(record);
        data = [...data, withId];
        persist();
        notify();

        // Async cloud sync
        syncToCloud(withId);

        return { isOk: true, value: withId };
      } catch (error) {
        return { isOk: false, error };
      }
    },

    async update(updatedRecord) {
      try {
        const id = updatedRecord?.__backendId;
        if (!id) return { isOk: false, error: "Missing __backendId" };
        const idx = data.findIndex((d) => d.__backendId === id);
        if (idx === -1) return { isOk: false, error: "Record not found" };

        const newRecord = { ...data[idx], ...updatedRecord };
        data[idx] = newRecord;
        persist();
        notify();

        // Async cloud sync
        syncToCloud(newRecord);

        return { isOk: true, value: data[idx] };
      } catch (error) {
        return { isOk: false, error };
      }
    },

    async delete(record) {
      try {
        const id = record?.__backendId;
        if (!id) return { isOk: false, error: "Missing __backendId" };
        data = data.filter((d) => d.__backendId !== id);
        persist();
        notify();

        // Async cloud sync
        syncToCloud(record, 'delete');

        return { isOk: true };
      } catch (error) {
        return { isOk: false, error };
      }
    },
  };
})();
