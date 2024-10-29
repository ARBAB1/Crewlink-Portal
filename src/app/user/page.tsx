"use client";
import { Table, Button, Modal, Form, Input, message, Avatar } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { parse } from 'path';

const UserReporting = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendUserId, setSuspendUserId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const Token = localStorage.getItem('access_token'); // Fetch access token from local storage

  // Fetch all reported users
  const fetchReportedUsers = async () => {
    try {
      const response = await fetch(`https://sn1pgw0k-5000.inc1.devtunnels.ms/users/get-all-users-admin`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
      });
      const data = await response.json();
      if (data && data.data) {
        setReports(data.data);
      } else {
        message.error('Failed to fetch reported users');
      }
    } catch (error) {
      message.error('Error fetching reported users');
    }
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  // Handle suspend user
  const handleSuspendUser = async (values: any) => {
    const suspendDays = values.suspendDays;
    console.log(suspendUserId, suspendDays, "suspendUserId, suspendDays")

    try {
      const response = await fetch('https://sn1pgw0k-5000.inc1.devtunnels.ms/users/suspend-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: JSON.stringify({
          user_id: suspendUserId,
          suspendDays: parseInt(suspendDays),
        }),
      });
      const result = await response.json();
      console.log(result, "result")
      if (result.statusCode === 200) {
        message.success(`User suspended for ${suspendDays} days`);
        setIsSuspendModalOpen(false);
        form.resetFields();
        fetchReportedUsers();
      } else {
        message.error('Failed to suspend user');
      }
    } catch (error) {
      message.error('Error suspending user');
    }
  };
  const handleUnSuspendUser = async (values: any) => {
    const suspendDays = values.suspendDays;
    console.log(suspendUserId, suspendDays, "suspendUserId, suspendDays")

    try {
      const response = await fetch('https://sn1pgw0k-5000.inc1.devtunnels.ms/users/un-suspend-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: JSON.stringify({
          user_id: suspendUserId,
        
        }),
      });
      const result = await response.json();
      console.log(result, "result")
      if (result.statusCode === 200) {
        message.success(`User Unsuspended`);
        // setIsSuspendModalOpen(false);
        // form.resetFields();
        fetchReportedUsers();
      } else {
        message.error('Failed to suspend user');
      }
    } catch (error) {
      message.error('Error suspending user');
    }
  };

  // Open suspend modal
  const openSuspendModal = (userId: number) => {
    console.log(userId, "userId")
    setSuspendUserId(userId);
    setIsSuspendModalOpen(true);
  };

  // Columns for the Ant Design table
  const columns = [
    {
      title: 'User',
      key: 'reportedUser',
      render: (text: any, record: any) => (
        <>
          <Avatar src={record?.profile_picture_url} />
          <span style={{ marginLeft: 8 }}>{record?.user_name}</span>
        </>
      ),
    },
    {
      title: 'Email',
     
      key: 'email',
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.email}</span>
        </>
      ),
    },
    {
      title: 'Post Count',
      key: 'postCount',
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.post_count}</span>
        </>
      ),
    },
    {
      title: 'Airline ',
      key: 'airline',
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.airline}</span>
        </>
      ),
    },
    {
      title: 'Suspension Status',
      key: 'actions',
      render: (text: any, record: any) => (
        record.suspended_flag=="N"?(
    <h4>User Not Suspended</h4>
        ):(

          <h4>User Suspended for {record.suspend_days} days</h4>
        )
      
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        record.suspended_flag=="N"?(
          <Button onClick={() => openSuspendModal(record.user_id)}>Suspend User</Button>
        ):(

          <Button onClick={() => handleUnSuspendUser(record.user_id)}>Unsuspend User</Button>
        )
      
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">User Reporting</h1>
        <Table columns={columns} dataSource={reports} rowKey="report_id" />

        {/* Suspend User Modal */}
        <Modal
          title="Suspend User"
          open={isSuspendModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsSuspendModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleSuspendUser}>
            <Form.Item
              name="suspendDays"
              label="Suspend User for Days"
              rules={[{ required: true, message: 'Please enter the number of suspension days' }]}
            >
              <Input type="number" placeholder="Enter number of days" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UserReporting;
