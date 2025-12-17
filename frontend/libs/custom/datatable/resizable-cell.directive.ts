import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[ResizableHeader]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class ResizableHeader {
  readonly cellId = input.required<string>({
    alias: 'ResizableHeader',
  });

  readonly width = computed(() => `calc(var(--header-${this.cellId()}-size) * 1px)`);
}

@Directive({
  selector: '[ResizableCell]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class ResizableCell {
  readonly cellId = input.required<string>({
    alias: 'ResizableCell',
  });

  readonly width = computed(() => `calc(var(--col-${this.cellId()}-size) * 1px)`);
}
