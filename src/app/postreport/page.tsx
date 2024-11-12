"use client";
import { Table, Button, Modal, message, Avatar, Input } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";

const PostReporting = () => {
  const [postReports, setPostReports] = useState<any[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const Token = localStorage.getItem("access_token"); // Fetch access token from local storage
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  // Fetch post reports
  const fetchPostReports = async (search: string = "") => {
    try {
      const response = await fetch(
        `https://crewlink.development.logomish.com/report/get-all-reported-posts/${page}/${limit}?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      if (data.data) {
        setTotalPages(data.totalPages);
        setPostReports(data.data);
      } else {
        message.error("Failed to fetch post reports");
      }
    } catch (error) {
      message.error("Error fetching post reports");
    }
  };

  useEffect(() => {
    fetchPostReports();
  }, []);

  // Handle delete post report
  const handleDeletePostReport = async (post_id: number) => {
    try {
      const response = await fetch(
        "https://crewlink.development.logomish.com/report/delete-reported-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
          body: JSON.stringify({ post_id }),
        },
      );
      const result = await response.json();
      if (result.statusCode === 200) {
        message.success("Post report deleted successfully");
        fetchPostReports();
      } else {
        message.error("Failed to delete post report");
      }
    } catch (error) {
      message.error("Error deleting post report");
    }
  };
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    fetchPostReports();
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchPostReports(e.target.value);
  };
  // Handle view post details in modal
  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  // Columns for the table
  const postColumns = [
    {
      title: "Post ID",
      dataIndex: ["reportedPost", "post_id"],
      key: "post_id",
    },
    {
      title: "View Post",
      key: "viewPost",
      render: (text: any, record: any) => (
        <Button onClick={() => handleViewPost(record.reportedPost)}>
          View Post
        </Button>
      ),
    },
    {
      title: "Reported By",
      key: "reported_by",
      render: (text: any, record: any) => (
        <>
          <Avatar
            src={record.reported_by.profile_picture_url}
            alt={record.reported_by.user_name}
          />
          <span style={{ marginLeft: 8 }}>{record.reported_by.user_name}</span>
        </>
      ),
    },
    {
      title: "Complain",
      dataIndex: ["reportDetails", "report_reason"],
      key: "report_reason",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Button
          danger
          onClick={() => handleDeletePostReport(record.reportedPost.post_id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-3xl font-bold">Post Reporting Management</h1>
        <Input
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: "200px" }}
        />

        <Table
          columns={postColumns}
          dataSource={postReports}
          rowKey={(record) => record.reportedPost.post_id}
          pagination={{
            current: page,

            total: totalPages, // Total number of items
          }}
          onChange={handleTableChange}
        />

        {/* Post Details Modal */}
        {selectedPost && (
          <Modal
            title={`Post by ${selectedPost.postOwnerDetails.user_name}`}
            open={isPostModalOpen}
            onCancel={() => setIsPostModalOpen(false)}
            footer={null}
          >
            <div>
              <Avatar
                src={selectedPost.postOwnerDetails.profile_picture_url}
                alt={selectedPost.postOwnerDetails.user_name}
                size={64}
              />
              <h3>{selectedPost.postOwnerDetails.user_name}</h3>
              <img
                src={selectedPost.attachments[0]?.attachment_url}
                alt="Post Attachment"
                style={{ width: "100%", marginTop: 16 }}
              />
              <p style={{ marginTop: 16 }}>
                <strong>Created At:</strong>{" "}
                {new Date(selectedPost.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Post City:</strong> {selectedPost.post_city}
              </p>
            </div>
          </Modal>
        )}
      </div>
    </DefaultLayout>
  );
};

export default PostReporting;
