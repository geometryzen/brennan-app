import { Component, Input, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: '',
    templateUrl: './tone-modal.component.html',
    styleUrls: ['./tone-modal.component.scss']
})
export class ToneModalComponent implements OnInit {

    @Input() title = `Information`;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }
}