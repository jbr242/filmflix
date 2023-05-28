import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import {useUserStore} from "../store";
import {useEffect} from "react";
import axios from "axios";
const Logout = () => {
    const navigate = useNavigate();
    const user = useUserStore(state => state.user)
    const deleteUserFromStore = useUserStore(state => state.removeUser)
    const userLogoutConfig = {
        headers:{
            'X-Authorization': user?.authToken,
        }
    };


    useEffect(() => {
        axios.post("http://localhost:4941/api/v1/users/logout",null, userLogoutConfig).then(
            (response) => {
                console.log(response)
            },
            (error) => {
                console.log(error)
            }
        );
    }, []);

    useEffect(() => {
        if(user) {
            deleteUserFromStore();
        } else {
            navigate('/')
        }
    }, []);

    return (<>
        <div>
            <LiveTvIcon fontSize='large'/>
        </div>
        <h1>FilmFlix</h1>

        <h4>You have successfully logged out!</h4>
        <div className="card">
            <p>
                <Button component={Link} variant="contained" to="/" >
                    Go Home
                </Button>
            </p>
        </div>
    </>)
}

export default Logout;