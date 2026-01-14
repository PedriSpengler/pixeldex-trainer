import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (Class Name) Utility
 * * This function combines 'clsx' and 'tailwind-merge' to allow for dynamic 
 * and conditional class name construction while ensuring Tailwind classes 
 * do not conflict with each other.
 * * @param inputs - An array of class values (strings, objects, or arrays)
 * @returns A single string of merged Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  /**
   * 1. clsx: Handles conditional logic. 
   * Example: clsx('text-red', isActive && 'bg-blue') -> 'text-red bg-blue'
   * * 2. twMerge: Handles Tailwind specific overrides.
   * Example: twMerge('p-4 p-8') -> 'p-8' (Standard CSS would keep both, 
   * but Tailwind needs the last one to win).
   */
  return twMerge(clsx(inputs));
}