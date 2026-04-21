import { Switch, Route, Redirect } from "wouter";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LicoesBrowse from "./pages/LicoesBrowse";
import GradePage from "./pages/GradePage";
import ThemePage from "./pages/ThemePage";
import LessonPage from "./pages/LessonPage";
import MetricsPage from "./pages/MetricsPage";
import AchievementsPage from "./pages/AchievementsPage";
import ParentDashboard from "./pages/ParentDashboard";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ fontFamily: "Fredoka", fontSize: 24, color: "var(--purple-600)" }}>
          A carregar… 🦦
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/licoes">
        <ProtectedRoute><LicoesBrowse /></ProtectedRoute>
      </Route>
      <Route path="/grade/:id">
        {(params) => (
          <ProtectedRoute><GradePage gradeId={Number(params.id)} /></ProtectedRoute>
        )}
      </Route>
      <Route path="/theme/:id">
        {(params) => (
          <ProtectedRoute><ThemePage themeId={Number(params.id)} /></ProtectedRoute>
        )}
      </Route>
      <Route path="/lesson/:id">
        {(params) => (
          <ProtectedRoute><LessonPage lessonId={Number(params.id)} /></ProtectedRoute>
        )}
      </Route>
      <Route path="/metricas">
        <ProtectedRoute><MetricsPage /></ProtectedRoute>
      </Route>
      <Route path="/conquistas">
        <ProtectedRoute><AchievementsPage /></ProtectedRoute>
      </Route>
      <Route path="/parent">
        <ProtectedRoute><ParentDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute><AdminPage /></ProtectedRoute>
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
