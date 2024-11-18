import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampeonatoConductoresComponent } from './campeonato-conductores.component';

describe('CampeonatoConductoresComponent', () => {
  let component: CampeonatoConductoresComponent;
  let fixture: ComponentFixture<CampeonatoConductoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampeonatoConductoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampeonatoConductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
