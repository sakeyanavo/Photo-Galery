import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
  });

  it('renders the application header', () => {
    expect(host.querySelector('app-header')).not.toBeNull();
  });

  it('renders routed content inside the main landmark', () => {
    expect(host.querySelector('main router-outlet')).not.toBeNull();
  });
});
