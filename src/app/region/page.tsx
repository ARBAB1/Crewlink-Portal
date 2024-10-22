"use client";

import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';

interface Country {
  countryId: number;
  countryName: string;
  countryCode: string;
}

interface State {
  stateId: number;
  countryCode: string;
  stateName: string;
}

interface City {
  cityId: number;
  stateId: number;
  countryCode: string;
  cityName: string;
}

const RegionManagement: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const [form] = Form.useForm();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  const handleAddCountry = (values: Country) => {
    const newCountry: Country = {
      countryId: generateId(), // Assign unique ID only once
      countryName: values.countryName,
      countryCode: values.countryCode,
    };
    setCountries([...countries, newCountry]);
    setIsCountryModalOpen(false);
    message.success('Country added successfully');
  };

  const handleAddState = (values: State) => {
    const newState: State = {
      stateId: generateId(), // Assign unique ID only once
      countryCode: values.countryCode,
      stateName: values.stateName,
    };
    setStates([...states, newState]);
    setIsStateModalOpen(false);
    message.success('State added successfully');
  };

  const handleAddCity = (values: City) => {
    const newCity: City = {
      cityId: generateId(), // Assign unique ID only once
      stateId: values.stateId,
      countryCode: values.countryCode,
      cityName: values.cityName,
    };
    setCities([...cities, newCity]);
    setIsCityModalOpen(false);
    message.success('City added successfully');
  };

  const countryColumns = [
    {
      title: 'Country ID',
      dataIndex: 'countryId',
      key: 'countryId',
    },
    {
      title: 'Country Name',
      dataIndex: 'countryName',
      key: 'countryName',
    },
    {
      title: 'Country Code',
      dataIndex: 'countryCode',
      key: 'countryCode',
    },
  ];

  const stateColumns = [
    {
      title: 'State ID',
      dataIndex: 'stateId',
      key: 'stateId',
    },
    {
      title: 'State Name',
      dataIndex: 'stateName',
      key: 'stateName',
    },
    {
      title: 'Country Code',
      dataIndex: 'countryCode',
      key: 'countryCode',
    },
  ];

  const cityColumns = [
    {
      title: 'City ID',
      dataIndex: 'cityId',
      key: 'cityId',
    },
    {
      title: 'City Name',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: 'State ID',
      dataIndex: 'stateId',
      key: 'stateId',
    },
    {
      title: 'Country Code',
      dataIndex: 'countryCode',
      key: 'countryCode',
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Region Management</h1>

        {/* Country Table and Modal */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setIsCountryModalOpen(true)}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Country
        </Button>
        <Table columns={countryColumns} dataSource={countries} rowKey="countryId" />

        <Modal
          title="Add Country"
          open={isCountryModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsCountryModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleAddCountry}>
            <Form.Item name="countryName" label="Country Name" rules={[{ required: true, message: 'Please enter a country name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="countryCode" label="Country Code" rules={[{ required: true, message: 'Please enter a country code' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* State Table and Modal */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setIsStateModalOpen(true)}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add State
        </Button>
        <Table columns={stateColumns} dataSource={states} rowKey="stateId" />

        <Modal
          title="Add State"
          open={isStateModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsStateModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleAddState}>
            <Form.Item name="stateName" label="State Name" rules={[{ required: true, message: 'Please enter a state name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="countryCode" label="Country Code" rules={[{ required: true, message: 'Please select a country' }]}>
              <Select placeholder="Select Country">
                {countries.map((country) => (
                  <Select.Option key={country.countryCode} value={country.countryCode}>
                    {country.countryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* City Table and Modal */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setIsCityModalOpen(true)}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add City
        </Button>
        <Table columns={cityColumns} dataSource={cities} rowKey="cityId" />

        <Modal
          title="Add City"
          open={isCityModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsCityModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleAddCity}>
            <Form.Item name="cityName" label="City Name" rules={[{ required: true, message: 'Please enter a city name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="stateId" label="State" rules={[{ required: true, message: 'Please select a state' }]}>
              <Select placeholder="Select State" onChange={(value) => setSelectedState(value)}>
                {states.map((state) => (
                  <Select.Option key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Country">
              <Input value={selectedState ? states.find((s) => s.stateId === selectedState)?.countryCode : ''} disabled />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default RegionManagement;
