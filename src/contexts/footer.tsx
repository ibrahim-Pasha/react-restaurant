import { createContext, useContext, useState } from "react";

type FooterContextType = {
    displayed: boolean;
    trigger?: (isDisplayed: boolean) => void;
};

const FooterContext = createContext<FooterContextType>({
    displayed: true,
});

function FooterProvider(props: any) {
    const [displayed, setDisplayed] = useState(true);
    const trigger = (isDisplayed: boolean) => {
        setDisplayed(isDisplayed);
    };
    return <FooterContext.Provider value={{ displayed, trigger }} {...props} />;
}

const useFooter = () => useContext(FooterContext);

export { useFooter, FooterProvider };