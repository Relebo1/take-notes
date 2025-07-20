import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from './note.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl: string = 'http://localhost:8080/api/notes'; // Adjust if different
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotes(): void {
    this.http.get<Note[]>(this.apiUrl)
      .subscribe(notes => this.notesSubject.next(notes));
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      tap(addedNote => {
        const currentNotes = this.notesSubject.value;
        this.notesSubject.next([...currentNotes, addedNote]);
      })
    );
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${note.id}`, note).pipe(
      tap(updatedNote => {
        const currentNotes = this.notesSubject.value;
        const index = currentNotes.findIndex(n => n.id === updatedNote.id);
        if (index !== -1) {
          currentNotes[index] = updatedNote;
          this.notesSubject.next([...currentNotes]);
        }
      })
    );
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentNotes = this.notesSubject.value.filter(n => n.id !== id);
        this.notesSubject.next(currentNotes);
      })
    );
  }
}
