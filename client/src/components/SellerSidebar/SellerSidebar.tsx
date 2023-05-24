import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    // <div className="flex flex-row">
    // <nav className={`sidebar ${isMinimized ? 'minimized' : ''} w-1/6 bg-red-100`}>
    <nav
      className={`sidebar ${
        isMinimized ? "w-1/8" : "w-1/6 bg-red-100"
      } transition-width duration-300`}
    >
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      {isMinimized ? (
        <div className="w-1/6 bg-red-100"></div>
      ) : (
        <div>
          <div className="sidebar-content">
            <Link to="/seller/manageProducts">
              <p className="text-purpleAccent">Manage Products</p>
            </Link>
            <Link to="/seller/addProduct">
              <p className="text-purpleAccent">Add Product</p>
            </Link>
            <Link to="/seller/manageOrders">
              <p className="text-purpleAccent">Manage Orders</p>
            </Link>
            <Link to="/seller/vouchers">
              <p className="text-purpleAccent">Manage Vouchers</p>
            </Link>
          </div>
        </div>
      )}
    </nav>
    // </div>
  );
};

export default Sidebar;
