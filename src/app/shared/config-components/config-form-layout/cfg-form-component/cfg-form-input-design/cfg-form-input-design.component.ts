import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cfg-form-input-design',
  templateUrl: './cfg-form-input-design.component.html',
  styles: [
  ]
})
export class CfgFormInputDesignComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      datePicker: [null]
    });
  }

  submitForm() {
    console.log(this.validateForm.value);
  }

}
