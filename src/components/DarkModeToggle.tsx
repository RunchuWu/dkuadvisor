
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Detect system preference on component mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('duke-dark-mode');
    
    if (storedTheme !== null) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('duke-dark-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('duke-dark-mode', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center gap-2">
      <Sun size={18} className="text-yellow-500" />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={setIsDarkMode}
        aria-label="Toggle dark mode"
      />
      <Moon size={18} className="text-indigo-400" />
    </div>
  );
};

export default DarkModeToggle;
