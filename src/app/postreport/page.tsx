"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Space, message, Input } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface PostReport {
  postId: string;
  postTitle: string;
  description: string;
  mediaType: "image" | "video" | "text";
  postOwnerId: string;
  postOwnerName: string;
  complaint: string;
}

const initialReports: PostReport[] = [
  {
    postId: "1",
    postTitle: "Post Title 1",
    description: "Description for post 1",
    mediaType: "image",
    postOwnerId: "123",
    postOwnerName: "John Doe",
    complaint: "Inappropriate content",
  },
  {
    postId: "2",
    postTitle: "Post Title 2",
    description: "Description for post 2",
    mediaType: "text",
    postOwnerId: "124",
    postOwnerName: "Jane Smith",
    complaint: "Spam",
  },
];

const PostReportManagement: React.FC = () => {
  const [reports, setReports] = useState<PostReport[]>(initialReports);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PostReport | null>(null);

  const handleDelete = (report: PostReport) => {
    setSelectedReport(report);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      setReports(reports.filter((report) => report.postId !== selectedReport.postId));
      message.success("Post deleted successfully.");
      setDeleteModalVisible(false);
      setSelectedReport(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedReport(null);
  };

  const columns = [
    {
      title: "Post ID",
      dataIndex: "postId",
      key: "postId",
    },
    {
      title: "Post Title",
      dataIndex: "postTitle",
      key: "postTitle",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Media Type",
      dataIndex: "mediaType",
      key: "mediaType",
      render: (mediaType: "image" | "video" | "text") => (
        <span>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</span>
      ),
    },
    {
      title: "Post Owner ID",
      dataIndex: "postOwnerId",
      key: "postOwnerId",
    },
    {
      title: "Post Owner Name",
      dataIndex: "postOwnerName",
      key: "postOwnerName",
    },
    {
      title: "Complaint",
      dataIndex: "complaint",
      key: "complaint",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, report: PostReport) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => handleDelete(report)}>
            Delete Post
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Post Report Management</h1>
        <Table columns={columns} dataSource={reports} rowKey="postId" />

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Post"
          visible={isDeleteModalVisible}
          onOk={confirmDelete}
          onCancel={handleCancelDelete}
          okButtonProps={{ danger: true }}
          okText="Delete"
        >
          <p>Are you sure you want to delete this post?</p>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default PostReportManagement;
