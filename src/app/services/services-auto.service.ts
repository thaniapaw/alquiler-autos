import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ServicesAutoService {
  constructor(private firestore: AngularFirestore) {}

  //metodo para listar toda informacion de reserva del cliente
  getDatos() {
    return this.firestore.collection('informacionReserva').snapshotChanges();
  }

  //añadir datos a la coleccion informacionReserva
  createReserva(datos: string) {
    return this.firestore.collection('informacionReserva').add(datos);
  }
}
