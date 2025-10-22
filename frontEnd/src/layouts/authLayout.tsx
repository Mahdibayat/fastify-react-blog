import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  //==== CONSTANTS ====//

  //==== RENDER ====//
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Outlet />
    </div>
  );
}
