"use client";
import { Table, Button, Modal, Form, Input, message, Avatar } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { parse } from "path";

const UserReporting = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendUserId, setSuspendUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [form] = Form.useForm();

  const Token = localStorage.getItem("access_token"); // Fetch access token from local storage

  // Fetch all reported users
  let limit = 100;
  const fetchReportedUsers = async (search: string = "") => {
    try {
      const response = await fetch(
        `https://crewlink.development.logomish.com/users/get-all-users-admin/${page}/${limit}?search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data, "data");

      if (data && data.data) {
        setTotalPages(data.totalPages);
        setReports(data.data);
      } else {
        message.error("Failed to fetch reported users");
      }
    } catch (error) {
      message.error("Error fetching reported users");
    }
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  // Handle suspend user
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchReportedUsers();
  };
  const handleSuspendUser = async (values: any) => {
    const suspendDays = values.suspendDays;
    console.log(suspendUserId, suspendDays, "suspendUserId, suspendDays");

    try {
      const response = await fetch(
        "https://crewlink.development.logomish.com/users/suspend-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
          body: JSON.stringify({
            user_id: suspendUserId,
            suspendDays: parseInt(suspendDays),
          }),
        },
      );
      const result = await response.json();
      console.log(result, "result");
      if (result.statusCode === 200) {
        message.success(`User suspended for ${suspendDays} days`);
        setIsSuspendModalOpen(false);
        form.resetFields();
        fetchReportedUsers();
      } else {
        message.error("Failed to suspend user");
      }
    } catch (error) {
      message.error("Error suspending user");
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchReportedUsers(e.target.value);
  };

  const handleUnSuspendUser = async (values: any) => {
    const suspendDays = values.suspendDays;
    console.log(suspendUserId, suspendDays, "suspendUserId, suspendDays");

    try {
      const response = await fetch(
        "https://crewlink.development.logomish.com/users/un-suspend-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
          body: JSON.stringify({
            user_id: suspendUserId,
          }),
        },
      );
      const result = await response.json();
      console.log(result, "result");
      if (result.statusCode === 200) {
        message.success(`User Unsuspended`);
        // setIsSuspendModalOpen(false);
        // form.resetFields();
        fetchReportedUsers();
      } else {
        message.error("Failed to suspend user");
      }
    } catch (error) {
      message.error("Error suspending user");
    }
  };

  // Open suspend modal
  const openSuspendModal = (userId: number) => {
    console.log(userId, "userId");
    setSuspendUserId(userId);
    setIsSuspendModalOpen(true);
  };

  // Columns for the Ant Design table
  const columns = [
    {
      title: "User",
      key: "reportedUser",
      render: (text: any, record: any) => (
        <>
          <Avatar src={record?.profile_picture_url} />
          <span style={{ marginLeft: 8 }}>{record?.user_name}</span>
        </>
      ),
    },
    {
      title: "Email",

      key: "email",
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.email}</span>
        </>
      ),
    },
    {
      title: "Post Count",
      key: "postCount",
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.post_count}</span>
        </>
      ),
    },
    {
      title: "Airline ",
      key: "airline",
      render: (text: any, record: any) => (
        <>
          {/* <Avatar src={record.reporter.profile_picture_url} /> */}
          <span style={{ marginLeft: 8 }}>{record.airline}</span>
        </>
      ),
    },
    {
      title: "Suspension Status",
      key: "actions",
      render: (text: any, record: any) =>
        record.suspended_flag == "N" ? (
          <h4>User Not Suspended</h4>
        ) : (
          <h4>User Suspended for {record.suspend_days} days</h4>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) =>
        record.suspended_flag == "N" ? (
          <Button onClick={() => openSuspendModal(record.user_id)}>
            Suspend User
          </Button>
        ) : (
          <Button onClick={() => handleUnSuspendUser(record.user_id)}>
            Unsuspend User
          </Button>
        ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-3xl font-bold">User Management</h1>
        <Input
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: "200px" }}
        />
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="report_id"
          pagination={{
            current: page,

            total: totalPages, // Total number of items
          }}
          onChange={handleTableChange}
        />

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
              rules={[
                {
                  required: true,
                  message: "Please enter the number of suspension days",
                },
              ]}
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
