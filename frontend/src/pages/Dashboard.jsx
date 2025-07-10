import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidatesAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, candidatesResponse] = await Promise.all([
        candidatesAPI.getStats(),
        candidatesAPI.getAll({ limit: 5, sort: '-referredDate' })
      ]);
      
      setStats(statsResponse.data.stats);
      setRecentCandidates(candidatesResponse.data.candidates || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed': return 'bg-blue-100 text-blue-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your referral management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalCandidates || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.byStatus?.Pending || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hired</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.byStatus?.Hired || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">👁️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.byStatus?.Reviewed || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/refer" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-semibold text-lg">+</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Refer a Candidate</h3>
            <p className="text-gray-600">Add a new candidate referral</p>
          </div>
        </Link>

        <Link to="/candidates" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-semibold text-lg">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View All Candidates</h3>
            <p className="text-gray-600">Manage your referrals</p>
          </div>
        </Link>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-semibold text-lg">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
            <p className="text-gray-600">
              {stats?.totalCandidates > 0 
                ? `${Math.round((stats?.byStatus?.Hired || 0) / stats.totalCandidates * 100)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Referrals</h2>
          <Link to="/candidates" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No candidates referred yet</p>
            <Link to="/refer" className="btn-primary mt-4 inline-block">
              Refer your first candidate
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCandidates.map((candidate) => (
              <div key={candidate._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {candidate.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(candidate.referredDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
