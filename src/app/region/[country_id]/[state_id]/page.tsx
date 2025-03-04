"use client";
import { Table, Button, Modal, Form, Input, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import type { RcFile } from 'antd/lib/upload';
import { baseUrl } from '@/constant';

interface CityProps {
  params: {
    country_id: string;
    state_id: string;
  };
}

const CityManagement: React.FC<CityProps> = ({ params }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any | null>(null);
  const [cityStateId, setCityStateId] = useState<string>(params.state_id); // Initialize with params.state_id;
  const [fileList, setFileList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [form] = Form.useForm();

  const country_id = params.country_id; // Get country_id from URL params
  const state_id = params.state_id; // Get state_id from URL params
  const router = useRouter();

  const Token = localStorage.getItem('access_token'); // Fetch access token from local storage
  const fetchStates = async (search: string = "") => {
    try {
      const response = await fetch(
        `${baseUrl}/check-in/get-all-states-portal/${page}/${limit}/${country_id}?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        // console.log(data, "data");
        setTotalPages(data.totalPages);
        setStates(data.data);
      } else {
        message.error("Failed to fetch states");
      }
    } catch (error) {
      message.error("Error fetching states");
    }
  };
  // Fetch cities for the selected state
  const fetchCities = async (search: string = '') => {
    try {
      const response = await fetch(`${baseUrl}/check-in/cities-by-state/${page}/${limit}/${state_id}?search=${search}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        console.log(data, 'cities');
      
        setCities(data.data);
      } else {
        message.error('Failed to fetch cities');
      }
    } catch (error) {
      message.error('Error fetching cities');
    }
  };

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, [state_id]);
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchCities();
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchCities(e.target.value);
  };
  // Handle add or update city
  const handleAddOrUpdateCity = async (values: any) => {
    console.log(cityStateId, "cityStateId");
    const url = editingCity
      ? `${baseUrl}/check-in/update-portal-city`
      : `${baseUrl}/check-in/create-portal-city`;

    const payload = new FormData();
    payload.append('city_name', values.city_name);
    payload.append('city_latitude', values.city_latitude);
    payload.append('city_longitude', values.city_longitude);
    payload.append('state_id', cityStateId);
    if (values.city_image) {
      payload.append('city_image_url', values.city_image.file as RcFile);
    }
    if (editingCity) {
      payload.append('city_id', editingCity.city_id);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: payload,
      });
      const result = await response.json();
      if (result.statusCode === 201 || result.statusCode === 200) {
        message.success(editingCity ? 'City updated successfully' : 'City added successfully');
        fetchCities();
        setIsCityModalOpen(false);
        form.resetFields();
        setEditingCity(null);
      } else {
        message.error('Failed to save city');
      }
    } catch (error) {
      message.error('Error saving city');
    }
  };

  // Handle delete city
  const handleDeleteCity = async (city_id: number) => {
    try {
      const response = await fetch(`${baseUrl}/check-in/delete-portal-city`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${Token}`,
        },
        body: JSON.stringify({ city_id: `${city_id}` }),
      });
      const result = await response.json();
      if (result.statusCode === 200) {
    
        message.success('City deleted successfully');
        fetchCities();
      } else {
        message.error('Failed to delete city');
      }
    } catch (error) {
      message.error('Error deleting city');
    }
  };

  const cityColumns = [
    {
      title: 'City ID',
      dataIndex: 'city_id',
      key: 'city_id',
    },
    {
      title: 'City Name',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: 'State',
      dataIndex: 'state_id',
      key: "state_id",
      render: (text: any) => <>{state_id}</>, // Add the image rendering logic here
    },
    {
      title: 'Latitude',
      dataIndex: 'city_latitude',
      key: 'city_latitude',
    },
    {
      title: 'Longitude',
      dataIndex: 'city_longitude',
      key: 'city_longitude',
    },
    {
      title: 'City Image',
      dataIndex: 'city_image_url',
      key: 'city_image_url',
      render: (text: any) => <img src={text} alt="City" style={{ width: '100px', height: 'auto' }} />, // Add the image rendering logic here
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <>
          <Button
            onClick={() => {
              setEditingCity(record);
              setIsCityModalOpen(true);
              form.setFieldsValue({
                city_name: record.city_name,
                city_latitude: record.city_latitude,
                city_longitude: record.city_longitude,
                city_image_url: record.city_image_url,
                state_id: record.state_id
              });
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteCity(record.city_id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Cities Management</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={() => {
            setIsCityModalOpen(true);
            form.resetFields();
            setEditingCity(null);
          }}

        >
          Add City
        </Button>
        <Input
        placeholder="Search by city"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: '200px' }}
      />
        <Table columns={cityColumns} dataSource={cities} rowKey="city_id"
          pagination={{
            current: page,

            total: totalPages, // Total number of items
          }}
          onChange={handleTableChange} />

        {/* Add/Edit City Modal */}
        <Modal
          title={editingCity ? 'Edit City' : 'Add City'}
          open={isCityModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsCityModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleAddOrUpdateCity}>
            <Form.Item
              name="city_name"
              label="City Name"
              rules={[{ required: true, message: 'Please enter a city name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city_latitude"
              label="City Latitude"
              rules={[{ required: true, message: 'Please enter the city latitude' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
  name="state_id"
  label="State"
  rules={[{ required: true, message: 'Please select a state' }]}
>
  <Select>
    {states.map((state: any) => (
      <Select.Option 
      placeholder="Select a state"
       key={state.state_id}
        value={state.state_id}>
        {state.state_name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
            <Form.Item
              name="city_longitude"
              label="City Longitude"
              rules={[{ required: true, message: 'Please enter the city longitude' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="city_image" label="City Image">
              <Upload beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CityManagement;
