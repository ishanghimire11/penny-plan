import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center px-6">
      {children}
    </div>
  );
};

export default layout;
