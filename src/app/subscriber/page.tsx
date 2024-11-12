"use client";
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';

interface Subscriber {
  package_id: number;
  title: string;
  description: string;
  price: number;
  time_duration: number;
}

const SubscriptionPage: React.FC = () => {
  const [packages, setPackages] = useState<Subscriber[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Subscriber | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(100);
  const Token = localStorage.getItem('access_token'); // Fetch access token from local storage

  // Fetch all packages
  const fetchPackages = async (search: string = '') => {
    try {
      const response = await fetch(`https://crewlink.development.logomish.com/packages/get-all-packages/${page}/${limit}?search=${search}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setPackages(data.data);
      } else {
        message.error('Failed to fetch packages');
      }
    } catch (error) {
      message.error('Error fetching packages');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchPackages();
  };
  // Handle add or update package
  const handleAddOrUpdatePackage = async (values: any) => {
    const url = editingPackage
      ? 'https://crewlink.development.logomish.com/packages/update-package'
      : 'https://crewlink.development.logomish.com/packages/create-package';

    const payload = editingPackage
      ? { ...values, package_id: editingPackage.package_id }
      : values;

    try {
      const response = await fetch(url, {
        method: editingPackage ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.statusCode === 200 || result.statusCode === 201) {
        message.success(editingPackage ? 'Package updated successfully' : 'Package added successfully');
        fetchPackages();
        setIsModalOpen(false);
        form.resetFields(); // Reset form fields
        setEditingPackage(null); // Clear editing package state
      } else {
        message.error('Failed to save package');
      }
    } catch (error) {
      message.error('Error saving package');
    }
  };

  // Handle delete package
  const handleDeletePackage = async (package_id: number) => {
    try {
      const response = await fetch('https://crewlink.development.logomish.com/packages/delete-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: JSON.stringify({ package_id }),
      });
      const result = await response.json();
      if (result.statusCode === 200) {
        message.success('Package deleted successfully');
        fetchPackages();
      } else {
        message.error('Failed to delete package');
      }
    } catch (error) {
      message.error('Error deleting package');
    }
  };

  // Filter packages based on search text
  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Package ID',
      dataIndex: 'package_id',
      key: 'package_id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Duration (months)',
      dataIndex: 'time_duration',
      key: 'time_duration',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Subscriber) => (
        <>
          <Button
            onClick={() => {
              setEditingPackage(record);
              setIsModalOpen(true);
              form.setFieldsValue(record); // Populate form fields with selected package data
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeletePackage(record.package_id)}
            danger
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setEditingPackage(null); // Reset editing package for a new package
    form.resetFields(); // Reset form fields to default
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Packages</h1>

        {/* Search Box */}
        <Input.Search
          placeholder="Search packages"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {/* Packages Table */}
        <Table
          columns={columns}
          dataSource={filteredPackages}
          rowKey="package_id"
          pagination={{
            current: page,
         
            total: totalPages * limit, // Total number of items
          }} onChange={handleTableChange}
        />

        <Button
          type="primary"
          onClick={handleModalOpen}
          style={{ marginBottom: 16 }}
        >
          Add New Package
        </Button>

        <Modal
          title={editingPackage ? 'Edit Package' : 'Add New Package'}
          visible={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields(); // Reset form fields when closing
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleAddOrUpdatePackage}
            layout="vertical"
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the package title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter the package description' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please enter the package price' }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Duration (months)"
              name="time_duration"
              rules={[{ required: true, message: 'Please enter the package duration' }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingPackage ? 'Update Package' : 'Add Package'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default SubscriptionPage;
