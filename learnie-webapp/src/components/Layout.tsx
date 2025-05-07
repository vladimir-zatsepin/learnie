import React from 'react';
import {Flex} from '@chakra-ui/react';
import Sidebar from "./Sidebar.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <Flex height="100vh" width="100%" position="relative">
      <Sidebar/>
      {children}
    </Flex>
  );
};

export default Layout;
