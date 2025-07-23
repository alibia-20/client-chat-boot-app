import NavBar from "../share/NavBar";
import React from "react";
import Sidebar from "../share/SideBar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between max-md:flex-col max-md:items-center">
        <div>
          <Sidebar />
        </div>
        <div className=" w-[calc(100%-256px)]">
          <NavBar />
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </div>
  );
}
