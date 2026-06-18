// // react-app/src/pages/admin/BannerManagement/components/TemplatesTable.jsx

// import { useNavigate } from 'react-router-dom';
// import { Edit, Eye, EyeOff, Image } from 'lucide-react';
// import { bannerAPI } from '../../../../api/banner.api';

// export default function TemplatesTable({ templates, onRefresh }) {
//   const navigate = useNavigate();

//   const handleToggle = async (templateId) => {
//     try {
//       await bannerAPI.toggleTemplate(templateId);
//       onRefresh();
//     } catch (error) {
//       console.error('Failed to toggle template:', error);
//       alert('Failed to toggle template');
//     }
//   };

//   return (
//     <div className="admin-table-wrapper">
//       <table className="admin-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Type</th>
//             <th>Component</th>
//             <th>Preview</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {templates.map(template => (
//             <tr key={template.id}>
//               <td><strong>{template.name}</strong></td>
//               <td>
//                 <span className="badge">
//                   {template.template_type.replace(/_/g, ' ')}
//                 </span>
//               </td>
//               <td><code className="code-badge">{template.component_name}</code></td>
//               <td>
//                 {template.preview_image_url ? (
//                   <img 
//                     src={template.preview_image_url} 
//                     alt={template.name}
//                     style={{ 
//                       maxWidth: '120px', 
//                       maxHeight: '70px', 
//                       objectFit: 'cover',
//                       borderRadius: '6px',
//                       border: '1px solid var(--admin-border)'
//                     }}
//                   />
//                 ) : (
//                   <div style={{
//                     width: '120px',
//                     height: '70px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     borderRadius: '6px',
//                     border: '1px solid var(--admin-border)'
//                   }}>
//                     <Image size={24} style={{ opacity: 0.3 }} />
//                   </div>
//                 )}
//               </td>
//               <td style={{ maxWidth: '200px' }}>
//                 <small style={{ color: 'var(--admin-text-secondary)' }}>
//                   {template.description || 'No description'}
//                 </small>
//               </td>
//               <td>
//                 <button
//                   className={`status-badge ${template.is_active ? 'status-active' : 'status-inactive'}`}
//                   onClick={() => handleToggle(template.id)}
//                   title={template.is_active ? 'Click to deactivate' : 'Click to activate'}
//                 >
//                   {template.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
//                   {template.is_active ? 'Active' : 'Inactive'}
//                 </button>
//               </td>
//               <td>
//                 <button 
//                   className="admin-button admin-button-small"
//                   onClick={() => navigate(`/admin/banners/templates/edit/${template.id}`)}
//                   title="Edit template"
//                 >
//                   <Edit size={14} />
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {templates.length === 0 && (
//         <div className="admin-empty" style={{ padding: '40px', textAlign: 'center' }}>
//           <p>No templates found.</p>
//         </div>
//       )}
//     </div>
//   );
// }


// react-app/src/pages/admin/BannerManagement/components/TemplatesTable.jsx

import { useNavigate } from 'react-router-dom';
import { Edit, Eye, EyeOff, Image, Layers } from 'lucide-react';
import { bannerAPI } from '../../../../api/banner.api';

const TEMPLATE_ICONS = {
  hero:                  '🎠',
  promo:                 '🎯',
  multi_panel:           '🪟',
  split_hero:            '⬛',
  countdown:             '⏱',
  promo_grid:            '🔲',
  wide_strip:            '📣',
  carousel_cards:        '🃏',
  video_hero:            '🎬',
  floating_announcement: '💬',
  announcement_bar:      '📢',
  redeem:                '🎟',
  popup:                 '🪄',
};

export default function TemplatesTable({ templates, onRefresh }) {
  const navigate = useNavigate();

  const handleToggle = async (templateId) => {
    try {
      await bannerAPI.toggleTemplate(templateId);
      onRefresh();
    } catch (error) {
      console.error('Failed to toggle template:', error);
      alert('Failed to toggle template');
    }
  };

  if (templates.length === 0) {
    return (
      <div className="banner-empty" style={{ padding: '80px 20px' }}>
        <Layers size={56} style={{ marginBottom: 20, opacity: 0.25 }} />
        <h3>No Templates Found</h3>
        <p>Templates are seeded from the database.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Template</th>
            <th>Type</th>
            <th>Component</th>
            <th>Preview</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => (
            <tr key={template.id}>
              {/* Name + icon */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(0,217,255,0.1)',
                    border: '1px solid rgba(0,217,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {TEMPLATE_ICONS[template.template_type] || '🖼'}
                  </div>
                  <strong style={{ color: '#fff' }}>{template.name}</strong>
                </div>
              </td>

              {/* Type badge */}
              <td>
                <span className="badge">
                  {template.template_type.replace(/_/g, ' ')}
                </span>
              </td>

              {/* Component */}
              <td>
                <code className="code-badge">{template.component_name}</code>
              </td>

              {/* Preview thumbnail */}
              <td>
                {template.preview_image_url ? (
                  <div style={{
                    width: 120, height: 68, borderRadius: 8, overflow: 'hidden',
                    border: '1px solid rgba(0,217,255,0.18)',
                  }}>
                    <img
                      src={template.preview_image_url}
                      alt={template.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: 120, height: 68,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,217,255,0.04)',
                    borderRadius: 8,
                    border: '1px dashed rgba(0,217,255,0.18)',
                  }}>
                    <Image size={20} style={{ opacity: 0.25, color: '#00d9ff' }} />
                  </div>
                )}
              </td>

              {/* Description */}
              <td style={{ maxWidth: 200 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  {template.description || '—'}
                </span>
              </td>

              {/* Status toggle */}
              <td>
                <button
                  className={`status-badge ${template.is_active ? 'status-active' : 'status-inactive'}`}
                  onClick={() => handleToggle(template.id)}
                  title={template.is_active ? 'Click to deactivate' : 'Click to activate'}
                >
                  {template.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                  {template.is_active ? 'Active' : 'Inactive'}
                </button>
              </td>

              {/* Edit action */}
              <td>
                <button
                  className="admin-button admin-button-small"
                  onClick={() => navigate(`/admin/banners/templates/edit/${template.id}`)}
                  title="Edit template"
                >
                  <Edit size={13} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}