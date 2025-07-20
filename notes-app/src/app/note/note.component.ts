// src/app/note/note.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../note.model';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent {
  @Input() note!: Note;
  @Output() onEdit = new EventEmitter<Note>();
  @Output() onDelete = new EventEmitter<number>();

  editNote() {
    this.onEdit.emit(this.note);
  }

  deleteNote() {
    this.onDelete.emit(this.note.id!);
  }
}
