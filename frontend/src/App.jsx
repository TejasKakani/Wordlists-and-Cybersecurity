import { Route, createRoutesFromElements, createBrowserRouter } from 'react-router-dom';
import Clue from './components/Clue';
import { RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Clue />}>
            <Route path='' element={<Clue />} />
        </Route>
    )
);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;