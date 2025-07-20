// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NoteService } from './note.service';
import { NoteComponent } from './note/note.component'; // your child component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  notes: Note[] = [];
  title: string = '';
  content: string = '';
  editingNoteId: number | null = null;

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.notes$.subscribe(notes => this.notes = notes);
    this.noteService.getNotes(); // fetch notes on load
  }

  saveNote() {
    if (!this.title.trim() || !this.content.trim()) return;

    const note: Note = {
      id: this.editingNoteId ?? undefined,
      title: this.title.trim(),
      content: this.content.trim(),
    };

    if (this.editingNoteId) {
      this.noteService.updateNote(note).subscribe(() => this.clearForm());
    } else {
      this.noteService.addNote(note).subscribe(() => this.clearForm());
    }
  }

  editNote(note: Note) {
    this.title = note.title;
    this.content = note.content;
    this.editingNoteId = note.id!;
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe(() => {
      if (this.editingNoteId === id) this.clearForm();
    });
  }

  clearForm() {
    this.title = '';
    this.content = '';
    this.editingNoteId = null;
  }
}
