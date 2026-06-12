"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Sidebar from "./Sidebar";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const publicPages = ["/login", "/setup-project"];
    const isPublic = publicPages.includes(pathname);

    // Only redirect if authentication state has been properly loaded
    if (!isAuthenticated && !isPublic) {
      router.push("/login");
    }

    // Don't redirect authenticated users from login page immediately
    // This is handled by the login page itself after successful login
    // to avoid race conditions and double redirects

    setIsReady(true);
  }, [isAuthenticated, pathname, router]);

  if (!isReady) {
    return <div className="h-screen w-screen bg-white" />;
  }

  const isAuthPage = pathname === "/login" || pathname === "/setup-project";

  return isAuthPage ? (
    children
  ) : (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};

export default ClientLayout;
