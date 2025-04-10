// src/models/User.ts
export interface User {
    id?: number; // Optional for creation
    username: string;
    password: string; // Consider handling this securely
    email: string;
    registrationDate: string; // Use string to represent LocalDate in ISO format
}