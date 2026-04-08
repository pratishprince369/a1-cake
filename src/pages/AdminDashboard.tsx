import { useEffect, useState } from 'react';
import type { Order } from '../types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const rawData = localStorage.getItem('a1_orders');
    if (rawData) {
      setOrders(JSON.parse(rawData));
    }
  }, []);

  const completeOrder = (id: string) => {
    const updated = orders.map(o => 
      o.order_id === id ? { ...o, order_status: 'Completed' } : o
    );
    setOrders(updated);
    localStorage.setItem('a1_orders', JSON.stringify(updated));
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>A-One Cakes Admin Panel</h1>
        <button className="product-btn" style={{ width: 'auto', padding: '10px 20px' }}>
          Export CSV (Coming Soon)
        </button>
      </div>

      <div className="bg-surface rounded-md">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date/Time</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Delivery</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>No orders yet.</td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={o.order_id}>
                  <td><strong>#{o.order_id}</strong></td>
                  <td>{o.date}<br/><span style={{fontSize: 12, color: '#666'}}>{o.time}</span></td>
                  <td>
                    {o.customer_name}<br/>
                    <span style={{fontSize: 12, color: '#666'}}>{o.customer_phone}</span>
                  </td>
                  <td>
                    {o.product_name}
                    {o.custom_message && <><br/><span style={{fontSize: 12, color: '#666'}}>"{o.custom_message}"</span></>}
                  </td>
                  <td>{o.delivery_type === 'Home Delivery' ? o.delivery_address : 'Self Pickup'}</td>
                  <td>${o.total_amount?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${o.order_status === 'Completed' ? 'status-completed' : 'status-received'}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td>
                    {o.order_status !== 'Completed' && (
                      <button 
                        onClick={() => completeOrder(o.order_id)}
                        style={{ background: '#28a745', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 12 }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
