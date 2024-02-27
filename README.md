Exercise 7:
===========

1. Follow the [Learn React Tutorial](https://react.dev/learn/tutorial-tic-tac-toe)
2. Convert the project to use TypeScript
3. Introduce a custom hook called `useNavigatorLanguage` which returns the selected user language
    - Hint: Read the state from `navigator.language` (or `navigator.languages`)
    - Hint: Use `useEffect` to `addEventListener` on `"languagechange"`
4. Create a `Record<SupportedLanguageTypes, ApplicationTexts>` structure for all user texts
5. Create a `React.createContext` that can return the `ApplicationTexts` based on the `useNavigatorLanguage`

When you get it to work, you should be able to select Settings > Language in Chrome and have the UI update automatically
when you change the order of **Preferred Languages**
