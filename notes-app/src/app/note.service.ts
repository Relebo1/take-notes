import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  constructor() {}

  addNote(note: Note): void {
    note.id = this.generateId();
    this.notes.push(note);
    this.updateNotes();
  }

  updateNote(note: Note): void {
    const index = this.notes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      this.notes[index] = note;
      this.updateNotes();
    }
  }

  deleteNote(id: number): void {
    this.notes = this.notes.filter(note => note.id !== id);
    this.updateNotes();
  }

  private updateNotes(): void {
    this.notesSubject.next([...this.notes]); // emit a copy
  }

  private generateId(): number {
    return this.notes.length > 0
      ? Math.max(...this.notes.map(n => n.id!)) + 1
      : 1;
  }
}
