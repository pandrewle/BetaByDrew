import { Link } from "react-router-dom";
import NavBar from "../components/navbar";

function NotFoundPage() {
  return (
    <div className="notfoundpage-container">
      <NavBar />
      <div>404 Not Found</div>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFoundPage;
