import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeCapsComponent } from './equipe-caps.component';

describe('EquipeCapsComponent', () => {
  let component: EquipeCapsComponent;
  let fixture: ComponentFixture<EquipeCapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipeCapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipeCapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
