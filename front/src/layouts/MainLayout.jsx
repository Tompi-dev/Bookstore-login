import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <Outlet />
    </div>
  );
};

export default MainLayout;
