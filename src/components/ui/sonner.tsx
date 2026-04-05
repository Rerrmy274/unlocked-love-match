import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useEffect, useState } from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch and handle missing provider
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = (themeContext?.theme || "light") as ToasterProps["theme"];

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };