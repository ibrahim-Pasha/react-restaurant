import { createContext, useContext, useState } from "react";

type FooterContextType = {
    displayed: boolean;
    trigger?: (isDisplayed: boolean) => void;
};

const FooterContext = createContext<FooterContextType>({
    displayed: true,
});
const useFooter = () => useContext(FooterContext);

function FooterProvider(props: any) {
    const [displayed, setDisplayed] = useState(true);
    const trigger = (isDisplayed: boolean) => {
        setDisplayed(isDisplayed);
    };
    return <FooterContext.Provider value={{ displayed, trigger }} {...props} />;
}
export { useFooter, FooterProvider };
