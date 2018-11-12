import { Injectable } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor(
      private modalService: NgbModal
  ) {}

    openLargeModal(content) {
        this.modalService.open(content, {
            size: 'lg',
            centered: true
        });
    }

    openWarningModal(content) {
        this.modalService.open(content, {
            centered: true
        });
    }

    dismissAllModals() {
        this.modalService.dismissAll();
    }
}
