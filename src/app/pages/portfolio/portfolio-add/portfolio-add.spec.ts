import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAdd } from './portfolio-add';

describe('PortfolioAdd', () => {
  let component: PortfolioAdd;
  let fixture: ComponentFixture<PortfolioAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
