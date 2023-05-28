import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import {useUserStore} from "../store";
const Index = () => {
    const user = useUserStore(state => state.user)
    return (<>
        <div>
            <LiveTvIcon fontSize='large'/>
        </div>
        <h1>FilmFlix</h1>

        <h4>Jbr242</h4>
        <div className="card">
            <p>
                <Button disabled={!!user} component={Link} variant="contained" to={user ? '/films' : '/login'} style={{ marginRight: '10px' }}>
                    Sign In
                </Button>
                <Button disabled={!!user} component={Link} variant="outlined" to="/register">
                    Sign Up
                </Button>
            </p>
        </div>
        <p className="read-the-docs">
            Welcome to the film site festival{user ? ` ${user.firstName} ${user.lastName}` : ', feel free to register or continue as guest'}
        </p>
        <Button component={Link} variant="contained" color="success" to="/films">
            Continue{user ? ` ${user.firstName}` : ' As Guest'}
        </Button>

    </>)
}

export default Index;