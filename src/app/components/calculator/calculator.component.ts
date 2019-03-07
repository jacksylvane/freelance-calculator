import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  calculatorForm: FormGroup;
  result = 0;
  tax = 19;
  socialTax: number = 4.4 + 18 + 6 + 4.75;
  healthTax = 14;
  taxesToPay = 0;
  socialTaxesToPay = 0;
  healthTaxesToPay = 0;
  maximumNonTaxableAmount = 3937.35;
  lifeMinimum100timesMultiplied = 20507;
  lifeMinimum44timesMultiplied = 9064.094;

  constructor(fb: FormBuilder) {
    this.calculatorForm = fb.group({
      income: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      expenses: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      fixedExpenses: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      socialContributions: [null, Validators.required],
      healthcareContributions: [null, Validators.required],
      monthlyCalculation: null,
      firstYearAsFreelancer: null,
      calculateMaximumMonthlyExpenses: null
    });
  }

  ngOnInit() {
    this.calculatorForm.setValue(
      {
        income: 25000,
        expenses: 0,
        fixedExpenses: 0,
        socialContributions: 0,
        healthcareContributions: 0,
        monthlyCalculation: false,
        firstYearAsFreelancer: false,
        calculateMaximumMonthlyExpenses: false
      }
    );

  }
  calculateResults(): void {
    this.calculateMaximumMonthlyExpenses();
    const value = this.calculatorForm.value;
    const income = parseInt(value.income, 10);
    const expenses = parseInt(value.expenses, 10);
    const fixedExpenses = parseInt(value.fixedExpenses, 10);
    const socialContributions = parseInt(value.socialContributions, 10);
    const healthcareContributions = parseInt(value.healthcareContributions, 10);
    const taxbase = this.calculateTaxbase(income, expenses, socialContributions, healthcareContributions);
    this.socialTaxesToPay = value.firstYearAsFreelancer ? 0 : this.calculateSocialContributions(taxbase);

    this.taxesToPay = this.calculateTaxesToPay(taxbase);

    this.healthTaxesToPay = this.calculateHealthContributions(taxbase);
    this.result = taxbase - this.taxesToPay;
  }

  calculateTaxbase(income: number, expenses: number, socialContributions: number, healthcareContributions: number): number {
    socialContributions = this.calculatorForm.value.firstYearAsFreelancer ? 0 : socialContributions;
    const nontaxableExpenses = expenses + socialContributions + healthcareContributions;
    return income - nontaxableExpenses;
  }

  calculateTaxesToPay(taxbase: number): number {
    const taxes = (taxbase - this.calculateNontaxableAmount(taxbase)) * (this.tax * 0.01);
    return Math.round(taxes * 100) / 100;
  }

  calculateNontaxableAmount(taxbase: number): number {
    let nontaxableAmount;
    if (taxbase <= this.lifeMinimum100timesMultiplied) {
      nontaxableAmount = this.maximumNonTaxableAmount;
    } else {
      const calculatedNonTaxableAmount = this.lifeMinimum44timesMultiplied - (taxbase / 4);
      nontaxableAmount = calculatedNonTaxableAmount < 0 ? 0 : calculatedNonTaxableAmount;
    }
    return Math.round(nontaxableAmount * 100) / 100;
  }

  calculateSocialContributions(taxbase: number): number {
    const calculatedBase = taxbase / 1.4686 / 12;
    return calculatedBase * (this.socialTax * 0.01) * 12;
  }

  calculateHealthContributions(taxbase: number): number {
    const calculatedBase = taxbase / 1.4686 / 12;
    return calculatedBase * (this.healthTax * 0.01) * 12;
  }

  calculateMaximumMonthlyExpenses(): void {
    if (this.calculatorForm.value.calculateMaximumMonthlyExpenses) {
      const income = this.calculatorForm.value.income;
      const maximumAllowedExpenses = income * 0.6 < 20000 ? income * 0.6 : 20000;
      this.calculatorForm.patchValue({ expenses: maximumAllowedExpenses });
    }
  }
}
