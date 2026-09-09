import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminSuggestions from "./Suggestions";
import AdminInquiries from "./Inquiries";
import AdminInquiryDetail from "./InquiryDetail";

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="suggestions" replace />} />
        <Route path="suggestions" element={<AdminSuggestions />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
      </Route>
    </Routes>
  );
}
