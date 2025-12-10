'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { ApolloWrapper } from '../lib/apollo-client';
import axios from 'axios';

// --- GraphQL Queries & Mutations ---

const GET_MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      serviceType
      weight
      price
      status
      createdAt
      notes
    }
  }
`;

const GET_ALL_ORDERS = gql`
  query GetAllOrders($status: OrderStatus) {
    orders(status: $status) {
      id
      customerName
      serviceType
      weight
      price
      status
      createdAt
      notes
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription OnOrderStatusUpdated($customerId: ID!) {
    orderStatusUpdated(customerId: $customerId) {
      id
      status
    }
  }
`;

// --- Components ---

function LoginForm({ onLogin }: { onLogin: (user: any, token: string) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      // Use local proxy if available, or direct to gateway URL
      const url = `http://localhost:3000${endpoint}`;

      const payload = isRegister ? { email, password, name, role: 'CUSTOMER' } : { email, password };

      const res = await axios.post(url, payload);

      if (isRegister) {
        alert('Registered successfully! Please login.');
        setIsRegister(false);
      } else {
        const { user, token } = res.data;
        onLogin(user, token);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">
          {isRegister ? 'Register Smart Laundry' : 'Login Smart Laundry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

function CustomerDashboard({ user }: { user: any }) {
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS);
  const [createOrder] = useMutation(CREATE_ORDER);

  // Real-time subscription (Optional enhancement)
  // useSubscription(ORDER_SUBSCRIPTION, { variables: { customerId: user.id } });

  const [newOrder, setNewOrder] = useState({ serviceType: 'WASH', weight: 1, notes: '' });
  const [showModal, setShowModal] = useState(false);

  const handleCreateOrder = async () => {
    try {
      await createOrder({
        variables: {
          input: {
            serviceType: newOrder.serviceType,
            weight: parseFloat(newOrder.weight.toString()),
            notes: newOrder.notes
          }
        }
      });
      setShowModal(false);
      refetch();
      alert('Order placed successfully!');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Laundry Orders</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          + New Order
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.myOrders.map((order: any) => (
          <div key={order.id} className="rounded-lg border bg-white p-4 shadow">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">#{order.id.slice(0, 8)}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'READY' ? 'bg-green-100 text-green-800' :
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                }`}>
                {order.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Service: {order.serviceType}</p>
            <p className="text-sm text-gray-600">Weight: {order.weight} kg</p>
            <p className="text-sm text-gray-600">Price: Rp {order.price.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded bg-white p-6">
            <h3 className="mb-4 text-lg font-bold">New Laundry Order</h3>
            <select
              className="w-full mb-3 rounded border p-2"
              value={newOrder.serviceType}
              onChange={e => setNewOrder({ ...newOrder, serviceType: e.target.value })}
            >
              <option value="WASH">Wash Only (5k/kg)</option>
              <option value="DRY">Dry Only (4k/kg)</option>
              <option value="IRON">Iron Only (3k/kg)</option>
              <option value="WASH_IRON">Wash + Iron (8k/kg)</option>
            </select>
            <input
              type="number"
              placeholder="Weight (kg)"
              className="w-full mb-3 rounded border p-2"
              value={newOrder.weight}
              onChange={e => setNewOrder({ ...newOrder, weight: parseFloat(e.target.value) || 0 })}
            />
            <textarea
              placeholder="Notes"
              className="w-full mb-4 rounded border p-2"
              value={newOrder.notes}
              onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded text-gray-600 hover:bg-gray-100 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ user }: { user: any }) {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS);
  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({
        variables: { id, status: newStatus }
      });
      refetch();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard - All Orders</h1>
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="w-full bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order: any) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">{order.customerName || 'Unknown'}</td>
                <td className="px-6 py-4">{order.serviceType} ({order.weight}kg)</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs text-white ${order.status === 'READY' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded border p-1"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="WASHING">WASHING</option>
                    <option value="DRYING">DRYING</option>
                    <option value="IRONING">IRONING</option>
                    <option value="READY">READY</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check local storage for token
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Smart Laundry</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl">
        {user.role === 'admin' ? <AdminDashboard user={user} /> : <CustomerDashboard user={user} />}
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <ApolloWrapper>
      <AppContent />
    </ApolloWrapper>
  );
}