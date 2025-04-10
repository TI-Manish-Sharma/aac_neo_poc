import React, { createContext, useState, useContext, ReactNode } from 'react';

type TabVisibilityContextType = {
    isTabBarVisible: boolean;
    setTabBarVisible: (visible: boolean) => void;
};

const TabVisibilityContext = createContext<TabVisibilityContextType>({
    isTabBarVisible: true,
    setTabBarVisible: () => { },
});

export const TabVisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isTabBarVisible, setTabBarVisible] = useState(true);

    return (
        <TabVisibilityContext.Provider
            value={{
                isTabBarVisible,
                setTabBarVisible,
            }}
        >
            {children}
        </TabVisibilityContext.Provider>
    );
};

export const useTabVisibility = () => useContext(TabVisibilityContext);