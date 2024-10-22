"use client";

import React, { useState } from "react";
import { Descriptions, Badge, Button, Avatar, Tag, Divider, Modal, Form, Input, DatePicker, Switch } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import moment from "moment";

interface UserDetails {
  userImage: string;
  userName: string;
  userID: string;
  status: "Online" | "Offline";
  currentCheckin: string;
  airline: string;
  airlineDocument: string;
  employeeExpiry: string;
  dob: string;
  postCount: number;
  bio: string;
  phoneNo: string;
  userSuspended: boolean;
  suspensionDays: number;
}

const UserDetailPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>({
    userImage: "https://via.placeholder.com/150",
    userName: "John Doe",
    userID: "USR12345",
    status: "Online",
    currentCheckin: "2024-10-22 09:15 AM",
    airline: "ABC Airlines",
    airlineDocument: "Employee Contract",
    employeeExpiry: "2024-12-31",
    dob: "1990-01-01",
    postCount: 42,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNo: "+1234567890",
    userSuspended: false,
    suspensionDays: 0,
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Function to handle editing a user
  const handleEditUser = () => {
    form.setFieldsValue({
      ...userDetails,
      dob: moment(userDetails?.dob),
      employeeExpiry: moment(userDetails?.employeeExpiry),
    });
    setEditModalOpen(true);
  };

  // Function to handle adding a new user
  const handleAddUser = () => {
    form.resetFields();
    setUserDetails(null);
    setAddModalOpen(true);
  };

  // Function to handle submitting the form (both for edit and add)
  const handleFormSubmit = (values: any) => {
    const updatedUser = {
      ...values,
      dob: values.dob.format("YYYY-MM-DD"),
      employeeExpiry: values.employeeExpiry.format("YYYY-MM-DD"),
    };
    setUserDetails(updatedUser);

    setEditModalOpen(false);
    setAddModalOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">User Details</h1>
        {userDetails ? (
          <Descriptions
            bordered
            column={1}
            size="middle"
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  size={100}
                  src={userDetails.userImage}
                  alt="User Image"
                  style={{ marginRight: "20px" }}
                />
                <div>
                  <h2>{userDetails.userName}</h2>
                  <Tag color={userDetails.status === "Online" ? "green" : "red"}>
                    {userDetails.status}
                  </Tag>
                </div>
              </div>
            }
          >
            <Descriptions.Item label="User ID">{userDetails.userID}</Descriptions.Item>
            <Descriptions.Item label="Current Check-in">
              {userDetails.currentCheckin}
            </Descriptions.Item>
            <Descriptions.Item label="Airline">{userDetails.airline}</Descriptions.Item>
            <Descriptions.Item label="Airline Document">
              {userDetails.airlineDocument}
            </Descriptions.Item>
            <Descriptions.Item label="Employee Expiry">
              {userDetails.employeeExpiry}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{userDetails.dob}</Descriptions.Item>
            <Descriptions.Item label="Post Count">{userDetails.postCount}</Descriptions.Item>
            <Descriptions.Item label="Bio">{userDetails.bio}</Descriptions.Item>
            <Descriptions.Item label="Phone No">{userDetails.phoneNo}</Descriptions.Item>
            <Descriptions.Item label="User Suspended">
              {userDetails.userSuspended ? (
                <Tag color="red">Yes</Tag>
              ) : (
                <Tag color="green">No</Tag>
              )}
            </Descriptions.Item>
            {userDetails.userSuspended && (
              <Descriptions.Item label="Suspension Days">
                {userDetails.suspensionDays}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <p>No user details available. Please add a user.</p>
        )}

        <Divider />

        <Button type="primary" onClick={handleEditUser} style={{ marginRight: "10px" }}>
          {userDetails ? "Edit User" : "Add User"}
        </Button>
        <Button type="primary" onClick={handleAddUser} style={{ marginRight: "10px" }}>
          Add New User
        </Button>

        {/* Edit User Modal */}
        <Modal
          title="Edit User"
          open={isEditModalOpen}
          onOk={form.submit}
          onCancel={() => setEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="userName" label="User Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userID" label="User ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="currentCheckin" label="Current Check-in">
              <Input />
            </Form.Item>
            <Form.Item name="airline" label="Airline">
              <Input />
            </Form.Item>
            <Form.Item name="airlineDocument" label="Airline Document">
              <Input />
            </Form.Item>
            <Form.Item name="employeeExpiry" label="Employee Expiry" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="postCount" label="Post Count">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="bio" label="Bio">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="phoneNo" label="Phone No" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userSuspended" label="User Suspended" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="suspensionDays" label="Suspension Days" rules={[{ required: false }]}>
              <Input type="number" disabled={!form.getFieldValue("userSuspended")} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Add User Modal */}
        <Modal
          title="Add User"
          open={isAddModalOpen}
          onOk={form.submit}
          onCancel={() => setAddModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="userName" label="User Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userID" label="User ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="currentCheckin" label="Current Check-in">
              <Input />
            </Form.Item>
            <Form.Item name="airline" label="Airline">
              <Input />
            </Form.Item>
            <Form.Item name="airlineDocument" label="Airline Document">
              <Input />
            </Form.Item>
            <Form.Item name="employeeExpiry" label="Employee Expiry" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="postCount" label="Post Count">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="bio" label="Bio">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="phoneNo" label="Phone No" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userSuspended" label="User Suspended" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="suspensionDays" label="Suspension Days" rules={[{ required: false }]}>
              <Input type="number" disabled={!form.getFieldValue("userSuspended")} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default UserDetailPage;
