import { useParams } from 'react-router-dom';
import './PlaceholderPage.css';

const OpportunityDetails = () => {
    const { id } = useParams();

    return (
        <div className="placeholder-page">
            <div className="placeholder-content">
                <h1>Opportunity Details</h1>
                <p className="placeholder-subtitle">Opportunity ID: {id}</p>
                <div className="placeholder-info">
                    <p>📄 This page will display detailed information about a specific opportunity.</p>
                    <p>Implementation assigned to: <strong>Opportunity Management Team</strong></p>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetails;
