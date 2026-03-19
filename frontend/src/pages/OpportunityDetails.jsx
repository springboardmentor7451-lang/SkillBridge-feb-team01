import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOpportunityById } from "../services/opportunityService";
import { applyForOpportunity } from "../services/applicationService";

function OpportunityDetails() {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getOpportunityById(id);
      setOpp(data);
    };
    fetchData();
  }, [id]);

  const handleApply = async () => {
    await applyForOpportunity(id);
    alert("Applied successfully!");
  };

  if (!opp) return <p>Loading...</p>;

  return (
    <div>
      <h2>{opp.title}</h2>
      <p>{opp.description}</p>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}

export default OpportunityDetails;