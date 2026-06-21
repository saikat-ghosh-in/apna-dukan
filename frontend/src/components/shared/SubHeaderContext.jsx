import { createContext, useContext, useState } from "react";

const SubHeaderContext = createContext(null);

export const SubHeaderProvider = ({ children }) => {
    const [subHeader, setSubHeader] = useState(null);
    return (
        <SubHeaderContext.Provider value={{ subHeader, setSubHeader }}>
            {children}
        </SubHeaderContext.Provider>
    );
};

export const useSubHeader = () => useContext(SubHeaderContext);