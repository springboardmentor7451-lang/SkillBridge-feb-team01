import React from 'react';
import { Typography, List, Badge } from 'antd';

const { Title } = Typography;

const Notifications = () => {
    // Placeholder list for future socket-driven notifications
    const sampleNotifications = [
        { id: 1, text: 'New match found!', unread: true },
        { id: 2, text: 'Organization replied to your application', unread: false },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Notifications</Title>
            <List
                itemLayout="horizontal"
                dataSource={sampleNotifications}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <span>
                                    {item.text}{' '}
                                    {item.unread && <Badge status="processing" text="Unread" />}
                                </span>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Notifications;
