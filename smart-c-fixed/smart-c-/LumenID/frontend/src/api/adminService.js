import apiClient from './apiClient';

const mockAdminStats = [
  {
    label: "Credentials Issued",
    value: "2,847",
    change: "+12%",
    gradient: "from-violet-500 to-purple-500",
    bgClass: "bg-violet-500/10",
    textClass: "text-violet-500",
    iconName: "MintCredentialIcon"
  },
  {
    label: "Verifications Today",
    value: "1,394",
    change: "+8%",
    gradient: "from-green-500 to-emerald-500",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-500",
    iconName: "CheckCircle2"
  },
  {
    label: "Pending Reviews",
    value: "23",
    change: "-5%",
    gradient: "from-yellow-500 to-amber-500",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    iconName: "Clock"
  },
  {
    label: "Active Users",
    value: "15,429",
    change: "+18%",
    gradient: "from-cyan-500 to-blue-500",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-500",
    iconName: "Users"
  }
];

const adminService = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.warn('Admin API unavailable, falling back to mock stats');
      return mockAdminStats;
    }
  }
};

export default adminService;
