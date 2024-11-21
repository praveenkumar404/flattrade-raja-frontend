import { useEffect, useState } from 'react';

const UseColorScheme = () => {
  const [colorScheme, setColorScheme] = useState(
    document.documentElement.getAttribute('data-toolpad-color-scheme') || 'default'
  );

  useEffect(() => {
    // Function to retrieve the latest color scheme value
    const updateColorScheme = () => {
      const scheme = document.documentElement.getAttribute('data-toolpad-color-scheme') || 'default';
      setColorScheme(scheme);
      console.log("Current color scheme:", scheme);
    };

    // Initialize the color scheme value
    updateColorScheme();

    // Set up a MutationObserver to watch for changes to the data-toolpad-color-scheme attribute
    const observer = new MutationObserver(updateColorScheme);
    observer.observe(document.documentElement, {
      attributes: true, // Watch for attribute changes
      attributeFilter: ['data-toolpad-color-scheme'] // Only watch this specific attribute
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return colorScheme
};

export default UseColorScheme;

