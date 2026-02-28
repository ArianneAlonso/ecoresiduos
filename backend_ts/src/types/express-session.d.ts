import { Request } from 'express';
import { Session, SessionData } from 'express-session';
import { JwtPayload } from './JwtPayload'; // Import your JwtPayload type

// Define the shape of your session data
interface UserSessionPayload extends JwtPayload {
    // You can add more session-specific fields here if needed
}

// 1. Augment the SessionData provided by express-session
// This ensures that when we use req.session, TypeScript knows about req.session.user
declare module 'express-session' {
    interface SessionData {
        user?: UserSessionPayload; // This makes req.session.user available
    }
}

// 2. Augment the Express Request object
declare module 'express' {
    // The Request interface is already extended by express-session internally,
    // but we use this module augmentation to define our custom 'user' property.
    interface Request {
        // The 'user' property holds the authenticated payload from either session or JWT
        user?: UserSessionPayload;
        
        // We explicitly define the session properties to ensure compatibility 
        // with the default types provided by express-session
        session: Session & SessionData;
    }
}