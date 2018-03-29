import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDimensionalComponent } from './multi-dimensional.component';

describe('MultiDimensionalComponent', () => {
  let component: MultiDimensionalComponent;
  let fixture: ComponentFixture<MultiDimensionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDimensionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDimensionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
