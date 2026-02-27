import { useParams } from 'react-router-dom';
import './PlaceholderPage.css';

const EditOpportunity = () => {
    const { id } = useParams();

    return (
        <div className="placeholder-page">
            <div className="placeholder-content">
                <h1>Edit Opportunity</h1>
                <p className="placeholder-subtitle">Editing Opportunity ID: {id}</p>
                <div className="placeholder-info">
                    <p>✏️ This page will allow NGOs to edit existing opportunities.</p>
                    <p>Implementation assigned to: <strong>Opportunity Management Team</strong></p>
                </div>
            </div>
        </div>
    );
};

export default EditOpportunity;
