'use client';

import { ToastContainer } from '@/components/ui/toast';
import { useEffect } from 'react';

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}