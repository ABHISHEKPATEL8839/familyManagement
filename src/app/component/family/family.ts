import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-family-list',
  imports: [CommonModule],
  templateUrl: './family.html',
  standalone: true,
  styleUrl: './family.css',
})
export class FamilyComponent {
  @Input() members: any[] = []; 
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();
}