import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Student } from "@shared/schema";

interface StudentContextType {
  activeStudent: Student | null;
  setActiveStudent: (student: Student | null) => void;
}

const StudentContext = createContext<StudentContextType>({
  activeStudent: null,
  setActiveStudent: () => {},
});

const STORAGE_KEY = "curionauta_active_student";

export function StudentProvider({ children }: { children: ReactNode }) {
  const [activeStudent, setActiveStudentState] = useState<Student | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setActiveStudent = (student: Student | null) => {
    setActiveStudentState(student);
    if (student) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <StudentContext.Provider value={{ activeStudent, setActiveStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useActiveStudent() {
  return useContext(StudentContext);
}
