"use client";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Search from "antd/es/transfer/search";
import { baseUrl } from "@/constant";
interface StateProps {
  params: {
    country_id: string;
  };
}
const RegionManagement: React.FC<StateProps> = ({ params }) => {
  const [states, setStates] = useState<any[]>([]);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<any | null>(null);
  const country_id = params.country_id; // Get country_id from URL params
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  const router = useRouter();

  const Token = localStorage.getItem("access_token"); // Fetch access token from local storage

  // Fetch states for the selected country
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
        console.log(data, "data");
        setTotalPages(data.totalPages);
        setStates(data.data);
      } else {
        message.error("Failed to fetch states");
      }
    } catch (error) {
      message.error("Error fetching states");
    }
  };

  useEffect(() => {
    fetchStates();
  }, [country_id]);
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchStates();
  };
  // Handle add or update state
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchStates(e.target.value);
  };
  const handleAddOrUpdateState = async (values: any) => {
    console.log(
      { state_name: values.state_name, country_id: parseInt(country_id) },
      "values",
    );
    const url = editingState
      ? `${baseUrl}/check-in/update-state`
      : `${baseUrl}/check-in/add-state`;

    const method = editingState ? "POST" : "POST";

    const payload = editingState
      ? {
          state_id: editingState.state_id,
          state_name: values.state_name,
          country_id: country_id,
        }
      : { state_name: values.state_name, country_id: parseInt(country_id) };
    console.log(url, method, payload, "url, method, payload");
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "TwillioAPI",
          accesstoken: `Bearer ${Token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(response);
      const result = await response.json();

      console.log(result, "result");
      if (result.statusCode === 201 || result.statusCode === 200) {
        message.success(
          editingState
            ? "State updated successfully"
            : "State added successfully",
        );
        fetchStates();
        setIsStateModalOpen(false);
        form.resetFields();
        setEditingState(null);
      } else {
        message.error("Failed to save state");
      }
    } catch (error) {
      message.error("Error saving state");
    }
  };

  // Handle delete state
  const handleDeleteState = async (state_id: number) => {
    try {
      const response = await fetch(
        "${baseUrl}/check-in/delete-state",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
          body: JSON.stringify({ state_id: `${state_id}` }),
        },
      );
      const result = await response.json();
      if (result.statusCode === 200) {
        message.success("State deleted successfully");
        fetchStates();
      } else {
        message.error("Failed to delete state");
      }
    } catch (error) {
      message.error("Error deleting state");
    }
  };
  const handleNavigateToCities = (state_id: number) => {
    router.push(`/region/${country_id}/${state_id}`);
  };
  const stateColumns = [
    {
      title: "State ID",
      dataIndex: "state_id",
      key: "state_id",
    },
    {
      title: "State Name",
      dataIndex: "state_name",
      key: "state_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <>
          <Button
            onClick={() => {
              setEditingState(record);
              setIsStateModalOpen(true);
              form.setFieldsValue({ state_name: record.state_name });
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteState(record.state_id)}>
            Delete
          </Button>
          <Button onClick={() => handleNavigateToCities(record.state_id)}>
            Add City
          </Button>
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-3xl font-bold">States Management</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={() => {
            setIsStateModalOpen(true);
            form.resetFields();
            setEditingState(null);
          }}
        >
          Add State
        </Button>
        <Input
          placeholder="Search by state name"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: "200px" }}
        />
        <Table
          columns={stateColumns}
          dataSource={states}
          rowKey="state_id"
          pagination={{
            current: page,
            pageSize: limit,

            total: totalPages * limit, // Total number of items
          }}
          onChange={handleTableChange}
        />

        {/* Add/Edit State Modal */}
        <Modal
          title={editingState ? "Edit State" : "Add State"}
          open={isStateModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsStateModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleAddOrUpdateState}>
            <Form.Item
              name="state_name"
              label="State Name"
              rules={[{ required: true, message: "Please enter a state name" }]}
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
