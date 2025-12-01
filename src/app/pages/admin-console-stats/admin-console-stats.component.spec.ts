import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsoleStatsComponent } from './admin-console-stats.component';

describe('AdminConsoleStatsComponent', () => {
  let component: AdminConsoleStatsComponent;
  let fixture: ComponentFixture<AdminConsoleStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConsoleStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConsoleStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
