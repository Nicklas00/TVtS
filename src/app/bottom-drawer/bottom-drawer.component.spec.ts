import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomDrawerComponent } from './bottom-drawer.component';

describe('BottomDrawerComponent', () => {
  let component: BottomDrawerComponent;
  let fixture: ComponentFixture<BottomDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
