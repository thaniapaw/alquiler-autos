import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ServicesAutoService } from '../../services/services-auto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styles: [],
})
export class CarListComponent implements OnInit {
  closeResult = '';
  datosForm: any = FormGroup;
  Autos: Observable<any[]>;
  constructor(
    private db: AngularFirestore,
    private afs: AngularFirestore,
    private modalService: NgbModal,
    private servicesAutoService: ServicesAutoService,
    public fb: FormBuilder
  ) {
    // para colocarlos en el ngFor y que se muestre la lista de autos de la BD
    this.Autos = db.collection('Autos').valueChanges();
  }

  collection: any = { data: [] };
  id: any = '';

  ngOnInit(): void {
    //obteniendo el valor de la coleccion autos
    this.db
      .collection('Autos')
      .valueChanges()
      .subscribe(
        (val) =>
          (this.collection.data = val.map((e: any) => {
            return {
              id: e.payload.doc.data().id,
            };
          }))
      );

    this.datosForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      oficinaEntrega: ['', Validators.required],
      recogida: ['', Validators.required],
      devolucion: ['', Validators.required],
    });
    // obtener los datos de la base de datos
    this.servicesAutoService.getDatos().subscribe((resp: any) => {
      this.collection.data = resp.map((e: any) => {
        return {
          nombre: e.payload.doc.data().nombre,
          apellido: e.payload.doc.data().apellido,
          oficinaEntrega: e.payload.doc.data().oficinaEntrega,
          recogida: e.payload.doc.data().recogida,
          devolucion: e.payload.doc.data().devolucion,
          idFirebase: e.payload.doc.id,
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

  // Metodo para el Modal
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
