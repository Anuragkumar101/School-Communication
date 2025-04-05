import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AdminContextProps {
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;
  validateAdminCode: (code: string) => boolean;
}

const AdminContext = createContext<AdminContextProps>({
  isAdmin: false,
  setAdminStatus: () => {},
  validateAdminCode: () => false,
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    // You could also store this in localStorage if you want it to persist
    if (status) {
      localStorage.setItem('adminStatus', 'true');
    } else {
      localStorage.removeItem('adminStatus');
    }
  };

  const validateAdminCode = (code: string): boolean => {
    // Secret code is "Anurag"
    const isValid = code === "Anurag";
    if (isValid) {
      setAdminStatus(true);
    }
    return isValid;
  };

  // Check localStorage on initialization
  React.useEffect(() => {
    const storedAdminStatus = localStorage.getItem('adminStatus');
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, setAdminStatus, validateAdminCode }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);