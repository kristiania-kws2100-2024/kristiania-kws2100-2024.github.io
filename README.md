# Plan

## Scaffold

1. `echo {} > package.json`
2. `npm install -D vite`
3. `npm pkg set scripts.dev=vite`
4. Create index.html
5. `npm run dev`
6. `npm install react react-dom`
7. Reference `src/index.tsx` from index.html and create it
8. `npm pkg set scripts.build="npm run check && vite build"`
9. `npm pkg set scripts.check="prettier --check . && tsc --noEmit"`
10. `npm install -D typescript prettier`
11. `npx prettier --write .`
12. `npx tsc --init`
13. `npm run check`
14. `npm install -D @types/react @types/react-dom`

## Open Layers hello

1. `npm install ol`
2. Create `src/modules/application/application.tsx` with map, view and layers
3. Move map, view, layers to `src/modules/map/mapContextProvider.tsx`
4. Create `<MapNav />` with (placeholder) focus actions and `<KommuneLayerCheckbox />`

## Kommune layer checkbox

1. KommuneLayerCheckbox reads `public/kommuner.json`
2. Extract `useKommuneLayer(show: boolean)`
3. Introduce `onClick` in `useKommuneLayer` (`map.on("click", handleClick)` (`MapBrowserEvent<MouseEvent>`))
4. Show `<dialog />` on click

## Kommune aside

1. Apply `visible` class based on `layers.find(l => l.getClassName() === "kommune")`
2. Extract `useKommuneFeatures`
3. `useKommuneFeatures` must listen to `layer.getSource().on("change")`
4. CSS hack with max-height
5. Limit features to view extent
6. Extract `useViewExtent`
7. `useViewExtent` must listen to `view.on("change")`
8. `const [hoverKommune, setHoverKommune] = useState<Feature|undefined>()`
9. `useEffect(() => { /* change style */ }, hoverKommune)`

