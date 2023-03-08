import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayermenuBoxComponent } from './layermenu-box.component';

describe('LayermenuBoxComponent', () => {
  let component: LayermenuBoxComponent;
  let fixture: ComponentFixture<LayermenuBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayermenuBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayermenuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
