// src/types/express.d.ts
import 'express';

declare module 'express' {
  interface Request {
    userId?: string; // Add any custom properties here
    role?: string;   // Example: you can add more
  }
}
