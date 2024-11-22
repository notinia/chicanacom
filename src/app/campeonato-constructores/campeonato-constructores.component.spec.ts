import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampeonatoConstructoresComponent } from './campeonato-constructores.component';

describe('CampeonatoConstructoresComponent', () => {
  let component: CampeonatoConstructoresComponent;
  let fixture: ComponentFixture<CampeonatoConstructoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampeonatoConstructoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampeonatoConstructoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
