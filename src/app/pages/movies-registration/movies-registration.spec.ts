import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesRegistration } from './movies-registration';

describe('MoviesRegistration', () => {
  let component: MoviesRegistration;
  let fixture: ComponentFixture<MoviesRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
