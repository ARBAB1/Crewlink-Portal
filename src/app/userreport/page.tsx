"use client";
import { Table, Button, Modal, Form, Input, message, Avatar } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { parse } from "path";

const UserReporting = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendUserId, setSuspendUserId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const Token = localStorage.getItem("access_token"); // Fetch access token from local storage
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  // Fetch all reported users
  const fetchReportedUsers = async (search: string = "") => {
    try {
      const response = await fetch(
        `https://crewlink.development.logomish.com/report/get-all-reported-users/${page}/${limit}?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      setTotalPages(data.totalPages);
      if (data && data.data) {
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
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchReportedUsers();
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchReportedUsers(e.target.value);
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
      title: "Reported User",
      key: "reportedUser",
      render: (text: any, record: any) => (
        <>
          <Avatar src={record.reportedUser.profile_picture_url} />
          <span style={{ marginLeft: 8 }}>{record.reportedUser.user_name}</span>
        </>
      ),
    },
    {
      title: "Reported User ID",
      dataIndex: ["reportedUser", "user_id"],
      key: "reportedUserId",
    },
    {
      title: "Reporter",
      key: "reporter",
      render: (text: any, record: any) => (
        <>
          <Avatar src={record.reporter.profile_picture_url} />
          <span style={{ marginLeft: 8 }}>{record.reporter.user_name}</span>
        </>
      ),
    },
    {
      title: "Complain",
      dataIndex: ["reportDetails", "report_reason"],
      key: "complain",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Button onClick={() => openSuspendModal(record.reportedUser.user_id)}>
          Suspend User
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-3xl font-bold">User Reporting</h1>
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
