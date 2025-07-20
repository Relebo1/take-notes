// src/app/app.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';  // Adjust path if needed
import { NoteService } from './note.service';
import { Note } from './note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  notes: Note[] = [];
  title = '';
  content = '';
  editingNoteId: number | null = null;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    // Subscribe to the notes observable
    this.noteService.notes$.subscribe(notes => {
      this.notes = notes;
    });
  }

  saveNote(): void {
    if (!this.title.trim() || !this.content.trim()) {
      // Optionally alert or prevent saving empty notes
      return;
    }

    const note: Note = {
      id: this.editingNoteId ?? undefined,
      title: this.title.trim(),
      content: this.content.trim(),
    };

    if (this.editingNoteId) {
      this.noteService.updateNote(note);
    } else {
      this.noteService.addNote(note);
    }

    this.clearForm();
  }

  editNote(note: Note): void {
    this.title = note.title;
    this.content = note.content;
    this.editingNoteId = note.id ?? null;
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id);
  }

  clearForm(): void {
    this.title = '';
    this.content = '';
    this.editingNoteId = null;
  }
}
