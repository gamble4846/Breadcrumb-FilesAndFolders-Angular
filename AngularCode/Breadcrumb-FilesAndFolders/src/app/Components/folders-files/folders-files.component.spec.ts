import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersFilesComponent } from './folders-files.component';

describe('FoldersFilesComponent', () => {
  let component: FoldersFilesComponent;
  let fixture: ComponentFixture<FoldersFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoldersFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldersFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
