import { Component } from '@angular/core';
import {DatePicker} from "primeng/datepicker";
import {Dialog} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";

@Component({
  selector: 'app-transaction-modal',
  imports: [
      DatePicker,
      Dialog,
      ReactiveFormsModule,
      Select
  ],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.css',
})
export class TransactionModal {

}
