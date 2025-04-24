'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '../../context/WalletContext';
import { DASHBOARD_NAV_ITEMS, ROLES, ROLE_NAMES } from '../../utils/constants';
import WalletConnectButton from '../../components/WalletConnectButton';

// Icons import
import { 
  Menu, X, LogOut, User, Bell, 
  ChevronDown, ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    address, 
    userRole, 
    isLoading, 
    isAuthenticated,
    logoutWallet 
  } = useWallet();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  
  // Get navigation items based on user role
  const navItems = userRole ? DASHBOARD_NAV_ITEMS[userRole] || [] : [];
  
  // Handle logout
  const handleLogout = () => {
    logoutWallet();
    router.push('/login');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-gray-800 text-white`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-6 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">KYC-Nexus</Link>
          </div>
          
          {/* Role badge */}
          <div className="px-4 py-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
              {ROLE_NAMES[userRole] || 'User'}
            </span>
          </div>
          
          {/* Navigation items */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 h-5 w-5">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Logout button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-6">
              <Link href="/" className="text-xl font-bold">KYC-Nexus</Link>
              <button 
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Role badge */}
            <div className="px-4 py-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {ROLE_NAMES[userRole] || 'User'}
              </span>
            </div>
            
            {/* Navigation items */}
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3 h-5 w-5">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Logout button */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white shadow">
          <div className="flex items-center justify-between px-4 h-full">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Header right section */}
            <div className="flex items-center ml-auto">
              {/* Wallet status */}
              <div className="mr-4">
                <WalletConnectButton />
              </div>
              
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center max-w-xs p-2 text-sm bg-white rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <User className="h-6 w-6 text-gray-600" />
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
                </button>
                
                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}