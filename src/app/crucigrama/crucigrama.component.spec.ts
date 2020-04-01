import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucigramaComponent } from './crucigrama.component';

describe('CrucigramaComponent', () => {
  let component: CrucigramaComponent;
  let fixture: ComponentFixture<CrucigramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrucigramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrucigramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
