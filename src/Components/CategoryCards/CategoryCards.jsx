import Col from "react-bootstrap/esm/Col";
import "../../Pages/HomePage/home.css";
import { useNavigate } from "react-router-dom";

const CategoryDetails = (props) => {
  const { categoryDetails } = props;
  const navigate = useNavigate();

  const handleNavigateEnquire = () => {
    navigate("/all-india-page");
  };
  return (
    <div className="category-container" onClick={handleNavigateEnquire}>
      <div className="image-container">
        <img
          src={`https://prnvservices.com/${categoryDetails?.category_image}`}
          alt={categoryDetails?.category_name}
          className="category-image-home"
        />
      </div>
      <p className="category-name">{categoryDetails?.category_name}</p>
    </div>
  );
};
export default CategoryDetails;
