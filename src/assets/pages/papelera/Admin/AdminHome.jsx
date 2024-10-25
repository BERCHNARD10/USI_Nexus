
import React, { useState } from 'react';
import { Avatar, Dropdown, Navbar, Sidebar} from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi';

function AdminHome () {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Define el estado de isSidebarOpen
  const [nameClass, setNameClass] = useState("off"); // Define el estado de isSidebarOpen

  const toggleSidebar = () => {

    setIsSidebarOpen(!isSidebarOpen); // Cambia el valor de isSidebarOpen al opuesto del valor actual
    if(isSidebarOpen)
    {
      setNameClass("on");
    }
    else{
      setNameClass("off");

    }
  };
  return (
    <div>
    <button onClick={toggleSidebar}>Toggle Sidebar</button> {/* Un botón para activar/desactivar el sidebar */}
    <h1>isSidebarOpen: {nameClass}    {isSidebarOpen ? 'true' : 'false'}</h1> {/* Mostrar el estado isSidebarOpen en un h1 */}

  <Sidebar collapsed={isSidebarOpen} aria-label="Sidebar with multi-level dropdown example" className="bg-white shadow-lg" theme="primary" >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="#" icon={HiInbox}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>
  );
}
export default AdminHome;

