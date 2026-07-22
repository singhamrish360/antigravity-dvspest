import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  initialCustomers, 
  initialLeads, 
  initialServices, 
  initialFeedback, 
  initialSystemSettings 
} from './mockData';

// Fetch all documents from a Firestore collection
export const getFirestoreCollection = async (collectionName: string): Promise<any[]> => {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new document to a collection with automatic ID generation
export const addFirestoreDocument = async (collectionName: string, data: any) => {
  const colRef = collection(db, collectionName);
  return addDoc(colRef, { ...data, timestamp: new Date().toISOString() });
};

// Set/Overwrite a document in a collection with a specific ID
export const setFirestoreDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  return setDoc(docRef, data, { merge: true });
};

// Update specific fields of an existing document
export const updateFirestoreDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, data);
};

// Self-healing database seeder to pre-populate empty Firestore collections
export const seedFirestoreIfEmpty = async () => {
  try {
    const colRefs = {
      customers: collection(db, 'customers'),
      leads: collection(db, 'leads'),
      services: collection(db, 'services'),
      feedback: collection(db, 'feedback'),
      settings: collection(db, 'settings')
    };

    // 1. Seed System Settings
    const settingsSnapshot = await getDocs(query(colRefs.settings, limit(1)));
    if (settingsSnapshot.empty) {
      await setFirestoreDocument('settings', 'global', initialSystemSettings);
      console.log('🌱 Firestore System Settings seeded successfully.');
    }

    // 2. Seed/Sync Services
    const servicesSnapshot = await getDocs(colRefs.services);
    if (servicesSnapshot.empty) {
      for (const service of initialServices) {
        await setFirestoreDocument('services', service.id, service);
      }
      console.log('🌱 Firestore Services collection seeded successfully.');
    } else {
      // Sync latest image assets and titles directly to the active Firestore documents
      for (const service of initialServices) {
        await setFirestoreDocument('services', service.id, {
          imageUrl: service.imageUrl,
          title: service.title,
          category: service.category,
          description: service.description
        });
      }
      console.log('🌱 Firestore Services collection synchronized with latest assets.');
    }

    // 3. Seed Customers
    const customersSnapshot = await getDocs(query(colRefs.customers, limit(1)));
    if (customersSnapshot.empty) {
      for (const customer of initialCustomers) {
        await setFirestoreDocument('customers', customer.id, customer);
      }
      console.log('🌱 Firestore Customers collection seeded successfully.');
    }

    // 4. Seed Leads
    const leadsSnapshot = await getDocs(query(colRefs.leads, limit(1)));
    if (leadsSnapshot.empty) {
      for (const lead of initialLeads) {
        await setFirestoreDocument('leads', lead.id, lead);
      }
      console.log('🌱 Firestore Leads collection seeded successfully.');
    }

    // 5. Seed Feedback Reviews
    const feedbackSnapshot = await getDocs(query(colRefs.feedback, limit(1)));
    if (feedbackSnapshot.empty) {
      for (const fb of initialFeedback) {
        await setFirestoreDocument('feedback', fb.id, fb);
      }
      console.log('🌱 Firestore Feedback collection seeded successfully.');
    }

  } catch (error) {
    console.error('⚠️ Error seeding Firestore collections:', error);
  }
};
