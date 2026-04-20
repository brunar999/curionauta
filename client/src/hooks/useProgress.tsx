import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/queryClient";
import type { LessonProgress } from "@shared/schema";

export function useStudentProgress(studentId: number | null | undefined) {
  return useQuery<LessonProgress[]>({
    queryKey: ["progress", studentId],
    queryFn: () => apiFetch(`/api/students/${studentId}/progress`),
    enabled: !!studentId,
  });
}

export function useStudentStats(studentId: number | null | undefined) {
  return useQuery({
    queryKey: ["stats", studentId],
    queryFn: () =>
      apiFetch<{
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        totalTimeSeconds: number;
      }>(`/api/students/${studentId}/stats`),
    enabled: !!studentId,
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      studentId: number;
      lessonId: number;
      status?: string;
      timeSpent?: number;
      correctAnswers?: number;
      totalAnswers?: number;
      starsEarned?: number;
    }) =>
      apiFetch<LessonProgress>("/api/progress", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["progress", variables.studentId] });
      qc.invalidateQueries({ queryKey: ["stats", variables.studentId] });
    },
  });
}
