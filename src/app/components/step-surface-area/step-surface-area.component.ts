import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { BufferChoice } from '../../models/wizard-state.model';

type AreaInputMode = 'lxw' | 'direct';

const BUFFER_HINTS: Record<BufferChoice, string> = {
  0: 'Exact area — no extra material added',
  10: 'Recommended for simple rectangular areas',
  20: 'Best for irregular shapes, slopes, or extra overlap',
};

@Component({
  selector: 'gtx-step-surface-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-surface-area.component.html',
  styleUrl: './step-surface-area.component.scss',
})
export class StepSurfaceAreaComponent {
  protected readonly state = inject(WizardStateService);
  protected readonly inputMode = signal<AreaInputMode>('lxw');

  protected readonly bufferOptions: { value: BufferChoice; label: string }[] = [
    { value: 0, label: 'None' },
    { value: 10, label: '+10%' },
    { value: 20, label: '+20%' },
  ];

  protected get canContinue(): boolean {
    return this.state.recommendedAreaM2() > 0;
  }

  protected bufferHint(): string {
    return BUFFER_HINTS[this.state.surfaceArea().buffer];
  }

  protected setInputMode(mode: AreaInputMode): void {
    this.inputMode.set(mode);
    if (mode === 'lxw') {
      this.state.updateSurfaceArea({ directM2: null });
    } else {
      this.state.updateSurfaceArea({ lengthM: null, widthM: null });
    }
  }

  protected onLengthChange(value: string): void {
    this.state.updateSurfaceArea({ lengthM: value ? Number(value) : null });
  }

  protected onWidthChange(value: string): void {
    this.state.updateSurfaceArea({ widthM: value ? Number(value) : null });
  }

  protected onDirectM2Change(value: string): void {
    this.state.updateSurfaceArea({ directM2: value ? Number(value) : null });
  }

  protected onBufferChange(buffer: BufferChoice): void {
    this.state.updateSurfaceArea({ buffer });
  }
}
