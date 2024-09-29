import { createContext, useContext, useState } from "react";

interface CommentsContextType {
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
}

const ActiveCardContext = createContext<CommentsContextType | null>(null);

export function useActiveCardContext() {
  const context = useContext(ActiveCardContext);

  if (!context) {
    throw new Error(
      "useActiveCardContext must be used within ActiveCardProvider",
    );
  }

  return context;
}

export function ActiveCardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <ActiveCardContext.Provider value={{ activeCardId, setActiveCardId }}>
      {children}
    </ActiveCardContext.Provider>
  );
}
