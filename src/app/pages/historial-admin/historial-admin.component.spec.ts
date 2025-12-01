import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAdminComponent } from './historial-admin.component';

describe('HistorialAdminComponent', () => {
  let component: HistorialAdminComponent;
  let fixture: ComponentFixture<HistorialAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
