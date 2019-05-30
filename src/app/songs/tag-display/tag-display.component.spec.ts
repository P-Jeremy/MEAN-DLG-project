import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagDsiplayComponent } from './tag-display.component';

describe('TagDsiplayComponent', () => {
  let component: TagDsiplayComponent;
  let fixture: ComponentFixture<TagDsiplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagDsiplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDsiplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
