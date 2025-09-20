import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesUpdate } from './movies-update';

describe('MoviesUpdate', () => {
  let component: MoviesUpdate;
  let fixture: ComponentFixture<MoviesUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
