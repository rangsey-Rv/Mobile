import React, { createContext, useContext, useState, ReactNode } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  course: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, content: string, course: string) => void;
  updateNote: (
    id: string,
    title: string,
    content: string,
    course: string
  ) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (title: string, content: string, course: string) => {
    const newNote: Note = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      content,
      course,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (
    id: string,
    title: string,
    content: string,
    course: string
  ) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, title, content, course, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const getNoteById = (id: string): Note | undefined => {
    return notes.find((note) => note.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
