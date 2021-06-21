import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtCommandResolver } from 'src/app/shared/resolver/smt-command/smt-command.resovel';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-form-select',
  templateUrl: './smt-form-select.component.html',
  styles: [],
})
export class SmtFormSelectComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model: any;

  public selectOptions: any[];
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  ngOnInit(): void {}

  onSearch($event) {}
}
