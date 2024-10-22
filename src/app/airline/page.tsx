"use client";

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

interface Airline {
  id: string;
  name: string;
  logo: string;
}

const AirlineManagement: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleAddAirline = () => {
    setSelectedAirline(null);
    setFileList([]);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditAirline = (airline: Airline) => {
    setSelectedAirline(airline);
    form.setFieldsValue({
      name: airline.name,
    });
    setFileList([{ uid: '-1', name: 'logo.png', status: 'done', url: airline.logo }]);
    setIsEditModalOpen(true);
  };

  const handleDeleteAirline = (id: string) => {
    setAirlines((prev) => prev.filter((airline) => airline.id !== id));
    message.success('Airline deleted successfully');
  };

  const handleConfirmAdd = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        message.error('Please upload a logo!');
        return;
      }
      const newAirline: Airline = {
        id: (Math.random() * 10000).toString(), // Simulate ID generation
        name: values.name,
        logo: URL.createObjectURL(fileList[0].originFileObj),
      };

      setAirlines((prev) => [...prev, newAirline]);
      setIsModalOpen(false);
      setFileList([]);
      message.success('Airline added successfully');
    } catch (error) {
      message.error('Failed to add airline');
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAirline) {
        const updatedAirline: Airline = {
          id: selectedAirline.id,
          name: values.name,
          logo: fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : selectedAirline.logo,
        };

        setAirlines((prev) => prev.map((airline) => (airline.id === selectedAirline.id ? updatedAirline : airline)));
        setIsEditModalOpen(false);
        setSelectedAirline(null);
        setFileList([]);
        message.success('Airline updated successfully');
      }
    } catch (error) {
      message.error('Failed to update airline');
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => <img src={logo} alt="Airline Logo" style={{ width: '100px', height: '50px', objectFit: 'contain' }} />,
    },
    {
      title: 'Airline Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: string, record: Airline) => (
        <Space size="middle">
          <Button onClick={() => handleEditAirline(record)} style={{ backgroundColor: '#001529', color: 'white' }}>
            Edit
          </Button>
          <Button onClick={() => handleDeleteAirline(record.id)} style={{ color: 'red' }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Airline Management</h1>
        <Button
          type="primary"
          onClick={handleAddAirline}
          style={{ backgroundColor: '#001529', borderColor: '#001529' }}
        >
          Add Airline
        </Button>
        <Table columns={columns} dataSource={airlines} rowKey="id" style={{ marginTop: '20px' }} />

        {/* Add Airline Modal */}
        <Modal
          title="Add Airline"
          visible={isModalOpen}
          onOk={handleConfirmAdd}
          onCancel={() => setIsModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
        >
          <Form form={form} layout="vertical" name="add_airline_form">
            <Form.Item name="name" label="Airline Name" rules={[{ required: true, message: 'Please input airline name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="logo" label="Upload Logo" rules={[{ required: true, message: 'Please upload a logo!' }]}>
              <Upload beforeUpload={() => false} onChange={handleUploadChange} fileList={fileList}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Airline Modal */}
        <Modal
          title="Edit Airline"
          visible={isEditModalOpen}
          onOk={handleConfirmEdit}
          onCancel={() => setIsEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
        >
          <Form form={form} layout="vertical" name="edit_airline_form">
            <Form.Item name="name" label="Airline Name" rules={[{ required: true, message: 'Please input airline name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="logo" label="Upload Logo" rules={[{ required: false }]}>
              <Upload beforeUpload={() => false} onChange={handleUploadChange} fileList={fileList}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default AirlineManagement;
