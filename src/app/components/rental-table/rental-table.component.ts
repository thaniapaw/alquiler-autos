import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesAutoService } from '../../services/services-auto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rental-form',
  templateUrl: './rental-table.component.html',
  styles: [],
})
export class RentalTableComponent implements OnInit {
  closeResult = '';
  datosForm: any = FormGroup;
  constructor(
    private modalService: NgbModal,
    private servicesAutoService: ServicesAutoService,
    public fb: FormBuilder
  ) {}
  collection: any = { data: [] };

  ngOnInit(): void {
    //obtener los datos de la base de datos de la coleccion informacionReserva
    this.servicesAutoService.getDatos().subscribe((resp: any) => {
      this.collection.data = resp.map((e: any) => {
        return {
          nombre: e.payload.doc.data().nombre,
          apellido: e.payload.doc.data().apellido,
          oficinaEntrega: e.payload.doc.data().oficinaEntrega,
          recogida: e.payload.doc.data().recogida,
          devolucion: e.payload.doc.data().devolucion,
          // idFirebase: e.payload.doc.id,
        };
      });
    }),
      (error: any) => {
        console.error(error);
      };
  }

  guardarInformacionReserva(): void {
    // llamando al metodo crear de los servicios
    this.servicesAutoService
      .createReserva(this.datosForm.value)
      .then((resp) => {
        //resetear cada vez que se guarda un estudiante
        this.datosForm.reset();
        //para que se cierre la ventana
        this.modalService.dismissAll();
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
