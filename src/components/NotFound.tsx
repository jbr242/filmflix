import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import LiveTvIcon from "@mui/icons-material/LiveTv";
const NotFound = () => {

    return (<>
        <div>
            <LiveTvIcon fontSize='large'/>
        </div>
        <h1>404 Not Found</h1>

        <h4>How'd we get here?</h4>
        <div className="card">
            <p>
                <Button component={Link} variant="contained" to="/" >
                    Go Home
                </Button>
            </p>
        </div>
    </>)
}

export default NotFound;