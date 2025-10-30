import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('products.db');
  
  // Bật foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');
  
  return db;
};