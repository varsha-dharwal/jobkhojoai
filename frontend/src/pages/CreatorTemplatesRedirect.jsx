import { Navigate } from "react-router";

export default function CreatorTemplatesRedirect() {
  return <Navigate to="/creator/dashboard?view=templates" replace />;
}
