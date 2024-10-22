"use client";

import { Table, Button, Space, Modal, Form, Input, Avatar, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

interface UserReport {
  userName: string;
  userId: string;
  userImage: string;
  createdAt: string;
  reportingComplain: string;
  reportedBy: string;
  isSuspended?: boolean;
  suspensionDays?: number;
}

const UserReportManagement: React.FC = () => {
  const [userReports, setUserReports] = useState<UserReport[]>([
    {
      userName: 'John Doe',
      userId: '12345',
      userImage: '',
      createdAt: '2024-10-20T12:30:00',
      reportingComplain: 'Inappropriate content',
      reportedBy: 'Jane Smith',
      isSuspended: false,
      suspensionDays: 0,
    },
    // Add more user reports here
  ]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [form] = Form.useForm();

  const handleViewDetails = (report: UserReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const handleSuspendUser = (report: UserReport) => {
    setSelectedReport(report);
    setIsSuspendModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailsModalOpen(false);
    setIsSuspendModalOpen(false);
    setSelectedReport(null);
  };

  const handleConfirmSuspend = async () => {
    try {
      const values = await form.validateFields();
      const updatedReports = userReports.map((report) => {
        if (report.userId === selectedReport?.userId) {
          return {
            ...report,
            isSuspended: true,
            suspensionDays: values.suspensionDays,
          };
        }
        return report;
      });
      setUserReports(updatedReports);
      message.success(`${selectedReport?.userName} has been suspended for ${values.suspensionDays} days.`);
      handleModalClose();
    } catch (error) {
      message.error('Failed to suspend user.');
    }
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'User Image',
      dataIndex: 'userImage',
      key: 'userImage',
      render: (text: string, record: UserReport) => (
        <Avatar size={64} icon={<UserOutlined />} src={record.userImage || undefined} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Reporting Complain',
      dataIndex: 'reportingComplain',
      key: 'reportingComplain',
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Suspension Status',
      key: 'isSuspended',
      render: (text: string, record: UserReport) => (
        record.isSuspended ? (
          <span>Suspended for {record.suspensionDays} days</span>
        ) : (
          <span>Active</span>
        )
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: UserReport) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          <Button type="primary" danger onClick={() => handleSuspendUser(record)}>
            Suspend
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">User Report Management</h1>
        <Table columns={columns} dataSource={userReports} rowKey="userId" />

        {/* View Details Modal */}
        <Modal
          title="User Report Details"
          visible={isDetailsModalOpen}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedReport && (
            <div>
              <p><strong>User Name:</strong> {selectedReport.userName}</p>
              <p><strong>User ID:</strong> {selectedReport.userId}</p>
              <Avatar size={64} src={selectedReport.userImage || undefined} />
              <p><strong>Created At:</strong> {moment(selectedReport.createdAt).format('YYYY-MM-DD HH:mm')}</p>
              <p><strong>Reporting Complain:</strong> {selectedReport.reportingComplain}</p>
              <p><strong>Reported By:</strong> {selectedReport.reportedBy}</p>
            </div>
          )}
        </Modal>

        {/* Suspend User Modal */}
        <Modal
          title="Suspend User"
          visible={isSuspendModalOpen}
          onCancel={handleModalClose}
          onOk={handleConfirmSuspend}
          okText="Suspend"
          okButtonProps={{ danger: true }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="suspensionDays"
              label="Number of Days"
              rules={[{ required: true, message: 'Please input the suspension period!' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UserReportManagement;
