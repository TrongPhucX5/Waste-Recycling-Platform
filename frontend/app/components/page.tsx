"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Badge,
  Alert,
  Table,
  Modal,
  Select,
  Spinner,
  Pagination,
  Avatar,
  Dropdown,
  EmptyState,
  Progress,
  useToast,
} from "@/components/ui";
import { Layout } from "@/components/layout";
import {
  ReportCard,
  TaskCard,
  RewardCard,
  CollectorCard,
  EnterpriseCard,
  StatCard,
  UserProfileCard,
} from "@/components/shared";

const DEMO_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "active" },
];

export default function ComponentShowcasePage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ email: "", name: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: "name" as const, label: "Name", width: "30%" },
    { key: "email" as const, label: "Email", width: "40%" },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "default"}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <Layout
      navbar={{
        brandName: "♻️ Waste Recycling Components",
        menuItems: [
          { label: "Components", href: "/components" },
          { label: "Documentation", href: "/docs" },
        ],
      }}
      footer={{
        companyName: "Waste Recycling Platform",
      }}
    >
      <div className="space-y-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Component Showcase
          </h1>
          <p className="text-gray-600">
            All available UI components for the Waste Recycling Platform
          </p>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Buttons</h2>
          <Card>
            <Card.Body>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Forms Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Forms</h2>
          <Card>
            <Card.Body className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                label="Name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Select
                label="Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <Button onClick={() => addToast("Form submitted!", "success")}>
                Submit Form
              </Button>
            </Card.Body>
          </Card>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Badges</h2>
          <Card>
            <Card.Body className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="default">Default</Badge>
            </Card.Body>
          </Card>
        </section>

        {/* Alerts Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Alerts</h2>
          <Card>
            <Card.Body className="space-y-4">
              <Alert
                variant="success"
                title="Success!"
                message="Your changes have been saved successfully."
                dismissible={false}
              />
              <Alert
                variant="error"
                title="Error"
                message="Something went wrong. Please try again."
                dismissible={false}
              />
              <Alert
                variant="warning"
                title="Warning"
                message="Please review your input before proceeding."
                dismissible={false}
              />
              <Alert
                variant="info"
                title="Information"
                message="New updates are available."
                dismissible={false}
              />
            </Card.Body>
          </Card>
        </section>

        {/* Avatar Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Avatars</h2>
          <Card>
            <Card.Body className="flex gap-8">
              <Avatar initials="JD" size="sm" />
              <Avatar initials="AB" size="md" />
              <Avatar initials="CD" size="lg" />
              <Avatar initials="EF" size="xl" />
            </Card.Body>
          </Card>
        </section>

        {/* Table Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Table</h2>
          <Card>
            <Card.Body>
              <Table columns={columns} data={DEMO_USERS} />
            </Card.Body>
          </Card>
        </section>

        {/* Progress Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress</h2>
          <Card>
            <Card.Body className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Amber Progress</p>
                <Progress value={65} max={100} showLabel color="amber" />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Green Progress</p>
                <Progress value={80} max={100} showLabel color="green" />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Blue Progress</p>
                <Progress value={45} max={100} showLabel color="blue" />
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Pagination Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pagination</h2>
          <Card>
            <Card.Body>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </Card.Body>
          </Card>
        </section>

        {/* Modal Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Modal</h2>
          <Card>
            <Card.Body>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={isModalOpen}
                title="Confirm Action"
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                  addToast("Action confirmed!", "success");
                  setIsModalOpen(false);
                }}
              >
                <p className="text-gray-700">
                  Are you sure you want to proceed with this action?
                </p>
              </Modal>
            </Card.Body>
          </Card>
        </section>

        {/* Spinner Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Spinners</h2>
          <Card>
            <Card.Body className="flex gap-8">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" color="amber" />
            </Card.Body>
          </Card>
        </section>

        {/* Empty State Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Empty State</h2>
          <Card>
            <Card.Body>
              <EmptyState
                icon="📦"
                title="No Items Found"
                description="There are no items to display. Create one to get started."
                action={<Button>Create Item</Button>}
              />
            </Card.Body>
          </Card>
        </section>

        {/* Toasts Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Toast Notifications
          </h2>
          <Card>
            <Card.Body className="flex flex-wrap gap-2">
              <Button onClick={() => addToast("Success message!", "success")}>
                Success Toast
              </Button>
              <Button onClick={() => addToast("Error occurred!", "error")}>
                Error Toast
              </Button>
              <Button onClick={() => addToast("Warning!", "warning")}>
                Warning Toast
              </Button>
              <Button onClick={() => addToast("Info message", "info")}>
                Info Toast
              </Button>
            </Card.Body>
          </Card>
        </section>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Feature-Specific Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <ReportCard
              id="1"
              title="Mixed Plastic Waste"
              description="Found a pile of plastic bottles and bags near the park"
              location="Central Park"
              wasteType="Plastic"
              status="pending"
              createdAt="2024-03-13"
              points={50}
            />
            <TaskCard
              id="1"
              title="Collect Plastic Bottles"
              description="Collect plastic bottles from the downtown area"
              location="Downtown District"
              status="in_progress"
              priority="high"
              dueDate="2024-03-15"
              reward={100}
              assignedTo="John Collector"
            />
            <RewardCard
              id="1"
              name="Eco Bag"
              description="Reusable shopping bag made from recycled materials"
              points={200}
              currentPoints={150}
              category="Accessories"
              available={true}
              stock={45}
            />
            <CollectorCard
              id="1"
              name="Alex Johnson"
              rating={4.8}
              completedTasks={156}
              reviews={89}
              location="Downtown Area"
              status="available"
              responseTime="5 mins"
            />
            <EnterpriseCard
              id="1"
              name="Green Logistics Inc"
              description="Professional waste management and recycling services"
              serviceArea="City Center"
              status="active"
              tasksPosted={45}
              rating={4.5}
              contactEmail="contact@greenlogistics.com"
              contactPhone="+1-555-0123"
            />
            <StatCard
              icon="♻️"
              label="Total Reports"
              value={1234}
              color="amber"
            />
          </div>

          {/* Profile & Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <UserProfileCard
              name="Sarah Williams"
              avatar=""
              role="citizen"
              email="sarah@example.com"
              phone="+1-555-0456"
              joinedDate="2023-06-15"
              stats={[
                { label: "Reports", value: 12 },
                { label: "Points Earned", value: 850 },
                { label: "Rewards", value: 3 },
              ]}
              badges={["Eco Warrior", "Top Reporter"]}
              verified={true}
            />
            <div className="space-y-4">
              <StatCard
                icon="📊"
                label="Total Waste Collected"
                value="2.5T"
                unit="tons"
                color="green"
                trend="up"
                trendValue="12% this month"
              />
              <StatCard
                icon="⭐"
                label="Average Rating"
                value="4.7"
                color="amber"
                trend="neutral"
                trendValue="from 523 reviews"
              />
              <StatCard
                icon="🏆"
                label="Points Available"
                value="850"
                color="blue"
                trend="up"
                trendValue="+150 this week"
              />
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Color Palette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Colors */}
            <Card>
              <Card.Header>
                <h3 className="font-semibold">Primary (Amber)</h3>
              </Card.Header>
              <Card.Body className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-amber-50 rounded border" />
                  <span className="text-sm text-gray-600">50 #fffbeb</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-amber-600 rounded" />
                  <span className="text-sm text-gray-600">
                    600 #d97706 (Primary)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-amber-900 rounded" />
                  <span className="text-sm text-gray-600">900 #78350f</span>
                </div>
              </Card.Body>
            </Card>

            {/* Secondary Colors */}
            <Card>
              <Card.Header>
                <h3 className="font-semibold">Secondary (Green)</h3>
              </Card.Header>
              <Card.Body className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-green-50 rounded border" />
                  <span className="text-sm text-gray-600">50 #f0fdf4</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-green-600 rounded" />
                  <span className="text-sm text-gray-600">600 #16a34a</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-green-900 rounded" />
                  <span className="text-sm text-gray-600">900 #145231</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        </section>

        {/* Footer Spacing */}
        <div className="py-8" />
      </div>
    </Layout>
  );
}
