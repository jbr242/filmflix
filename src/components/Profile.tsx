import {Fragment} from "react";
import {
    Card,
    CardContent,
    Paper,
    Typography,
} from "@mui/material";
import ResponsiveAppBar from "./NavBar";
import Avatar from "@mui/material/Avatar";
import {useUserStore} from "../store";
import UsersFilms from "./UsersFilms";
import UserReviews from "./UserReviews";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";

const Profile = () => {
    const user = useUserStore(state => state.user)
    return (
        <div style={{ height: "100vh", width:"1280px", maxWidth:"90vw"}}>
            <Fragment>
                <ResponsiveAppBar />
            </Fragment>
            <Paper elevation={1} sx={{ height: "80%", overflow: "auto" , display: "grid", gridTemplateColumns: "20% 40% 40%", gridTemplateRows: "100%" }}>
                <Card  sx={{display:'flex', flexDirection:'column', width:'100%', height:'100%', alignItems:'center'}}>
                    <CardContent sx={{display:'flex', flexDirection:'column', width:'100%', height:'100%', alignItems:'center'}}>
                                <Avatar
                                    alt={user?.firstName}
                                    src={"http://localhost:4941/api/v1/users/" + user?.id + "/image"}
                                    sx={{ width: '5vw', height: '5vw', margin:4}}
                                />
                                <Typography>
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography sx={{fontSize:12}}>
                                    {user?.email}
                                </Typography>
                                <Divider/>
                                <Link to={"/profile/edit/"}>
                                <Button>
                                    Edit Profile
                                </Button>
                                </Link>
                    </CardContent>
                </Card>
                <Card>
                    <UsersFilms userId={user?.id}/>
                </Card>
                <Card>
                    <UserReviews userId={user?.id}/>
                </Card>
            </Paper>
        </div>
    )
};


export default Profile;
