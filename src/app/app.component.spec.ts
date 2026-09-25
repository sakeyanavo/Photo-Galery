import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeInstanceOf(AppComponent);
  });

  it('renders a router outlet', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('router-outlet')).not.toBeNull();
  });
});
