import { getFirestore } from 'firebase/firestore';
import { app } from './auth';

export const db = getFirestore(app);
