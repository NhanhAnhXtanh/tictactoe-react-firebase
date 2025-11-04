import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        
        <Outlet />
      </div>
    </main>
  );
}
