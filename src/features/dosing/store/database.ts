// Type definitions
export interface Dose {
  id: number;
  timestamp: Date;
  amount: number; // Amount in mg
}

export interface DoseRecord extends Omit<Dose, 'timestamp'> {
  timestamp: number; // Store as timestamp number in IndexedDB
}

// Database configuration
const DB_NAME = 'TylenolTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'doses';

export class DosesDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create the doses object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          
          // Create an index on timestamp for efficient querying
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async addDose(amount: number, timestamp: Date = new Date()): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const doseRecord: Omit<DoseRecord, 'id'> = {
        amount,
        timestamp: timestamp.getTime(),
      };
      
      const request = store.add(doseRecord);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add dose'));
    });
  }

  async removeDose(id: number): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove dose'));
    });
  }

  async getAllDoses(): Promise<Dose[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const records: DoseRecord[] = request.result;
        const doses: Dose[] = records.map(record => ({
          ...record,
          timestamp: new Date(record.timestamp),
        }));
        
        // Sort by timestamp (newest first)
        doses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        resolve(doses);
      };
      
      request.onerror = () => reject(new Error('Failed to retrieve doses'));
    });
  }

  async getDosesByDateRange(startDate: Date, endDate: Date): Promise<Dose[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      const range = IDBKeyRange.bound(startDate.getTime(), endDate.getTime());
      const request = index.getAll(range);
      
      request.onsuccess = () => {
        const records: DoseRecord[] = request.result;
        const doses: Dose[] = records.map(record => ({
          ...record,
          timestamp: new Date(record.timestamp),
        }));
        
        // Sort by timestamp (newest first)
        doses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        resolve(doses);
      };
      
      request.onerror = () => reject(new Error('Failed to retrieve doses by date range'));
    });
  }
}

// Database instance
export const dosesDB = new DosesDB();
