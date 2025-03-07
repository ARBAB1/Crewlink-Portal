"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { baseUrl } from '@/constant';

interface Airline {
  airline_id: string;
  name: string;
  country: string;
  airline_abbreviation: string;
  logo_url: string;
}
interface Country {
  country_id: number;
  country_name: string;
  countryCode: string;
}

const AirlineManagement: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [limit, setLimit] = useState(100);
  const [fileList, setFileList] = useState<any[]>([]);
  const token = localStorage.getItem('access_token');

  // Fetch Airlines using fetch API
  const fetchAirlines = async (search: string = '') => {
    try {
  
      const response = await fetch(`${baseUrl}/airline/get-all-airlines?search=${search}&page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTotalPages(data.totalPages);
        setAirlines(data.data);
        
      } else {
        message.error('Failed to fetch airlines');
      }
    } catch (error) {
      message.error('Error fetching airlines');
    }
  };
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchAirlines();
  };
  useEffect(() => {
    fetchAirlines();
    fetchCountries();
  }, []);

  // Handle Add Airline
  const handleAddAirline = () => {
    setSelectedAirline(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  // Handle Confirm Add using fetch API
  const handleConfirmAdd = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        message.error('Please upload a logo!');
        return;
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('country', selectedCountry);
      formData.append('airline_abbreviation', values.airline_abbreviation);
      formData.append('logo_url', fileList[0].originFileObj);

      const response = await fetch(`${baseUrl}/airline/create-airline`, {
        method: 'POST',
        headers: {
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success('Airline added successfully');
        setSelectedCountry('');
        setIsModalOpen(false);
        fetchAirlines();
      } else {
        message.error('Failed to add airline');
      }
    } catch (error) {
      message.error('Error adding airline');
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchAirlines(e.target.value);
  };

  // Handle Edit Airline
  const handleEditAirline = (airline: Airline) => {
    setSelectedAirline(airline);
    form.setFieldsValue({
      name: airline.name,
      country: airline.country,
      airline_abbreviation: airline.airline_abbreviation,
    });
    setFileList([{ uid: '-1', name: 'logo.png', status: 'done', url: airline.logo_url }]);
    setIsEditModalOpen(true);
  };

  // Handle Confirm Edit using fetch API
  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAirline) {
        console.log(typeof(selectedAirline.airline_id), values.name, values.country, values.airline_abbreviation, selectedAirline.airline_id,"selectedAirline.airline_id")
        const formData = new FormData();
        formData.append('airline_id', `${selectedAirline.airline_id}`);
        formData.append('name', values.name);
        formData.append('country', values.country);
        formData.append('airline_abbreviation', values.airline_abbreviation);
        if (fileList.length > 0 && fileList[0].originFileObj && fileList[0].originFileObj!= undefined) {
          formData.append('logo_url', fileList[0].originFileObj);
        }

        const response = await fetch(`${baseUrl}/airline/update-airline`, {
          method: 'POST',
          headers: {
            'x-api-key': 'TwillioAPI',
            'accesstoken': `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(response)

        if (response.ok) {
          message.success('Airline updated successfully');
          setIsEditModalOpen(false);
          fetchAirlines();
        } else {
          message.error('Failed to update airline');
        }
      }
    } catch (error) {
      message.error('Error updating airline');
    }
  };

  // Handle Delete Airline using fetch API
  const handleDeleteAirline = async (airline_id: string) => {
    try {
      const response = await fetch(`${baseUrl}/airline/delete-airline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`,
        },
        body: JSON.stringify({ airline_id }),
      });

      if (response.ok) {
        message.success('Airline deleted successfully');
        fetchAirlines();
      } else {
        message.error('Failed to delete airline');
      }
    } catch (error) {
      message.error('Error deleting airline');
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      key: 'logo_url',
      render: (logo: string) => <img src={logo} alt="Airline Logo" style={{ width: '100px', height: '50px', objectFit: 'contain' }} />,
    },
    {
      title: 'Airline Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Airline Abbreviation',
      dataIndex: 'airline_abbreviation',
      key: 'airline_abbreviation',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: string, record: Airline) => (
        <Space size="middle">
          <Button onClick={() => handleEditAirline(record)} style={{ backgroundColor: '#001529', color: 'white' }}>
            Edit
          </Button>
          <Button onClick={() => handleDeleteAirline(record.airline_id)} style={{ color: 'red' }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const fetchCountries = async (search: string = '') => {
    try {
      const response = await fetch(`${baseUrl}/check-in/get-all-countries-portal/1/1000?search=`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        // setTotalPages(data.totalPages);
        setCountries(data.data);
      } else {
        message.error('Failed to fetch countries');
      }
    } catch (error) {
      message.error('An error occurred while fetching countries');
    }
  };
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  }
  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <Button
          type="primary"
          onClick={handleAddAirline}
          style={{ backgroundColor: '#001529', borderColor: '#001529' }}
        >
          Add Airline
        </Button>
        <Input
        placeholder="Search by airline name"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: '200px' }}
      />
        <Table columns={columns} dataSource={airlines} rowKey="airline_id" style={{ marginTop: '20px' }}   pagination={{
    current: page,
 
    total: totalPages * limit, // Total number of items
  }} onChange={handleTableChange} />

        {/* Add Airline Modal */}
        <Modal
          title="Add Airline"
          open={isModalOpen}
          onOk={handleConfirmAdd}
          onCancel={() => setIsModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
        >
          <Form form={form} layout="vertical" name="add_airline_form">
            <Form.Item name="name" label="Airline Name" rules={[{ required: true, message: 'Please input airline name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please select a country!' }]}>
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                onChange={handleCountryChange}
               
              >
                {countries.map((country) => (
                  <Select.Option key={country.country_id} value={country.country_name}>
                    {country.country_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="airline_abbreviation" label="Airline Abbreviation" rules={[{ required: true, message: 'Please input abbreviation!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="logo_url" label="Upload Logo" rules={[{ required: true, message: 'Please upload a logo!' }]}>
              <Upload beforeUpload={() => false} onChange={handleUploadChange} fileList={fileList}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Airline Modal */}
        <Modal
          title="Edit Airline"
          open={isEditModalOpen}
          onOk={handleConfirmEdit}
          onCancel={() => setIsEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
        >
          <Form form={form} layout="vertical" name="edit_airline_form">
            <Form.Item name="name" label="Airline Name" rules={[{ required: true, message: 'Please input airline name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please select a country!' }]}>
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                onChange={handleCountryChange}
               
              >
                {countries.map((country) => (
                  <Select.Option key={country.country_id} value={country.country_name}>
                    {country.country_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="airline_abbreviation" label="Airline Abbreviation" rules={[{ required: true, message: 'Please input abbreviation!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="logo_url" label="Upload Logo">
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
