import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevBarGraphComponent } from './rev-bar-graph.component';

describe('RevBarGraphComponent', () => {
  let component: RevBarGraphComponent;
  let fixture: ComponentFixture<RevBarGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevBarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
