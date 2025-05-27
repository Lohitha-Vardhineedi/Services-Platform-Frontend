import Col from "react-bootstrap/esm/Col";
import "../../Pages/HomePage/home.css";
import { useNavigate } from "react-router-dom";

const CategoryDetails = (props) => {
  const { categoryDetails1 } = props;
  const navigate = useNavigate();

  const handleNavigateEnquire = () => {
    navigate("/all-india-page");
  };
  return (
    <div className="category-container" onClick={handleNavigateEnquire}>
      <div className="image-container">
        <img
          src={categoryDetails1?.categoryImage}
          alt={categoryDetails1?.categoryName}
          className="category-image-home"
        />
      </div>
      <p className="category-name">{categoryDetails1?.categoryName}</p>
    </div>
  );
};
export default CategoryDetails;
