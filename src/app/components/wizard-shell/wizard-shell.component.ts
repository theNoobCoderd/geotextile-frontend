import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { WizardStateService } from '../../services/wizard-state.service';
import { StepSurfaceAreaComponent } from '../step-surface-area/step-surface-area.component';
import { StepProductRollComponent } from '../step-product-roll/step-product-roll.component';
import { StepDeliveryComponent } from '../step-delivery/step-delivery.component';
import { StepContactComponent } from '../step-contact/step-contact.component';
import { QuoteSummaryComponent } from '../quote-summary/quote-summary.component';

/** Labels for the 4 input steps shown in the progress bar. Step 5 (quote) has no bar. */
const STEP_LABELS: Record<number, string> = {
  1: 'Surface area',
  2: 'Product & roll',
  3: 'Delivery',
  4: 'Contact',
};

const TOTAL_INPUT_STEPS = 4;

@Component({
  selector: 'gtx-wizard-shell',
  standalone: true,
  imports: [
    CommonModule,
    StepSurfaceAreaComponent,
    StepProductRollComponent,
    StepDeliveryComponent,
    StepContactComponent,
    QuoteSummaryComponent,
  ],
  templateUrl: './wizard-shell.component.html',
  styleUrl: './wizard-shell.component.scss',
})
export class WizardShellComponent implements OnInit {
  protected readonly state = inject(WizardStateService);
  protected readonly totalInputSteps = TOTAL_INPUT_STEPS;

  protected readonly showProgress = computed(() => this.state.currentStep() <= TOTAL_INPUT_STEPS);
  protected readonly currentStepLabel = computed(() => STEP_LABELS[this.state.currentStep()] ?? '');
  protected readonly progressPercent = computed(
    () => (this.state.currentStep() / TOTAL_INPUT_STEPS) * 100,
  );

  ngOnInit(): void {
    this.state.loadCatalog();
  }
}
