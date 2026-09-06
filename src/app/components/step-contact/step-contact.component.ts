import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WizardStateService } from '../../services/wizard-state.service';

@Component({
  selector: 'gtx-step-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-contact.component.html',
  styleUrl: './step-contact.component.scss',
})
export class StepContactComponent {
  protected readonly state = inject(WizardStateService);

  protected get canSubmit(): boolean {
    const c = this.state.contact();
    return c.name.trim().length > 0 && c.phone.trim().length >= 7;
  }

  protected onFieldChange(field: 'name' | 'phone' | 'dateNeeded' | 'notes', value: string): void {
    this.state.updateContact({ [field]: value || (field === 'dateNeeded' ? null : '') });
  }

  protected submit(): void {
    this.state.submitForQuote();
  }
}
