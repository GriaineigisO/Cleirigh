import { Link } from "react-router-dom"

const LeftSidebar = () => {
    return (
        <div className="col-sm-2 left-sidebar">
            <div className="row"><Link to={"/familyTree"}>Family tree</Link></div>
            <div className="row"><Link to={"/profiles"}>Ancestor Profiles</Link></div>
            <div className="row"><Link to={"/queries"}>Queries</Link></div>
        </div>
    )
}

export default LeftSidebar