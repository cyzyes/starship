import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AboutPage } from "@/pages/About";
import { HomePage } from "@/pages/Home";
import { PlazaPage } from "@/pages/Plaza";
import { WritePage } from "@/pages/Write";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="plaza" element={<PlazaPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
