import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Matches = () => {
    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Matches</Title>
            <Paragraph>
                Here are your volunteer/NGO matches. This route is protected and requires authentication.
            </Paragraph>
        </div>
    );
};

export default Matches;
