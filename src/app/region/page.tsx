"use client";

import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface Country {
  country_id: number;
  country_name: string;
  countryCode: string;
}

interface StateType {
  stateId: number;
  countryCode: string;
  stateName: string;
}

interface City {
  cityId: number;
  stateId: number;
  cityName: string;
}

const RegionManagement: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingState, setEditingState] = useState<StateType | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [form] = Form.useForm();

  const router = useRouter();
  const token = localStorage.getItem('access_token');

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch('https://sn1pgw0k-6000.inc1.devtunnels.ms/check-in/get-all-countries-portal', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setCountries(data.data);
      } else {
        message.error('Failed to fetch countries');
      }
    } catch (error) {
      message.error('An error occurred while fetching countries');
    }
  };

  // Fetch states


  useEffect(() => {
    fetchCountries();

  }, []);

  // CRUD operations for Countries
  const handleAddCountry = async (values: Country) => {
    try {
      const response = await fetch('https://sn1pgw0k-6000.inc1.devtunnels.ms/check-in/add-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({ country_name: values.country_name })
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Country added successfully');
        fetchCountries();
      } else {
        message.error('Failed to add country');
      }
    } catch (error) {
      message.error('An error occurred while adding the country');
    }
    setIsCountryModalOpen(false);
    form.resetFields();
  };

  const handleEditCountry = (country: Country) => {
    setIsEditMode(true);
    setEditingCountry(country);
    setIsCountryModalOpen(true);
    form.setFieldsValue({
      country_name: country.country_name,
    });
  };

  const handleUpdateCountry = async (values: Country) => {
    console.log(editingCountry?.country_id, editingCountry?.country_name, values.country_name)
    try {
      const response = await fetch('https://sn1pgw0k-6000.inc1.devtunnels.ms/check-in/update-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({
          country_id: `${editingCountry?.country_id}`,
          country_name: values.country_name,
        })
      });
      if (response.ok) {
        message.success('Country updated successfully');
        fetchCountries();
      } else {
        message.error('Failed to update country');
      }
    } catch (error) {
      message.error('An error occurred while updating the country');
    }
    setIsCountryModalOpen(false);
    setIsEditMode(false);
    setEditingCountry(null);
    form.resetFields();
  };

  const handleDeleteCountry = async (country_id: number) => {
    console.log(country_id)
    try {
      const response = await fetch('https://sn1pgw0k-6000.inc1.devtunnels.ms/check-in/delete-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TwillioAPI',
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify(
          {country_id: country_id }
        )
      });
      console.log(response)
      if (response.ok) {
        message.success('Country deleted successfully');
        fetchCountries();
      } else {
        message.error('Failed to delete country');
      }
    } catch (error) {
      message.error('An error occurred while deleting the country');
    }
  };
  const handleNavigateToStates = (country_id: number) => {
    router.push(`/region/${country_id}`); // Navigate to the states page with country_id
  };

  const countryColumns = [
    { title: 'Country ID', dataIndex: 'country_id', key: 'country_id' },
    { title: 'Country Name', dataIndex: 'country_name', key: 'country_name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Country) => (
        <>
          <Button type="link" onClick={() => handleEditCountry(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteCountry(record.country_id)}>Delete</Button>
          <Button type="link" danger onClick={() => handleNavigateToStates(record.country_id)}>Add State</Button>
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Region Management</h1>

        {/* Country Management */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => {
            setIsEditMode(false);
            setIsCountryModalOpen(true);
          }}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Country
        </Button>
        <Table columns={countryColumns} dataSource={countries} rowKey="country_id" />
        <Modal
          title={isEditMode ? "Edit Country" : "Add Country"}
          open={isCountryModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsCountryModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={isEditMode ? handleUpdateCountry : handleAddCountry}
          >
            <Form.Item
              name="country_name"
              label="Country Name"
              rules={[{ required: true, message: 'Please enter a country name' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default RegionManagement;
