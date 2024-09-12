import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { createRoutesFromElements, Route } from 'react-router-dom'
import Clue from './Clue'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Clue />}>
            <Route path='' element={<Clue /> }/>
        </Route>
    )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)


