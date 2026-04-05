# Plan: Fix Blank Landing Page and 404 Errors

## 1. Fix Meta Tag in `index.html`
- Replace the deprecated `<meta name="apple-mobile-web-app-capable" content="yes" />` with `<meta name="mobile-web-app-capable" content="yes" />`.
- Ensure all meta tags are modern and standard.

## 2. Address 404 Errors for Assets
- The 404 errors for `index-jby9EeHP.css` and `index-LEW3s-Nl.js` suggest the browser is trying to load old build artifacts.
- Since this is a Vite project, the root `index.html` should reference `/src/main.tsx`.
- I will ensure `index.html` is clean and correctly points to the source entry point.
- I will also trigger a build-like state check to ensure the environment is healthy.

## 3. Robust Supabase Initialization
- Update `src/lib/supabase.ts` to handle missing environment variables more gracefully to prevent silent failures that lead to blank screens.
- Ensure the Supabase client is exported correctly.

## 4. Auth Context Improvements
- Review `src/contexts/AuthContext.tsx` to ensure the `loading` state doesn't get stuck and provides meaningful feedback if initialization fails.

## 5. Verification
- Validate the build to ensure no TypeScript errors or missing imports.
