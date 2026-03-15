# Layout Components & UI System

Bộ layout components hoàn chỉnh cho ứng dụng Waste Recycling Platform với theme **Vàng (Amber) & Trắng**.

## 🎨 Color Scheme

**Primary Color: Amber/Yellow** (Eco-friendly theme)

- Màu này tuyệt vời cho một platform liên quan tới môi trường và tái chế
- Tượng trưng cho sự tự nhiên, năng lượng, và sự lạc quan

| Shade | Color       | Hex     |
| ----- | ----------- | ------- |
| 50%   | Rất nhạt    | #fffbeb |
| 100%  | Nhạt        | #fef3c7 |
| 400%  | Trung bình  | #fbbf24 |
| 600%  | **Primary** | #d97706 |
| 900%  | Đậm         | #78350f |

**Secondary Color: Emerald Green** (Nature theme)

- Bổ sung cho primary
- Dùng cho success, actions tích cực

**Background: White** (Trắng sạch)

- #ffffff

---

## 📦 Components

### 1. **Navbar**

Navigation bar sticky ở top, responsive cho mobile.

```tsx
import { Navbar } from "@/components/layout";

<Navbar
  brandName="Waste Recycling"
  menuItems={[
    { label: "Home", href: "/" },
    { label: "Report Waste", href: "/report" },
    { label: "Rewards", href: "/rewards" },
  ]}
  userMenu={<UserDropdown />}
  sticky
/>;
```

**Features:**

- Logo + Brand name
- Desktop menu items
- Mobile hamburger menu
- User menu dropdown
- Sticky positioning

---

### 2. **Sidebar**

Side navigation với collapsible submenu.

```tsx
import { Sidebar } from "@/components/layout";

<Sidebar
  items={[
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <TaskIcon />,
      badge: 5,
    },
    {
      label: "Settings",
      href: "/settings",
      children: [
        { label: "Profile", href: "/settings/profile" },
        { label: "Security", href: "/settings/security" },
      ],
    },
  ]}
  footer={<SidebarFooter />}
/>;
```

**Features:**

- Collapsible submenu
- Badge support
- Custom footer
- Mobile responsive (overlay mode)
- Smooth animations

---

### 3. **Footer**

Footer dengan company info, links, dan social media.

```tsx
import { Footer } from "@/components/layout";

<Footer
  companyName="Waste Recycling Platform"
  year={2026}
  links={[
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]}
  social={[
    { name: "Facebook", href: "#", icon: <FacebookIcon /> },
    { name: "Twitter", href: "#", icon: <TwitterIcon /> },
  ]}
/>;
```

---

### 4. **Layout** (Wrapper)

Combines Navbar, Sidebar, Footer vào một layout hoàn chỉnh.

```tsx
import { Layout } from '@/components/layout';

<Layout
  navbar={{ menuItems: [...] }}
  sidebar={{ items: [...] }}
  footer={{ companyName: 'Waste Recycling' }}
>
  {/* Page content here */}
</Layout>
```

---

## 🎁 Additional UI Components

### Avatar

Hiển thị avatar user.

```tsx
import { Avatar } from '@/components/ui';

<Avatar src="/avatar.png" alt="User" size="md" />
<Avatar initials="JD" size="lg" />
```

### Toast Notifications

Toast messages with auto-dismiss.

```tsx
import { useToast } from "@/components/ui";

const { addToast } = useToast();

addToast("Operation successful!", "success");
addToast("An error occurred", "error");
addToast("Warning message", "warning");
```

### Dropdown Menu

Context menu dropdown.

```tsx
import { Dropdown } from "@/components/ui";

<Dropdown
  trigger={<button>Menu</button>}
  items={[
    { label: "Edit", onClick: () => {} },
    { label: "Delete", onClick: () => {}, danger: true },
    { divider: true },
    { label: "Share", onClick: () => {} },
  ]}
/>;
```

### EmptyState

Hiển thị khi không có data.

```tsx
import { EmptyState } from "@/components/ui";

<EmptyState
  icon="📭"
  title="No tasks found"
  description="Create your first task to get started"
  action={<Button>Create Task</Button>}
/>;
```

### Progress Bar

Progress indicator.

```tsx
import { Progress } from "@/components/ui";

<Progress value={65} max={100} showLabel color="amber" />;
```

---

## 🏗️ Example Full Page Layout

```tsx
"use client";

import { Navbar, Sidebar, Footer, Layout } from "@/components/layout";
import { Button, useToast } from "@/components/ui";

export default function DashboardPage() {
  const { addToast } = useToast();

  return (
    <Layout
      navbar={{
        brandName: "♻️ Waste Recycling",
        menuItems: [
          { label: "Home", href: "/" },
          { label: "Reports", href: "/reports" },
          { label: "Rewards", href: "/rewards" },
        ],
      }}
      sidebar={{
        items: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Tasks", href: "/tasks" },
          { label: "My Reports", href: "/reports" },
        ],
      }}
      footer={{
        companyName: "Waste Recycling Platform",
      }}
      showSidebar={true}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>

        <Button onClick={() => addToast("Task created!", "success")}>
          Create New Task
        </Button>
      </div>
    </Layout>
  );
}
```

---

## 🎨 Styling & Customization

Tất cả components dùng **Tailwind CSS** nên có thể dễ dàng customize:

```tsx
// Custom styling
<Button className="rounded-full shadow-xl">
  Custom Button
</Button>

<Card className="border-2 border-amber-300">
  <Card.Body>Custom Card</Card.Body>
</Card>
```

---

## 📱 Responsive Design

Tất cả components hoàn toàn responsive:

- **Mobile**: Stack vertically, hamburger menu
- **Tablet**: Adjusted spacing
- **Desktop**: Full layout

---

## 🪝 Custom Hooks

### useToast()

Quản lý notifications.

```tsx
const { addToast, removeToast, toasts } = useToast();

// Auto-dismiss: success (4s), error (6s), others (4s)
addToast("Success message", "success");
addToast("Error message", "error");

// Manual remove
removeToast(toastId);
```

### useForm()

Quản lý form state và validation.

```tsx
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: "" },
  validate: (v) => {
    const err = {};
    if (!v.email) err.email = "Required";
    return err;
  },
  onSubmit: async (values) => {
    await api.submit(values);
  },
});
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout with ToastProvider
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (citizen)/
│   │   ├── reports/
│   │   └── rewards/
│   ├── (collector)/
│   │   └── tasks/
│   ├── (enterprise)/
│   │   ├── reports/
│   │   └── tasks/
│   └── (admin)/
│       └── users/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Spinner.tsx
│   │   ├── Pagination.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Progress.tsx
│   │   ├── Toast.tsx
│   │   ├── README.md
│   │   └── index.ts
│   ├── shared/
│   ├── report/
│   ├── reward/
│   ├── task/
│   └── map/
├── lib/
│   ├── api.ts
│   └── theme.ts
├── hooks/
│   └── useForm.ts
├── types/
│   └── api.ts
└── store/
```

---

## 💡 Best Practices

1. **Always wrap app with ToastProvider**

   ```tsx
   // app/layout.tsx
   import { ToastProvider } from "@/components/ui";

   export default function RootLayout({ children }) {
     return <ToastProvider>{children}</ToastProvider>;
   }
   ```

2. **Use Layout component for main pages**

   ```tsx
   // All pages should use Layout for consistency
   <Layout navbar={...} sidebar={...}>
     {content}
   </Layout>
   ```

3. **Import from barrel exports**

   ```tsx
   // ✅ Good
   import { Button, Input, Modal } from "@/components/ui";
   import { Navbar, Layout } from "@/components/layout";

   // ❌ Avoid relative imports
   import { Button } from "@/components/ui/Button";
   ```

4. **Customize with className**
   ```tsx
   <Button className="custom-class">Button with custom styling</Button>
   ```

---

## 🚀 Getting Started

1. Import Layout at top level
2. Add nested page content
3. Use UI components for forms and data display
4. Use Toasts for notifications

**Everything is ready to use!** 🎉
