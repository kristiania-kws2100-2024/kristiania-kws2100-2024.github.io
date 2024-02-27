Exercise 7:
===========

1. Follow the [Learn React Tutorial](https://react.dev/learn/tutorial-tic-tac-toe)
2. Convert the project to use TypeScript
3. Introduce a custom hook called `useNavigatorLanguage` which returns the selected user language
    - Hint: Read the state from `navigator.language` (or `navigator.languages`)
    - Hint: Use `useEffect` to `addEventListener`
      on [`"languagechange"`](https://developer.mozilla.org/en-US/docs/Web/API/Window/languagechange_event)
4. Create a `Record<SupportedLanguageTypes, ApplicationTexts>` structure for all user texts
5. Create a [`React.createContext`](https://react.dev/reference/react/useContext) that can return the `ApplicationTexts`
   based on the `useNavigatorLanguage`

When you get it to work, you should be able to select Settings > Language in Chrome and have the UI update automatically
when you change the order of **Preferred Languages**

The magic of TypeScript is that whenever you add a new supported language or a new application text, your code will
give you an error until all the texts are defined in all the supported languages.

