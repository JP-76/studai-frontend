import { type ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;
