import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

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
  ],
  providers: [provideIcons({ lucideCross })],
  template: `
    <hlm-sheet side="right">
      <button id="edit-profile" hlmSheetTrigger hlmBtn>Add new lead</button>
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>Add new lead</h3>
          <p hlmSheetDescription>
            Make changes to add a new lead here. Click save when you're done.
          </p>
        </hlm-sheet-header>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label hlmLabel for="name" class="text-right">Name</label>
              <input hlmInput type="text" id="name" formControlName="name" class="col-span-3" />
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
              <label hlmLabel for="source" class="text-right">Source</label>
              <brn-select
                class="inline-block"
                placeholder="Select an option"
                formControlName="source"
              >
                <hlm-select-trigger class="w-56">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-option value="1">Website Form</hlm-option>
                  <hlm-option value="2">Facebook Ads</hlm-option>
                  <hlm-option value="3">Social</hlm-option>
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
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
    source: [''],
  });

  submit() {
    console.log(this.form.value);
  }
}
