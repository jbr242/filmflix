import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import NotFound from "./components/NotFound";
import Index from "./components/Index";
import Films from "./components/Films";
import Film from "./components/Film";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import PublishFilm from "./components/PublishFilm";
import EditFilm from "./components/EditFilm";
import EditUser from "./components/EditUser";

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/films" element={<Films/>}/>
                <Route path="/films/:filmId" element={<Film/>}/>
                <Route path="/films/:filmId/edit" element={<EditFilm/>}/>
                <Route path="/login" element={<SignIn/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/profile/edit" element={<EditUser/>}/>
                <Route path="/publish" element={<PublishFilm/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
    </Router>
);
}


export default App
