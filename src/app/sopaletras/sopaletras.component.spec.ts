import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopaletrasComponent } from './sopaletras.component';

describe('SopaletrasComponent', () => {
  let component: SopaletrasComponent;
  let fixture: ComponentFixture<SopaletrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopaletrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopaletrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
