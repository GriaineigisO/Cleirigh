import { Link } from "react-router-dom"

const LeftSidebar = () => {
    return (
        <div className="col-sm-2 left-sidebar">
            <div className="row"><a href="/familyTree">Family tree</a></div>
            <div className="row"><a href="/profiles">Ancestor Profiles</a></div>
            <div className="row"><a href="/queries">Queries</a></div>
        </div>
    )
}

export default LeftSidebar