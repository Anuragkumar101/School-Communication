import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp, 
  getDoc, 
  getDocs, 
  DocumentData, 
  QueryConstraint, 
  limit 
} from "firebase/firestore";

// Generic hook for real-time data subscription
export const useCollection = <T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: T[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [...dependencies]);

  return { data, loading, error };
};

// Hook for messages with pagination
export const useMessages = (chatId: string, messagesLimit = 50) => {
  return useCollection<{
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    senderPhotoURL?: string;
    timestamp: Timestamp;
  }>(
    "messages",
    [where("chatId", "==", chatId), orderBy("timestamp", "desc"), limit(messagesLimit)],
    [chatId, messagesLimit]
  );
};

// Hook for tasks/homework
export const useTasks = () => {
  return useCollection<{
    id: string;
    title: string;
    description?: string;
    dueDate: Timestamp;
    completed: boolean;
    createdBy: string;
    createdAt: Timestamp;
  }>(
    "tasks",
    [orderBy("dueDate", "asc")],
    []
  );
};

// Hook for timetable entries
export const useTimetableEntries = (date?: Date) => {
  const constraints: QueryConstraint[] = [orderBy("startTime", "asc")];
  
  if (date) {
    // Create start of day and end of day timestamps
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    constraints.push(
      where("startTime", ">=", Timestamp.fromDate(startOfDay)),
      where("startTime", "<=", Timestamp.fromDate(endOfDay))
    );
  }
  
  return useCollection<{
    id: string;
    title: string;
    description?: string;
    startTime: Timestamp;
    endTime: Timestamp;
    createdBy: string;
  }>(
    "timetableEntries",
    constraints,
    [date?.toDateString()]
  );
};

// CRUD operations for Firestore
export const firestoreServices = {
  // Add a new document
  addDocument: async <T extends DocumentData>(collectionName: string, data: T) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

  // Update a document
  updateDocument: async <T extends Partial<DocumentData>>(
    collectionName: string,
    id: string,
    data: T
  ) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (collectionName: string, id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },

  // Get a single document
  getDocument: async <T extends DocumentData>(collectionName: string, id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }
};
