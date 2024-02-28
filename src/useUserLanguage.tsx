import { useEffect, useState } from "react";

export function useUserLanguage() {
  const [userLanguage, setUserLanguage] = useState(navigator.language);
  useEffect(() => {
    function handleLanguageChange() {
      setUserLanguage(navigator.language);
    }

    addEventListener("languagechange", handleLanguageChange);
    return () => removeEventListener("languagechange", handleLanguageChange);
  }, []);
  return userLanguage;
}