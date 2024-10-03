import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>layoutPage works!</p>`,
  styleUrl: './layoutPage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPageComponent { }
