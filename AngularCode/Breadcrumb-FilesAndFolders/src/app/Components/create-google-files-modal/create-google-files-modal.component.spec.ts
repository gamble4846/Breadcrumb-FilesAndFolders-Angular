import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoogleFilesModalComponent } from './create-google-files-modal.component';

describe('CreateGoogleFilesModalComponent', () => {
  let component: CreateGoogleFilesModalComponent;
  let fixture: ComponentFixture<CreateGoogleFilesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGoogleFilesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGoogleFilesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
