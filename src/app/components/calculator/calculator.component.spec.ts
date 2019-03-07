import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { TestModule } from '../../../test-helpers/test.module';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [CalculatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should calculate a null taxable amount for amount bigger than 36257', () => {
    expect(component.calculateNontaxableAmount(50000)).toBe(0);
  });
  it('should calculate a taxable amount of 1564.09 for amount 30 000', () => {
    expect(component.calculateNontaxableAmount(30000)).toBe(1564.09);
  });
  it('should calculate a nontaxable amount of 3937.35 for taxbases equal or smaller than 100 times of life minimum', () => {
    const taxbase = component.lifeMinimum100timesMultiplied;
    expect(component.calculateNontaxableAmount(taxbase)).toBe(component.maximumNonTaxableAmount);
  });
  it('should calculate a 19% tax', () => {
    const taxbase = 22000;
    expect(component.calculateTaxesToPay(taxbase)).toBe(3502.82);
  });
});
