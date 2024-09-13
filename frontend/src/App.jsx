import { Route, createRoutesFromElements, createBrowserRouter } from 'react-router-dom';
import Clue from './components/Clue';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Clue />}>
            <Route path='' element={<Clue />} />
        </Route>
    )
);

export default router;