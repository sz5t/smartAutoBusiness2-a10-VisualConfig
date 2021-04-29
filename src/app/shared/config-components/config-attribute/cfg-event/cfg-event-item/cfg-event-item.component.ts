import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cfg-event-item',
  templateUrl: './cfg-event-item.component.html',
  styles: [
  ]
})
export class CfgEventItemComponent implements OnInit {

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.test_form();
  }

  validateForm!: FormGroup;

  public test_form() {
    this.validateForm = this.fb.group({
      pageId: [null, [Validators.required]],
      cmptId: [null, [Validators.required]],
      interfaceName: [null, [Validators.required]],
      interfaceExec: [null, [Validators.required]],
      // connection: this.fb.group({
      //   url: [null, [Validators.email, Validators.required]],
      //   expressionList: [[{ "name": "ff" }], [Validators.email, Validators.required]]
      // }),
      parameterContent: this.fb.array([
        this.fb.group({
          parameterName: new FormControl(null, Validators.required),
          parameterType: new FormControl(null, Validators.required),
          parameterValueName: new FormControl(null, Validators.required),
          parameterValue: new FormControl(null, Validators.required)
        })
      ])
    });


  }
  dataSet: any[] = [];

  public test_to_form() {
    console.log('====>', this.validateForm);
  }

  testArryCopy = [
    { option: "第一场" },
    { option: "第二场" }
  ];
  get testArrFormArray() {
    return this.validateForm.controls['parameterContent'] as FormArray;
  }

  creatRow() {
    return this.fb.group({
      parameterName: [null, [Validators.required]],
      parameterType: [null, [Validators.required]],
      parameterValueName: [null, [Validators.required]],
      parameterValue: [null, [Validators.required]],
    });
  }

  add() {
    this.dataSet.push({ "name": 'fddfdfdf' });
    this.dataSet = this.dataSet.filter(d => d.name !== "i");
  }

  //新增组合
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //刪除组合
  delItem(i) {
    this.testArrFormArray.removeAt(i);
  }

}
