import { Component, effect, inject, model, output, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'activity-sheet',
  imports: [
    BrnSheetImports,
    HlmSheetImports,
    HlmButtonImports,
    HlmLabelImports,
    ReactiveFormsModule,
    HlmTextareaImports,
  ],
  providers: [provideIcons({ lucideCross })],
  template: `
    <hlm-sheet #sheetRef side="right">
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          @if (lead()) {
          <h3 hlmSheetTitle>Edit activity</h3>
          <p hlmSheetDescription>
            Make changes to activity information here. Click save when you're done.
          </p>
          } @else {
          <h3 hlmSheetTitle>Add new activity</h3>
          <p hlmSheetDescription>
            Make changes to add a new activity here. Click save when you're done.
          </p>
          }
        </hlm-sheet-header>
        <form [formGroup]="form" (ngSubmit)="submitForm()">
          <div class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label hlmLabel for="outcome" class="text-right">Outcome</label>
              <textarea hlmTextarea class="w-80" id="outcome" formControlName="outcome"></textarea>
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
export class ActivitySheetForm {
  readonly fb = inject(FormBuilder);

  public readonly viewchildSheetRef = viewChild(BrnSheet);

  readonly submit = output<any>();
  readonly lead = model<any | null>();

  readonly form: FormGroup = this.fb.group({
    outcome: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.lead() == null) {
        this.form.reset();
        return;
      }
      this.form.patchValue(this.lead());
    });
  }

  submitForm() {
    this.submit.emit(this.form.value);
    this.viewchildSheetRef()?.close({});
  }
}
