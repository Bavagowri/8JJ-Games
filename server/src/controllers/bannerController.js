


// server/src/controllers/bannerController.js
import { db } from "../db/index.js";

/* ================= GET ALL TEMPLATES ================= */
export async function getTemplates(req, res) {
  try {
    const { type, active_only = 'false' } = req.query;

    let query = 'SELECT * FROM banner_templates';
    const params = [];

    if (type || active_only === 'true') {
      query += ' WHERE';
      const conditions = [];
      if (type) { conditions.push(' template_type = ?'); params.push(type); }
      if (active_only === 'true') { conditions.push(' is_active = TRUE'); }
      query += conditions.join(' AND');
    }

    query += ' ORDER BY name';
    const [templates] = await db.query(query, params);
    res.json(templates);
  } catch (error) {
    console.error('❌ Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

/* ================= GET SINGLE TEMPLATE ================= */
export async function getTemplate(req, res) {
  try {
    const { templateId } = req.params;
    const [templates] = await db.query('SELECT * FROM banner_templates WHERE id = ?', [templateId]);
    if (templates.length === 0) return res.status(404).json({ error: 'Template not found' });
    res.json(templates[0]);
  } catch (error) {
    console.error('❌ Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
}

/* ================= UPDATE TEMPLATE ================= */
export async function updateTemplate(req, res) {
  try {
    const { templateId } = req.params;
    const { name, description, preview_image_url, default_config } = req.body;
    await db.query(
      `UPDATE banner_templates SET name = ?, description = ?, preview_image_url = ?, default_config = ? WHERE id = ?`,
      [name, description, preview_image_url, JSON.stringify(default_config), templateId]
    );
    res.json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('❌ Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
}

/* ================= TOGGLE TEMPLATE STATUS ================= */
export async function toggleTemplate(req, res) {
  try {
    const { templateId } = req.params;
    await db.query('UPDATE banner_templates SET is_active = NOT is_active WHERE id = ?', [templateId]);
    res.json({ message: 'Template status toggled' });
  } catch (error) {
    console.error('❌ Error toggling template:', error);
    res.status(500).json({ error: 'Failed to toggle template' });
  }
}

/* ================= GET ALL PLACEMENTS ================= */
export async function getPlacements(req, res) {
  try {
    const { active_only = 'false' } = req.query;
    let query = 'SELECT * FROM banner_placements';
    if (active_only === 'true') query += ' WHERE is_active = TRUE';
    query += " ORDER BY COALESCE(page_route, ''), name";

    const [placements] = await db.query(query);

    const processedPlacements = placements.map(placement => {
      let allowedTemplates = placement.allowed_templates;
      if (typeof allowedTemplates === 'string') {
        try { allowedTemplates = JSON.parse(allowedTemplates); } catch { allowedTemplates = []; }
      }

      let allowedTemplateTypes = placement.allowed_template_types;
      if (typeof allowedTemplateTypes === 'string') {
        try { allowedTemplateTypes = JSON.parse(allowedTemplateTypes); } catch { allowedTemplateTypes = []; }
      }

      // ── KEY FIX: ensure allowed_templates contains Numbers not strings ──
      if (Array.isArray(allowedTemplates)) {
        allowedTemplates = allowedTemplates.map(Number).filter(n => !isNaN(n));
      }

      return {
        ...placement,
        allowed_templates: allowedTemplates || [],
        allowed_template_types: allowedTemplateTypes || [],
      };
    });

    res.json(processedPlacements);
  } catch (error) {
    console.error('❌ Error fetching placements:', error);
    res.status(500).json({ error: 'Failed to fetch placements' });
  }
}

/* ================= GET SINGLE PLACEMENT ================= */
export async function getPlacement(req, res) {
  try {
    const { placementId } = req.params;
    const [placements] = await db.query('SELECT * FROM banner_placements WHERE id = ?', [placementId]);
    if (placements.length === 0) return res.status(404).json({ error: 'Placement not found' });

    const placement = placements[0];
    if (typeof placement.allowed_templates === 'string') {
      try { placement.allowed_templates = JSON.parse(placement.allowed_templates); } catch { placement.allowed_templates = []; }
    }
    if (typeof placement.allowed_template_types === 'string') {
      try { placement.allowed_template_types = JSON.parse(placement.allowed_template_types); } catch { placement.allowed_template_types = []; }
    }
    // Normalise to numbers
    if (Array.isArray(placement.allowed_templates)) {
      placement.allowed_templates = placement.allowed_templates.map(Number).filter(n => !isNaN(n));
    }

    res.json(placement);
  } catch (error) {
    console.error('❌ Error fetching placement:', error);
    res.status(500).json({ error: 'Failed to fetch placement' });
  }
}

/* ================= CREATE PLACEMENT ================= */
export async function createPlacement(req, res) {
  try {
    const { name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates } = req.body;
    const [result] = await db.query(
      `INSERT INTO banner_placements (name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, placement_key, page_route, position, description, max_active_banners || 1,
       JSON.stringify(allowed_template_types || []), JSON.stringify(allowed_templates || [])]
    );
    res.json({ message: 'Placement created successfully', id: result.insertId });
  } catch (error) {
    console.error('❌ Error creating placement:', error);
    res.status(500).json({ error: 'Failed to create placement' });
  }
}

/* ================= UPDATE PLACEMENT ================= */
export async function updatePlacement(req, res) {
  try {
    const { placementId } = req.params;
    const { name, placement_key, page_route, position, description, max_active_banners, allowed_template_types, allowed_templates } = req.body;
    await db.query(
      `UPDATE banner_placements SET name = ?, placement_key = ?, page_route = ?, position = ?,
       description = ?, max_active_banners = ?, allowed_template_types = ?, allowed_templates = ? WHERE id = ?`,
      [name, placement_key, page_route, position, description, max_active_banners || 1,
       JSON.stringify(allowed_template_types || []), JSON.stringify(allowed_templates || []), placementId]
    );
    res.json({ message: 'Placement updated successfully' });
  } catch (error) {
    console.error('❌ Error updating placement:', error);
    res.status(500).json({ error: 'Failed to update placement' });
  }
}

/* ================= DELETE PLACEMENT ================= */
export async function deletePlacement(req, res) {
  try {
    const { placementId } = req.params;
    const [banners] = await db.query(
      'SELECT COUNT(*) as count FROM banners WHERE placement_id = ? AND is_active = TRUE',
      [placementId]
    );
    if (banners[0].count > 0) {
      return res.status(400).json({ error: `Cannot delete placement with ${banners[0].count} active banner(s)` });
    }
    await db.query('DELETE FROM banner_placements WHERE id = ?', [placementId]);
    res.json({ message: 'Placement deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting placement:', error);
    res.status(500).json({ error: 'Failed to delete placement' });
  }
}

/* ================= TOGGLE PLACEMENT STATUS ================= */
export async function togglePlacement(req, res) {
  try {
    const { placementId } = req.params;
    await db.query('UPDATE banner_placements SET is_active = NOT is_active WHERE id = ?', [placementId]);
    res.json({ message: 'Placement status toggled' });
  } catch (error) {
    console.error('❌ Error toggling placement:', error);
    res.status(500).json({ error: 'Failed to toggle placement' });
  }
}

/* ================= GET ALL BANNERS ================= */
export async function getBanners(req, res) {
  try {
    const { template_id, placement_id, is_active, page = 1, limit = 50 } = req.query;

    let query = `
      SELECT b.*,
             t.name as template_name, t.template_type,
             p.name as placement_name, p.placement_key
      FROM banners b
      INNER JOIN banner_templates t ON b.template_id = t.id
      INNER JOIN banner_placements p ON b.placement_id = p.id
    `;

    const conditions = [];
    const params = [];

    if (template_id) { conditions.push('b.template_id = ?'); params.push(template_id); }
    if (placement_id) { conditions.push('b.placement_id = ?'); params.push(placement_id); }
    if (is_active !== undefined) { conditions.push('b.is_active = ?'); params.push(is_active === 'true'); }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');

    query += ' ORDER BY b.priority DESC, b.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const [banners] = await db.query(query, params);
    res.json(banners);
  } catch (error) {
    console.error('❌ Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
}

/* ================= GET SINGLE BANNER ================= */
export async function getBanner(req, res) {
  try {
    const { bannerId } = req.params;

    const [banners] = await db.query(
      `SELECT b.*, t.name as template_name, t.template_type, t.component_name,
              p.name as placement_name, p.placement_key
       FROM banners b
       INNER JOIN banner_templates t ON b.template_id = t.id
       INNER JOIN banner_placements p ON b.placement_id = p.id
       WHERE b.id = ?`,
      [bannerId]
    );

    if (banners.length === 0) return res.status(404).json({ error: 'Banner not found' });

    const banner = banners[0];

    const [slides] = await db.query(
      'SELECT * FROM banner_slides WHERE banner_id = ? ORDER BY order_position',
      [bannerId]
    );

    const [games] = await db.query(
      'SELECT * FROM banner_games WHERE banner_id = ? ORDER BY order_position',
      [bannerId]
    );

    banner.slides = slides;
    banner.games  = games.map(bg => ({
      id:             bg.game_id,
      banner_game_id: bg.id,
      order_position: bg.order_position,
      is_featured:    bg.is_featured,
    }));

    if (typeof banner.config === 'string') {
      try { banner.config = JSON.parse(banner.config); } catch { banner.config = {}; }
    }

    console.log(`📋 getBanner ${bannerId} — ${slides.length} slide(s) returned`);
    res.json(banner);
  } catch (error) {
    console.error('❌ Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
}

/* ================= CREATE BANNER ================= */
export async function createBanner(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      template_id,
      placement_id,
      name,
      subtitle,
      priority = 0,
      is_active = true,
      start_date,
      end_date,
      config = {},
      slides = [],
    } = req.body;

    console.log('💾 Creating banner:', {
      template_id,
      placement_id,
      name,
      slidesCount: slides?.length || 0,
    });

    // Validate template
    const [templates] = await connection.query(
      'SELECT * FROM banner_templates WHERE id = ?',
      [Number(template_id)]
    );
    if (templates.length === 0) throw new Error('Template not found');

    // Validate placement
    const [placements] = await connection.query(
      'SELECT * FROM banner_placements WHERE id = ?',
      [Number(placement_id)]
    );
    if (placements.length === 0) throw new Error('Placement not found');

    const placement = placements[0];

    // ── KEY FIX: coerce allowed_templates to Number[] before .includes() check ──
    let allowedTemplates = placement.allowed_templates;
    if (typeof allowedTemplates === 'string') {
      try { allowedTemplates = JSON.parse(allowedTemplates); } catch { allowedTemplates = []; }
    }
    if (!Array.isArray(allowedTemplates)) allowedTemplates = [];
    allowedTemplates = allowedTemplates.map(Number);

    if (allowedTemplates.length > 0 && !allowedTemplates.includes(Number(template_id))) {
      throw new Error(`Template ${template_id} is not allowed for placement "${placement.name}". Allowed: [${allowedTemplates.join(', ')}]`);
    }

    // Create banner row
    const [result] = await connection.query(
      `INSERT INTO banners
       (template_id, placement_id, name, subtitle, priority, is_active, start_date, end_date, config, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(template_id),
        Number(placement_id),
        name,
        subtitle || null,
        priority,
        is_active,
        start_date || new Date(),
        end_date && end_date.trim() !== '' ? end_date : null,
        JSON.stringify(config),
        req.user?.id || null,
      ]
    );

    const bannerId = result.insertId;
    console.log(`✅ Banner created with ID: ${bannerId}`);

    // Insert slides
    if (slides && slides.length > 0) {
      console.log(`🎬 Adding ${slides.length} slides...`);
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        let slideConfig = slide.config || {};
        if (typeof slideConfig === 'string') {
          try { slideConfig = JSON.parse(slideConfig); } catch { slideConfig = {}; }
        }
        await connection.query(
          `INSERT INTO banner_slides
           (banner_id, order_position, title, title_highlight, subtitle, badge_text,
            cta_text, cta_link, background_image_url, logo_url, config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bannerId,
            slide.order_position ?? i,
            slide.title || '',
            slide.title_highlight || null,
            slide.subtitle || null,
            slide.badge_text || null,
            slide.cta_text || null,
            slide.cta_link || null,
            slide.background_image_url || null,
            slide.logo_url || null,
            Object.keys(slideConfig).length > 0 ? JSON.stringify(slideConfig) : null,
          ]
        );
      }
      console.log(`✅ Slides added`);
    } else {
      console.warn(`⚠️  Banner ${bannerId} created with no slides — payload had 0 slides`);
    }

    await connection.commit();
    res.json({ message: 'Banner created successfully', id: bannerId });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error creating banner:', error);
    res.status(500).json({ error: error.message || 'Failed to create banner' });
  } finally {
    connection.release();
  }
}

/* ================= UPDATE BANNER ================= */
export async function updateBanner(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { bannerId } = req.params;
    const { name, subtitle, priority, is_active, start_date, end_date, config, slides } = req.body;

    await connection.query(
      `UPDATE banners
       SET name = ?, subtitle = ?, priority = ?, is_active = ?,
           start_date = ?, end_date = ?, config = ?
       WHERE id = ?`,
      [
        name,
        subtitle || null,
        priority,
        is_active,
        start_date,
        end_date && end_date.trim() !== '' ? end_date : null,
        JSON.stringify(config || {}),
        bannerId,
      ]
    );

    // Delete then reinsert slides
    if (slides) {
      await connection.query('DELETE FROM banner_slides WHERE banner_id = ?', [bannerId]);
      console.log(`🎬 Updating ${slides.length} slides for banner ${bannerId}...`);

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        let slideConfig = slide.config || {};
        if (typeof slideConfig === 'string') {
          try { slideConfig = JSON.parse(slideConfig); } catch { slideConfig = {}; }
        }
        await connection.query(
          `INSERT INTO banner_slides
           (banner_id, order_position, title, title_highlight, subtitle, badge_text,
            cta_text, cta_link, background_image_url, logo_url, config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bannerId,
            slide.order_position ?? i,
            slide.title || '',
            slide.title_highlight || null,
            slide.subtitle || null,
            slide.badge_text || null,
            slide.cta_text || null,
            slide.cta_link || null,
            slide.background_image_url || null,
            slide.logo_url || null,
            Object.keys(slideConfig).length > 0 ? JSON.stringify(slideConfig) : null,
          ]
        );
      }
      console.log(`✅ Slides updated`);
    }

    await connection.commit();
    res.json({ message: 'Banner updated successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error updating banner:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  } finally {
    connection.release();
  }
}

/* ================= DELETE BANNER ================= */
export async function deleteBanner(req, res) {
  try {
    const { bannerId } = req.params;
    await db.query('DELETE FROM banners WHERE id = ?', [bannerId]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
}

/* ================= TOGGLE BANNER STATUS ================= */
export async function toggleBanner(req, res) {
  try {
    const { bannerId } = req.params;
    await db.query('UPDATE banners SET is_active = NOT is_active WHERE id = ?', [bannerId]);
    res.json({ message: 'Banner status toggled' });
  } catch (error) {
    console.error('❌ Error toggling banner:', error);
    res.status(500).json({ error: 'Failed to toggle banner' });
  }
}

/* ================= GET BANNER ANALYTICS ================= */
export async function getBannerAnalytics(req, res) {
  try {
    const { bannerId } = req.params;
    const { start_date, end_date } = req.query;

    let query = `
      SELECT event_type, COUNT(*) as count, DATE(timestamp) as date
      FROM banner_analytics WHERE banner_id = ?
    `;
    const params = [bannerId];
    if (start_date) { query += ' AND timestamp >= ?'; params.push(start_date); }
    if (end_date)   { query += ' AND timestamp <= ?'; params.push(end_date); }
    query += ' GROUP BY event_type, DATE(timestamp) ORDER BY date DESC';

    const [analytics] = await db.query(query, params);
    res.json(analytics);
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

/* ================= PUBLIC - GET BANNER FOR PLACEMENT ================= */
export async function getBannerForPlacement(req, res) {
  try {
    const { placementKey } = req.params;

    const [banners] = await db.query(
      `SELECT b.*, t.template_type, t.component_name, p.placement_key
       FROM banners b
       INNER JOIN banner_templates t ON b.template_id = t.id
       INNER JOIN banner_placements p ON b.placement_id = p.id
       WHERE p.placement_key = ?
         AND b.is_active = TRUE
         AND t.is_active = TRUE
         AND p.is_active = TRUE
         AND (b.end_date IS NULL OR b.end_date > NOW())
         AND b.start_date <= NOW()
       ORDER BY b.priority DESC
       LIMIT 1`,
      [placementKey]
    );

    if (banners.length === 0) {
      console.log(`ℹ️  No active banner found for placement: ${placementKey}`);
      return res.json(null);
    }

    const banner = banners[0];

    if (typeof banner.config === 'string') {
      try { banner.config = JSON.parse(banner.config); } catch { banner.config = {}; }
    }

    const [slides] = await db.query(
      'SELECT * FROM banner_slides WHERE banner_id = ? AND is_active = TRUE ORDER BY order_position',
      [banner.id]
    );

    banner.slides = slides;
    banner.games  = [];

    console.log(`📡 Serving banner "${banner.name}" for placement "${placementKey}" — ${slides.length} slide(s)`);
    res.json(banner);
  } catch (error) {
    console.error('❌ Error fetching banner for placement:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
}

/* ================= TRACK CLICK/IMPRESSION ================= */
export async function trackClick(req, res) {
  try {
    const { banner_id, slide_id, game_id, event_type, session_id, page_url, referrer_url, device_type, browser } = req.body;

    await db.query(
      `INSERT INTO banner_analytics
       (banner_id, slide_id, game_id, event_type, user_id, session_id,
        page_url, referrer_url, device_type, browser, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        banner_id, slide_id || null, game_id || null, event_type,
        req.user?.id || null, session_id, page_url, referrer_url,
        device_type || 'desktop', browser, req.ip,
      ]
    );

    if (event_type.includes('click')) {
      await db.query('UPDATE banners SET click_count = click_count + 1 WHERE id = ?', [banner_id]);
    } else if (event_type === 'impression') {
      await db.query('UPDATE banners SET impression_count = impression_count + 1 WHERE id = ?', [banner_id]);
    }

    res.json({ message: 'Event tracked' });
  } catch (error) {
    console.error('❌ Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
}

/* ================= SLIDE MANAGEMENT ================= */
export async function addSlide(req, res) {
  try {
    const { bannerId } = req.params;
    const slide = req.body;
    const [result] = await db.query(
      `INSERT INTO banner_slides
       (banner_id, order_position, title, title_highlight, subtitle, badge_text,
        cta_text, cta_link, background_image_url, logo_url, config)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bannerId, slide.order_position, slide.title, slide.title_highlight,
        slide.subtitle, slide.badge_text, slide.cta_text, slide.cta_link,
        slide.background_image_url, slide.logo_url,
        slide.config ? JSON.stringify(slide.config) : null,
      ]
    );
    res.json({ message: 'Slide added', id: result.insertId });
  } catch (error) {
    console.error('❌ Error adding slide:', error);
    res.status(500).json({ error: 'Failed to add slide' });
  }
}

export async function updateSlide(req, res) {
  try {
    const { slideId } = req.params;
    const slide = req.body;
    await db.query(
      `UPDATE banner_slides
       SET order_position = ?, title = ?, title_highlight = ?, subtitle = ?,
           badge_text = ?, cta_text = ?, cta_link = ?, background_image_url = ?,
           logo_url = ?, config = ?
       WHERE id = ?`,
      [
        slide.order_position, slide.title, slide.title_highlight, slide.subtitle,
        slide.badge_text, slide.cta_text, slide.cta_link, slide.background_image_url,
        slide.logo_url, slide.config ? JSON.stringify(slide.config) : null, slideId,
      ]
    );
    res.json({ message: 'Slide updated' });
  } catch (error) {
    console.error('❌ Error updating slide:', error);
    res.status(500).json({ error: 'Failed to update slide' });
  }
}

export async function deleteSlide(req, res) {
  try {
    const { slideId } = req.params;
    await db.query('DELETE FROM banner_slides WHERE id = ?', [slideId]);
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    console.error('❌ Error deleting slide:', error);
    res.status(500).json({ error: 'Failed to delete slide' });
  }
}

export async function reorderSlides(req, res) {
  try {
    const { bannerId } = req.params;
    const { slides } = req.body;
    for (const slide of slides) {
      await db.query(
        'UPDATE banner_slides SET order_position = ? WHERE id = ? AND banner_id = ?',
        [slide.order_position, slide.id, bannerId]
      );
    }
    res.json({ message: 'Slides reordered' });
  } catch (error) {
    console.error('❌ Error reordering slides:', error);
    res.status(500).json({ error: 'Failed to reorder slides' });
  }
}

/* ================= GAME MANAGEMENT ================= */
export async function addGame(req, res) {
  try {
    const { bannerId } = req.params;
    const { game_id, order_position, is_featured } = req.body;
    const [result] = await db.query(
      'INSERT INTO banner_games (banner_id, game_id, order_position, is_featured) VALUES (?, ?, ?, ?)',
      [bannerId, game_id, order_position, is_featured || false]
    );
    res.json({ message: 'Game added', id: result.insertId });
  } catch (error) {
    console.error('❌ Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
}

export async function updateGame(req, res) {
  try {
    const { gameId } = req.params;
    const { order_position, is_featured } = req.body;
    await db.query('UPDATE banner_games SET order_position = ?, is_featured = ? WHERE id = ?', [order_position, is_featured, gameId]);
    res.json({ message: 'Game updated' });
  } catch (error) {
    console.error('❌ Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
}

export async function removeGame(req, res) {
  try {
    const { gameId } = req.params;
    await db.query('DELETE FROM banner_games WHERE id = ?', [gameId]);
    res.json({ message: 'Game removed' });
  } catch (error) {
    console.error('❌ Error removing game:', error);
    res.status(500).json({ error: 'Failed to remove game' });
  }
}