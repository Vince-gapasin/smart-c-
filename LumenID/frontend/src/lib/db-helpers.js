/**
 * Database Helper Functions
 * Utility functions for common database operations
 */

import { supabase } from "./supabase-client";

/**
 * Generic query executor with error handling
 */
export async function executeQuery(queryFn) {
  try {
    const { data, error } = await queryFn();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database query failed",
    };
  }
}

/**
 * Insert a single record
 */
export async function insertRecord(table, record) {
  return executeQuery(() => supabase.from(table).insert(record).single());
}

/**
 * Update a record by ID
 */
export async function updateRecord(table, id, updates) {
  return executeQuery(() => supabase.from(table).update(updates).eq("id", id).single());
}

/**
 * Delete a record by ID
 */
export async function deleteRecord(table, id) {
  return executeQuery(() => supabase.from(table).delete().eq("id", id));
}

/**
 * Get a record by ID
 */
export async function getRecordById(table, id) {
  return executeQuery(() => supabase.from(table).select("*").eq("id", id).single());
}

/**
 * Get all records from a table
 */
export async function getAllRecords(table) {
  return executeQuery(() => supabase.from(table).select("*"));
}

/**
 * Query records with filters
 */
export async function queryRecords(table, filters) {
  let query = supabase.from(table).select("*");

  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return executeQuery(() => query);
}