import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesSettingComponent } from './routes-setting.component';

describe('RoutesSettingComponent', () => {
  let component: RoutesSettingComponent;
  let fixture: ComponentFixture<RoutesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
