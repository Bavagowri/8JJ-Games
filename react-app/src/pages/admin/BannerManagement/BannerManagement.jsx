// react-app/src/pages/admin/BannerManagement/BannerManagement.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout, Plus } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import BannerFilters from './components/BannerFilters';
import BannerCard from './components/BannerCard';
import PlacementsTable from './components/PlacementsTable';
import TemplatesTable from './components/TemplatesTable';
import { bannerAPI } from '../../../api/banner.api';
import './BannerManagement.css';

export default function BannerManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [banners, setBanners] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'banners');

  const [filters, setFilters] = useState({
    search: '',
    template: '',
    placement: '',
    status: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bannersData, placementsData, templatesData] = await Promise.all([
        bannerAPI.getBanners(),
        bannerAPI.getPlacements(),
        bannerAPI.getTemplates()
      ]);

      setBanners(Array.isArray(bannersData) ? bannersData : (bannersData.banners || []));
      setPlacements(Array.isArray(placementsData) ? placementsData : (placementsData.placements || []));
      setTemplates(Array.isArray(templatesData) ? templatesData : (templatesData.templates || []));
    } catch (error) {
      console.error('Failed to load banner data:', error);
      alert('Failed to load banner data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (bannerId) => {
    try {
      await bannerAPI.toggleBanner(bannerId);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle banner:', error);
      alert('Failed to toggle banner status');
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      return;
    }

    try {
      await bannerAPI.deleteBanner(bannerId);
      await loadData();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleDuplicate = async (bannerId) => {
    navigate(`/admin/banners/create?duplicate=${bannerId}`);
  };

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    if (filters.search && !banner.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.template && banner.template_id !== parseInt(filters.template)) {
      return false;
    }
    if (filters.placement && banner.placement_id !== parseInt(filters.placement)) {
      return false;
    }
    if (filters.status === 'active' && !banner.is_active) {
      return false;
    }
    if (filters.status === 'inactive' && banner.is_active) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <AdminLayout title="Banner Management" breadcrumbs={['Admin', 'Banner Management']}>
        <LoadingSpinner message="Loading banner management..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Banner Management"
      breadcrumbs={['Admin', 'Banner Management']}
    >
      <div className="banner-management">
        {/* Header with Tabs */}
        <div className="banner-management-header">
          <div className="banner-tabs">
            <button
              className={`banner-tab ${activeTab === 'banners' ? 'banner-tab-active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              <Layout size={18} />
              Banners ({banners.length})
            </button>
            <button
              className={`banner-tab ${activeTab === 'placements' ? 'banner-tab-active' : ''}`}
              onClick={() => setActiveTab('placements')}
            >
              <Layout size={18} />
              Placements ({placements.length})
            </button>
            <button
              className={`banner-tab ${activeTab === 'templates' ? 'banner-tab-active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              <Layout size={18} />
              Templates ({templates.length})
            </button>
          </div>

          {activeTab !== 'templates' && (
            <button
              className="admin-button admin-button-primary"
              onClick={() => {
                if (activeTab === 'banners') {
                  navigate('/admin/banners/create');
                } else if (activeTab === 'placements') {
                  navigate('/admin/banners/placements/create');
                }
              }}
            >
              <Plus size={18} />
              Create {activeTab === 'banners' ? 'Banner' : 'Placement'}
            </button>
          )}
        </div>

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <>
            <BannerFilters
              filters={filters}
              setFilters={setFilters}
              templates={templates}
              placements={placements}
            />

            {filteredBanners.length === 0 ? (
              <div className="banner-empty">
                <Layout size={64} />
                <h3>No banners found</h3>
                <p>Create your first banner to get started</p>
                <button
                  className="admin-button admin-button-primary"
                  onClick={() => navigate('/admin/banners/create')}
                >
                  <Plus size={18} />
                  Create Banner
                </button>
              </div>
            ) : (
              <div className="banner-grid">
                {filteredBanners.map(banner => (
                  <BannerCard
                    key={banner.id}
                    banner={banner}
                    templates={templates}
                    placements={placements}
                    onToggle={() => handleToggleStatus(banner.id)}
                    onEdit={() => navigate(`/admin/banners/edit/${banner.id}`)}
                    onDelete={() => handleDelete(banner.id)}
                    onDuplicate={() => handleDuplicate(banner.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <PlacementsTable
            placements={placements}
            onRefresh={loadData}
          />
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <TemplatesTable
            templates={templates}
            onRefresh={loadData}
          />
        )}
      </div>
    </AdminLayout>
  );
}