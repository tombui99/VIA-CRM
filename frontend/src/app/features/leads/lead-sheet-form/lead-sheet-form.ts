import { Component, effect, inject, model, output, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { CreateUpdateLeadDto } from '../../../api/generated';

@Component({
  selector: 'lead-sheet',
  imports: [
    BrnSheetImports,
    HlmSheetImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmTextareaImports,
  ],
  providers: [provideIcons({ lucideCross })],
  template: `
    <hlm-sheet #sheetRef side="right">
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          @if (lead()) {
          <h3 hlmSheetTitle>Edit lead</h3>
          <p hlmSheetDescription>
            Make changes to lead information here. Click save when you're done.
          </p>
          } @else {
          <h3 hlmSheetTitle>Add new lead</h3>
          <p hlmSheetDescription>
            Make changes to add a new lead here. Click save when you're done.
          </p>
          }
        </hlm-sheet-header>
        <form [formGroup]="form" (ngSubmit)="submitForm()">
          <div class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label hlmLabel for="first_name" class="text-right">First Name</label>
              <input
                hlmInput
                type="text"
                id="first_name"
                formControlName="first_name"
                class="col-span-3"
              />
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="last_name" class="text-right">Last Name</label>
              <input
                hlmInput
                type="text"
                id="last_name"
                formControlName="last_name"
                class="col-span-3"
              />
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="email" class="text-right">Email</label>
              <input hlmInput type="text" id="email" formControlName="email" class="col-span-3" />
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="phone" class="text-right">Phone</label>
              <input hlmInput type="text" id="phone" formControlName="phone" class="col-span-3" />
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="source_id" class="text-right">Source</label>
              <brn-select
                class="inline-block"
                placeholder="Select an option"
                formControlName="source_id"
              >
                <hlm-select-trigger class="w-56">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-option [value]="1">Website Form</hlm-option>
                  <hlm-option [value]="2">Facebook Ads</hlm-option>
                  <hlm-option [value]="3">Hotline Call</hlm-option>
                </hlm-select-content>
              </brn-select>
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="center_id" class="text-right">Center</label>
              <brn-select
                class="inline-block"
                placeholder="Select an option"
                formControlName="center_id"
              >
                <hlm-select-trigger class="w-56">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-option [value]="1">HCM Center 1</hlm-option>
                  <hlm-option [value]="2">Hanoi Center 1</hlm-option>
                </hlm-select-content>
              </brn-select>
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="region_id" class="text-right">Region</label>
              <brn-select
                class="inline-block"
                placeholder="Select an option"
                formControlName="region_id"
              >
                <hlm-select-trigger class="w-56">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-option [value]="1">Hanoi</hlm-option>
                  <hlm-option [value]="2">Ho Chi Minh</hlm-option>
                </hlm-select-content>
              </brn-select>
            </div>
            <div class="grid gap-3">
              <label hlmLabel for="assigned_user_id" class="text-right">Assigned User</label>
              <brn-select
                class="inline-block"
                placeholder="Select an option"
                formControlName="assigned_user_id"
              >
                <hlm-select-trigger class="w-56">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-option [value]="1">Tom Bui</hlm-option>
                  <hlm-option [value]="2">Linh Nguyen</hlm-option>
                  <hlm-option [value]="3">Minh Tran</hlm-option>
                </hlm-select-content>
              </brn-select>
            </div>
          </div>
          <hlm-sheet-footer>
            <button hlmBtn type="submit">Save Changes</button>
            <button brnSheetClose hlmBtn variant="outline">Close</button>
          </hlm-sheet-footer>
        </form>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class LeadSheetForm {
  readonly fb = inject(FormBuilder);

  public readonly viewchildSheetRef = viewChild(BrnSheet);

  readonly submit = output<CreateUpdateLeadDto>();
  readonly lead = model<CreateUpdateLeadDto | null>();

  readonly form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    source_id: [0, Validators.required],
    center_id: [0, Validators.required],
    region_id: [0, Validators.required],
    assigned_user_id: [0, Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.lead() == null) {
        this.form.reset();
        return;
      }
      this.form.patchValue(this.lead() as CreateUpdateLeadDto);
    });
  }

  submitForm() {
    this.submit.emit(this.form.value);
    this.viewchildSheetRef()?.close({});
  }
}
