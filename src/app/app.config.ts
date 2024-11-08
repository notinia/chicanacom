import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

const firebaseConfig = {
  apiKey: "AIzaSyCv_jUDj5o_Ksz7fS0jlWQCRIxSoygvIZw",
  authDomain: "chicanacom-b1750.firebaseapp.com",
  projectId: "chicanacom-b1750",
  storageBucket: "chicanacom-b1750.appspot.com", // Corrige aquí el storageBucket
  messagingSenderId: "351331745828",
  appId: "1:351331745828:web:2e6855ebd486a85ac5d8b1",
  measurementId: "G-85Q19EMNRX"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Inicializa Firebase correctamente
    provideFirestore(() => getFirestore()) // Proporciona Firestore
  ]
};
