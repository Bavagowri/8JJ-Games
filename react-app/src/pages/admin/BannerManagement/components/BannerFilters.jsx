// // react-app/src/pages/admin/BannerManagement/components/BannerFilters.jsx

// import { Search, Filter } from 'lucide-react';

// export default function BannerFilters({ filters, setFilters, templates, placements }) {
//   return (
//     <div className="banner-filters">
//       {/* Search */}
//       <div className="banner-filter-item banner-filter-search">
//         <Search size={18} className="banner-filter-icon" />
//         <input
//           type="text"
//           placeholder="Search banners..."
//           className="banner-search-input"
//           value={filters.search}
//           onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//         />
//       </div>

//       {/* Template Filter */}
//       <select
//         className="banner-filter-select"
//         value={filters.template}
//         onChange={(e) => setFilters({ ...filters, template: e.target.value })}
//       >
//         <option value="">All Templates</option>
//         {templates.map(t => (
//           <option key={t.id} value={t.id}>{t.name}</option>
//         ))}
//       </select>

//       {/* Placement Filter */}
//       <select
//         className="banner-filter-select"
//         value={filters.placement}
//         onChange={(e) => setFilters({ ...filters, placement: e.target.value })}
//       >
//         <option value="">All Placements</option>
//         {placements.map(p => (
//           <option key={p.id} value={p.id}>{p.name}</option>
//         ))}
//       </select>

//       {/* Status Filter */}
//       <select
//         className="banner-filter-select"
//         value={filters.status}
//         onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//       >
//         <option value="">All Status</option>
//         <option value="active">Active</option>
//         <option value="inactive">Inactive</option>
//       </select>

//       {/* Clear Filters */}
//       {(filters.search || filters.template || filters.placement || filters.status) && (
//         <button
//           className="admin-button admin-button-secondary"
//           onClick={() => setFilters({ search: '', template: '', placement: '', status: '' })}
//         >
//           Clear Filters
//         </button>
//       )}
//     </div>
//   );
// }



// react-app/src/pages/admin/BannerManagement/components/BannerFilters.jsx

import { Search, X } from 'lucide-react';

export default function BannerFilters({ filters, setFilters, templates, placements }) {
  const hasFilters = filters.search || filters.template || filters.placement || filters.status;

  return (
    <div className="banner-filters">
      {/* Search */}
      <div className="banner-filter-item banner-filter-search" style={{ position: 'relative', flex: 2, minWidth: 220 }}>
        <Search size={16} className="banner-filter-icon" />
        <input
          type="text"
          placeholder="Search banners..."
          className="banner-search-input"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        {filters.search && (
          <button
            onClick={() => setFilters({ ...filters, search: '' })}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 2,
              borderRadius: '50%',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Template Filter */}
      <select
        className="banner-filter-select"
        value={filters.template}
        onChange={(e) => setFilters({ ...filters, template: e.target.value })}
      >
        <option value="">All Templates</option>
        {templates.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {/* Placement Filter */}
      <select
        className="banner-filter-select"
        value={filters.placement}
        onChange={(e) => setFilters({ ...filters, placement: e.target.value })}
      >
        <option value="">All Placements</option>
        {placements.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        className="banner-filter-select"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          className="admin-button admin-button-secondary"
          onClick={() => setFilters({ search: '', template: '', placement: '', status: '' })}
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}