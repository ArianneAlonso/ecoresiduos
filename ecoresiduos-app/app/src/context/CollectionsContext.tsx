import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos el tipo de una colección
export type Collection = {
  address: string;
  selectedContainer: string;
  selectedMaterials: string[];
  selectedSchedule: string;
};

// Tipo del contexto
type CollectionsContextType = {
  collections: Collection[];
  addCollection: (collection: Collection) => void;
};

// Contexto
const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

// Provider
export const CollectionsProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const addCollection = (collection: Collection) => {
    setCollections(prev => [...prev, collection]);
  };

  return (
    <CollectionsContext.Provider value={{ collections, addCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
};

// Hook para usar el contexto
export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) throw new Error('useCollections must be used within CollectionsProvider');
  return context;
};