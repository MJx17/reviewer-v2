import { Routes, Route } from "react-router-dom";
import TodoListPage from "./pages/TodoList";
import DayTodosPage from "./pages/DayTodosPage";
import NotesPage from "./pages/Notes";
import NotePage from "./pages/Note";
import SubjectsPage from "./pages/Subject";
import SubjectNotesPage from "./pages/SubjectNotesPage";
import FlashcardsPage from "./pages/FlashCard";
import SubjectFlashcardsPage from "./pages/SubjectFlashcardsPage";
import LoginModal from "./pages/Login";
import Loading from "./components/ui/loading";
import ProtectedRoute from "./protectedRoutes";
import PublicLayout from "./layouts/publicLayout";
import ProtectedLayout from "./layouts/protectedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Modal from "react-modal";
import HomePage from "./pages/homepage";
Modal.setAppElement("#root");

const App = () => {
  return (
    <>
      <Routes>
        {/* 🔓 PUBLIC ROUTES (NO NAVBAR) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LoginModal />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/Unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Route>

        {/* 🔒 PROTECTED ROUTES (WITH NAVBAR) */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/todos" element={<TodoListPage />} />
          <Route path="/todos/:date" element={<DayTodosPage />} />

          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route
            path="/flashcards/:subjectId"
            element={<SubjectFlashcardsPage />}
          />

          <Route path="/notes" element={<NotesPage />} />
          <Route path="/note/:id" element={<NotePage />} />
          <Route
            path="/notes/:subjectId"
            element={<SubjectNotesPage />}
          />

          <Route path="/subjects" element={<SubjectsPage />} />
        </Route>

        {/* Misc */}
        <Route path="/loading" element={<Loading />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
