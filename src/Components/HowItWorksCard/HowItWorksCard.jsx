import "../../Pages/HomePage/home.css";
const HowItWorksCard = ({ cardDetails }) => {
  return (
    <div className="how-it-works-card">
      <div className="card-imge-container">
        <img src={cardDetails.image} className="how-it-works-image" />
        <div className="step-container">
          <span>{cardDetails?.id}</span>
        </div>
      </div>
      <h3 className="search-text1">{cardDetails.heading}</h3>
      <p className="search-description">{cardDetails.paragraph}</p>
    </div>
  );
};
export default HowItWorksCard;
