import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, TrendingUp, Users, ShoppingBag, Receipt } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b219b36a/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-black/50">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-black/50">Error loading data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Today's Revenue" 
          value={`₸ ${data.metrics.revenue.toLocaleString()}`} 
          trend={data.metrics.revenueTrend} 
          icon={TrendingUp} 
          color="bg-[#30D158]" 
        />
        <MetricCard 
          title="Active Tables" 
          value={data.metrics.activeTables.toString()} 
          trend={data.metrics.tablesTrend} 
          icon={Users} 
          color="bg-[#007AFF]" 
        />
        <MetricCard 
          title="Total Orders" 
          value={data.metrics.totalOrders.toString()} 
          trend={data.metrics.ordersTrend} 
          icon={ShoppingBag} 
          color="bg-[#FF9F0A]" 
        />
        <MetricCard 
          title="Average Bill" 
          value={`₸ ${data.metrics.averageBill.toLocaleString()}`} 
          trend={data.metrics.billTrend} 
          icon={Receipt} 
          color="bg-[#BF5AF2]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bubble-card p-6">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-black/80">Revenue Overview</h3>
              <p className="text-sm text-black/50">Today's hourly performance</p>
            </div>
          </div>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs key="defs">
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30D158" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#30D158" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  key="xaxis"
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  key="yaxis"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 12 }} 
                  tickFormatter={(value) => `₸${value / 1000}k`}
                />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}
                  formatter={(value: number) => [`₸ ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  key="area"
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#30D158" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="bubble-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-black/80 mb-4 relative z-10">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 relative z-10 pr-2">
            {data.recentActivity.map((activity: any) => (
              <ActivityRow 
                key={activity.id}
                title={activity.title} 
                desc={activity.desc} 
                time={activity.time} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="bubble-card p-5 relative overflow-hidden group cursor-default">
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={20} className="text-black/70" />
      </div>
      <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full text-xs font-semibold text-[#28B54E]">
        <ArrowUpRight size={14} />
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-sm font-medium text-black/50 mb-1">{title}</p>
      <h4 className="text-2xl font-bold tracking-tight text-black/90">{value}</h4>
    </div>
  </div>
);

const ActivityRow = ({ title, desc, time }: any) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors border border-white/40">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[#30D158]" />
      <div>
        <p className="text-sm font-semibold text-black/80">{title}</p>
        <p className="text-xs text-black/50">{desc}</p>
      </div>
    </div>
    <span className="text-xs font-medium text-black/40">{time}</span>
  </div>
);
