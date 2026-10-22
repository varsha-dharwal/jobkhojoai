import { Navigate } from "react-router";

export default function ProtectedRoute({ children }){
  const token = typeof window !== "undefined" ? window.localStorage.getItem("jobkhojoai_token") : null;
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
