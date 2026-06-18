// react-app/src/pages/admin/PredictionManagement/PredictionCreate.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { PLATFORM_CONFIG } from "../../../data/predictionsMockData";
import { adminMatchesAPI } from "../../../api/admin.matches.api";
import toast from "react-hot-toast";
import "./PredictionManagement.css";
import "../styles/shared.css";

const INITIAL_FORM = {
  sportmonks_id:         "",
  title:                 "",
  team_a:                "",
  team_b:                "",
  sport_type:            "cricket",
  tournament:            "",
  match_start_time:      "",
  prediction_close_time: "",
  prediction_close_mode: "before_start",
  estimated_end_time: "", 
  prediction_type:       "win_loss",
  stake_cost:            10,
  zero_cost_enabled:     false,
};

const PREDICTION_TYPES = [
  { value: "win_loss",           label: "Win / Loss",         desc: "Predict which team wins the match"          },
  { value: "score_range",        label: "Score Range",        desc: "Predict the total runs scored in the match" },
  { value: "player_performance", label: "Player Performance", desc: "Predict how a specific player performs"     },
];

// Presets admin can apply with one click
const SCORE_RANGE_PRESETS = [
  { label: "T20 (low)",  options: [
    { label: "Under 140 runs", value: "under_140", odds: 2.0 },
    { label: "140–160 runs",   value: "140_160",   odds: 1.8 },
    { label: "Over 160 runs",  value: "over_160",  odds: 2.2 },
  ]},
  { label: "T20 (high)", options: [
    { label: "Under 160 runs", value: "under_160", odds: 2.0 },
    { label: "160–180 runs",   value: "160_180",   odds: 1.8 },
    { label: "Over 180 runs",  value: "over_180",  odds: 2.5 },
  ]},
  { label: "ODI (std)",  options: [
    { label: "Under 250 runs", value: "under_250", odds: 1.9 },
    { label: "250–300 runs",   value: "250_300",   odds: 2.1 },
    { label: "Over 300 runs",  value: "over_300",  odds: 3.5 },
  ]},
  { label: "ODI (high)", options: [
    { label: "Under 280 runs", value: "under_280", odds: 1.9 },
    { label: "280–320 runs",   value: "280_320",   odds: 2.0 },
    { label: "Over 320 runs",  value: "over_320",  odds: 3.0 },
  ]},
];

function OddsInput({ value, onChange, label, min, max }) {
  const isOut = value < min || value > max;
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 11, color: "var(--admin-text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="number" step="0.1" min={min} max={max}
          className={`form-input${isOut ? " error" : ""}`}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={{ paddingRight: 36 }}
        />
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: "var(--admin-text-secondary)" }}>×</span>
      </div>
      {isOut && <span style={{ fontSize: 11, color: "#ef4444" }}>Must be {min}× – {max}×</span>}
    </div>
  );
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(String(str).replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

// Each option has: { id, label (display), value (settlement key), odds }
// win_loss:   value = team name  (compared against match.winner)
// score_range: value = "under_250" / "250_300" / "over_300"
function getDefaultOptions(type, teamA, teamB) {
  if (type === "win_loss") return [
    { id: 1, label: teamA || "Team A", value: teamA || "Team A", odds: 1.8 },
    { id: 2, label: teamB || "Team B", value: teamB || "Team B", odds: 2.2 },
  ];
  if (type === "score_range")
    return SCORE_RANGE_PRESETS[2].options.map((o, i) => ({ ...o, id: i + 1 })); // ODI std default
  return [
    { id: 1, label: "Option A", value: "option_a", odds: 2.0 },
    { id: 2, label: "Option B", value: "option_b", odds: 2.0 },
  ];
}

export default function PredictionCreate() {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL_FORM);
  const [options, setOptions] = useState(getDefaultOptions("win_loss", "", ""));
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [fixtures, setFixtures]               = useState([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (!id) return;

    adminMatchesAPI.getMatchDetails(id)
      .then((res) => {
        const m = res.match;

        const toLocal = (str) => {
          const d = parseDate(str);
          if (!d) return "";
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        };

        setForm((prev) => ({
          ...prev,
          sportmonks_id: m.id,
          title: m.title || "",
          team_a: m.team_a,
          team_b: m.team_b,
          match_start_time: toLocal(m.starting_at),
          prediction_close_time: toLocal(m.prediction_close_time),
          prediction_close_mode: m.prediction_close_mode || "before_start",
          estimated_end_time: toLocal(m.estimated_end_time) || "",
          stake_cost: m.stake_cost,
          zero_cost_enabled: m.zero_cost_enabled,
        }));

        setOptions(
          (m.options || []).map((o, i) => ({
            id: i + 1,
            label: o.label,
            value: o.label,
            odds: o.odds
          }))
        );
      })
      .catch(() => toast.error("Failed to load match"));
  }, [id]);

  useEffect(() => {
    if (id) return;

    adminMatchesAPI.getFixtures()
      .then((data) => setFixtures(data.fixtures || []))
      .catch(() => toast.error("Failed to load fixtures"))
      .finally(() => setFixturesLoading(false));
  }, [id]);

  const handleFixtureSelect = (fixtureId) => {
    if (!fixtureId) { 
      setForm(INITIAL_FORM); 
      setOptions(getDefaultOptions("win_loss", "", "")); 
      return; 
    }
    const fixture = fixtures.find((f) => String(f.id) === String(fixtureId));
    if (!fixture) return;

    const toLocal = (str) => {
      const d = parseDate(str);
      if (!d) return "";
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const startTime = toLocal(fixture.starting_at);
    const closeD    = parseDate(fixture.starting_at);
    const closeTime = closeD ? toLocal(new Date(closeD.getTime() - 30 * 60 * 1000).toISOString()) : "";
    const estimatedEnd = closeD
      ? toLocal(new Date(closeD.getTime() + 3 * 60 * 60 * 1000).toISOString()) // +3h
      : "";

    setForm((prev) => ({
      ...prev,
      sportmonks_id: fixture.id,
      team_a: fixture.team_a, 
      team_b: fixture.team_b,
      match_start_time: startTime, 
      prediction_close_time: closeTime,
      prediction_close_mode: "before_start",
      estimated_end_time: estimatedEnd,
    }));
    setOptions(getDefaultOptions("win_loss", fixture.team_a, fixture.team_b));
  };

  const setField = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if ((field === "team_a" || field === "team_b") && prev.prediction_type === "win_loss") {
        setOptions((opts) => opts.map((o, i) => {
          const name = i === 0
            ? (field === "team_a" ? value : prev.team_a)
            : (field === "team_b" ? value : prev.team_b);
          return { ...o, label: name, value: name };
        }));
      }
      return updated;
    });
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleTypeChange = (type) => {
    setField("prediction_type", type);
    setOptions(getDefaultOptions(type, form.team_a, form.team_b));
  };

  const updateOption = (idx, field, val) => {
    setOptions((prev) => prev.map((o, i) => {
      if (i !== idx) return o;
      // For win/loss, keep label and value in sync (both = team name)
      if (field === "label" && form.prediction_type === "win_loss")
        return { ...o, label: val, value: val };
      return { ...o, [field]: val };
    }));
  };

  const addOption = () => {
    const sr = form.prediction_type === "score_range";
    setOptions((prev) => [...prev, {
      id: Date.now(),
      label: sr ? "New Range"         : `Option ${prev.length + 1}`,
      value: sr ? "0_0"               : `option_${prev.length + 1}`,
      odds: 2.0,
    }]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) { toast.error("Minimum 2 options required"); return; }
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs = {};
    if (!form.sportmonks_id)         errs.sportmonks_id = "Please select a fixture";
    if (!form.team_a.trim())         errs.team_a = "Required";
    if (!form.team_b.trim())         errs.team_b = "Required";
    if (!form.match_start_time)      errs.match_start_time = "Required";
    if (form.prediction_close_mode === "before_start") {
      if (!form.prediction_close_time)
        errs.prediction_close_time = "Required";
    }

    if (form.prediction_close_mode === "auto_on_end") {
      if (!form.estimated_end_time)
        errs.estimated_end_time = "Required";
    }
    if (form.team_a === form.team_b && form.team_a) errs.team_b = "Must differ from Team A";

    if (form.prediction_close_mode === "before_start") {
      if (!form.prediction_close_time)
        errs.prediction_close_time = "Required";
    }

    if (form.prediction_close_mode === "auto_on_end") {
      if (!form.estimated_end_time)
        errs.estimated_end_time = "Required";
    }

    if (!form.zero_cost_enabled && (form.stake_cost < 1 || form.stake_cost > 10000))
      errs.stake_cost = "Stake must be 1–10000 pts";
    options.forEach((o, i) => {
      if (!o.label.trim()) errs[`opt_label_${i}`] = "Required";
      if (!o.value.trim()) errs[`opt_value_${i}`] = "Required";
      if (o.odds < PLATFORM_CONFIG.min_odds || o.odds > PLATFORM_CONFIG.max_odds)
        errs[`opt_odds_${i}`] = `Must be ${PLATFORM_CONFIG.min_odds}×–${PLATFORM_CONFIG.max_odds}×`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        sportmonks_id: form.sportmonks_id,
        match_start_time: form.match_start_time,
        prediction_close_time: form.prediction_close_time,
        participation_cost: form.zero_cost_enabled ? 0 : form.stake_cost,
        allow_zero_cost: form.zero_cost_enabled,
        title: form.title,
        prediction_close_mode: form.prediction_close_mode,
        estimated_end_time: form.estimated_end_time,
        options: options.map((o) => ({
          label: o.label,
          value: o.value,
          type: form.prediction_type === "score_range" ? "score_range" : "winner",
          odds: o.odds,
        })),
      };

      if (isEdit) {
        // ✅ EDIT FLOW
        await adminMatchesAPI.updateMatch(id, payload);
        toast.success("✅ Match updated successfully!");
      } else {
        // ✅ CREATE FLOW
        await adminMatchesAPI.createMatch(payload);
        toast.success("✅ Match created and opened for predictions!");
      }

      navigate("/admin/predictions");

    } catch (err) {
      toast.error(err.message || (isEdit ? "Failed to update match" : "Failed to create match"));
    } finally {
      setSaving(false);
    }
  };

  const potentialMax = form.stake_cost
    ? Math.max(...options.map((o) => Math.round(form.stake_cost * o.odds)))
    : 0;

  const isScoreRange = form.prediction_type === "score_range";

  return (
    <AdminLayout title="Create Match" breadcrumbs={["Admin", "Predictions", "Create Match"]}>
      <div className="prediction-mgmt-header">
        <div className="prediction-mgmt-icon"><Trophy size={24} strokeWidth={2.5} color="#fff" /></div>
        <div>
          <h1 className="prediction-mgmt-title">Create Prediction Match</h1>
          <p className="prediction-mgmt-subtitle">Select a synced fixture and configure prediction settings.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <button className="admin-button admin-button-secondary" onClick={() => navigate("/admin/predictions")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} strokeWidth={2.5} /> Back
          </button>
        </div>

        {/* Fixture */}
        <div className="form-section-label">Select Fixture</div>
        <div className="prediction-form-grid">
          <div className="form-group form-group-full">
            <label className="form-label">Match Fixture <span className="required">*</span></label>
            <select className={`form-select${errors.sportmonks_id ? " error" : ""}`}
              value={form.sportmonks_id} onChange={(e) => handleFixtureSelect(e.target.value)} disabled={fixturesLoading || isEdit}>
              <option value="">{fixturesLoading ? "Loading..." : "— Select a fixture —"}</option>
              {fixtures
                .filter((f) => {
                  const state = (f.match_state || "").toLowerCase();

                  if (state === "completed") return false;

                  const matchTime = parseDate(f.starting_at);
                  if (!matchTime) return true;

                  const now = new Date();

                  // ✅ get start of today
                  const todayStart = new Date();
                  todayStart.setHours(0, 0, 0, 0);

                  // ✅ allow today's + future matches
                  return matchTime >= todayStart;
                })
                .map((f) => {
                  const d = parseDate(f.starting_at);
                  const ds = d
                    ? d.toLocaleString("en-SL", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "TBC";

                  return (
                    <option key={f.id} value={f.id}>
                      {f.team_a} vs {f.team_b} — {ds}
                    </option>
                  );
                })}
            </select>
            {errors.sportmonks_id && <span className="form-error">{errors.sportmonks_id}</span>}
          </div>
        </div>

        {/* Match Details */}
        <div className="form-section-label" style={{ marginTop: 24 }}>Match Details</div>
        <div className="prediction-form-grid">
          <div className="form-group form-group-full">
            <label className="form-label">Match Title <span className="form-hint">(optional)</span></label>
            <input className="form-input" placeholder="e.g. IPL Final 2025" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Team A <span className="required">*</span></label>
            <input className={`form-input${errors.team_a ? " error" : ""}`} value={form.team_a} onChange={(e) => setField("team_a", e.target.value)} disabled={isEdit} />
            {errors.team_a && <span className="form-error">{errors.team_a}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Team B <span className="required">*</span></label>
            <input className={`form-input${errors.team_b ? " error" : ""}`} value={form.team_b} onChange={(e) => setField("team_b", e.target.value)} disabled={isEdit} />
            {errors.team_b && <span className="form-error">{errors.team_b}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Sport Type</label>
            <select className="form-select" value={form.sport_type} onChange={(e) => setField("sport_type", e.target.value)}>
              <option value="cricket">🏏 Cricket</option>
              <option value="football">⚽ Football</option>
              <option value="other">🎯 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tournament / League</label>
            <input className="form-input" placeholder="e.g. IPL 2025" value={form.tournament} onChange={(e) => setField("tournament", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Match Start Time <span className="required">*</span></label>
            <input type="datetime-local" className={`form-input${errors.match_start_time ? " error" : ""}`}
              value={form.match_start_time} onChange={(e) => setField("match_start_time", e.target.value)} />
            {errors.match_start_time && <span className="form-error">{errors.match_start_time}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Prediction Close Time <span className="required">*</span></label>
            <input type="datetime-local" className={`form-input${errors.prediction_close_time ? " error" : ""}`}
              value={form.prediction_close_time} onChange={(e) => setField("prediction_close_time", e.target.value)} />
            {errors.prediction_close_time && <span className="form-error">{errors.prediction_close_time}</span>}
            <span className="form-hint">Must be before match start</span>
          </div>
        </div>

        {/* Prediction Close Mode */}
        <div className="form-group">
          <label className="form-label">Prediction Close Mode</label>
          <select
            className="form-select"
            value={form.prediction_close_mode}
            onChange={(e) => setField("prediction_close_mode", e.target.value)}
          >
            <option value="before_start">Close before match start</option>
            <option value="manual">Manual close (admin control)</option>
            <option value="auto_on_end">Auto close at match end</option>
          </select>

          <span className="form-hint">
            Controls when predictions will automatically close
          </span>
        </div>

        {/* SHOW ESTIMATED END TIME (CONDITIONAL) */}
        {form.prediction_close_mode === "auto_on_end" && (
          <div className="form-group">
            <label className="form-label">
              Estimated Match End Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={form.estimated_end_time}
              onChange={(e) => setField("estimated_end_time", e.target.value)}
            />
            <span className="form-hint">
              Used to auto-close predictions near match end
            </span>
          </div>
        )}

        {/* Prediction Type */}
        <div className="form-section-label" style={{ marginTop: 24 }}>Prediction Type</div>
        <div className="pred-type-grid">
          {PREDICTION_TYPES.map((type) => (
            <button key={type.value} type="button"
              className={`pred-type-card${form.prediction_type === type.value ? " selected" : ""}`}
              onClick={() => handleTypeChange(type.value)}>
              <div className="pred-type-title">{type.label}</div>
              <div className="pred-type-desc">{type.desc}</div>
            </button>
          ))}
        </div>

        {/* Score Range Presets */}
        {isScoreRange && (
          <div style={{ marginTop: 12, padding: "14px 16px", background: "rgba(79,172,254,0.06)", borderRadius: 10, border: "1px solid rgba(79,172,254,0.15)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--admin-text-secondary)", marginBottom: 10 }}>
              ⚡ QUICK PRESETS — click to apply
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SCORE_RANGE_PRESETS.map((preset) => (
                <button key={preset.label} type="button"
                  className="admin-button admin-button-secondary"
                  style={{ fontSize: 12, padding: "5px 12px" }}
                  onClick={() => setOptions(preset.options.map((o, i) => ({ ...o, id: i + 1 })))}>
                  {preset.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", marginTop: 10 }}>
              💡 Settlement key format: &nbsp;
              <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>under_250</code> &nbsp;
              <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>250_300</code> &nbsp;
              <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>over_300</code>
            </div>
          </div>
        )}

        {/* Entry & Stake */}
        <div className="form-section-label" style={{ marginTop: 24 }}>Entry & Points</div>
        <div className="stake-config-row">
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label">Stake Cost (pts) <span className="required">*</span></label>
            <input type="number" min={0} className={`form-input${errors.stake_cost ? " error" : ""}`}
              value={form.stake_cost} onChange={(e) => setField("stake_cost", parseInt(e.target.value) || 0)}
              disabled={form.zero_cost_enabled} style={{ opacity: form.zero_cost_enabled ? 0.4 : 1 }} />
            {errors.stake_cost && <span className="form-error">{errors.stake_cost}</span>}
            <span className="form-hint">Points users spend to participate</span>
          </div>
          <div className="form-group" style={{ margin: 0, paddingTop: 22 }}>
            <label className="form-toggle">
              <input type="checkbox" checked={form.zero_cost_enabled} onChange={(e) => setField("zero_cost_enabled", e.target.checked)} />
              <span className="toggle-track" />
              <span className="toggle-label">Zero-cost (free entry)</span>
            </label>
            <span className="form-hint">No stake required — flat reward for correct picks</span>
          </div>
          {!form.zero_cost_enabled && potentialMax > 0 && (
            <div className="stake-preview">
              <div className="stake-preview-label">Max Potential Reward</div>
              <div className="stake-preview-value">🎯 {potentialMax} pts</div>
              <div className="stake-preview-formula">{form.stake_cost} × {Math.max(...options.map(o => o.odds))}×</div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="form-section-label" style={{ marginTop: 24 }}>
          Prediction Options & Odds
          <span className="form-hint" style={{ marginLeft: 10 }}>
            Platform cap: {PLATFORM_CONFIG.min_odds}× – {PLATFORM_CONFIG.max_odds}×
          </span>
        </div>

        <div className="options-config-list">
          {options.map((opt, idx) => (
            <div key={opt.id} className="option-config-row">

              {/* Display label */}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "var(--admin-text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Display Label
                </label>
                <input
                  className={`form-input${errors[`opt_label_${idx}`] ? " error" : ""}`}
                  placeholder={isScoreRange ? "e.g. Under 250 runs" : "e.g. Mumbai Indians"}
                  value={opt.label}
                  onChange={(e) => updateOption(idx, "label", e.target.value)}
                />
                {errors[`opt_label_${idx}`] && <span className="form-error">{errors[`opt_label_${idx}`]}</span>}
              </div>

              {/* Settlement key — only for score_range */}
              {isScoreRange && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "var(--admin-text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Settlement Key
                  </label>
                  <input
                    className={`form-input${errors[`opt_value_${idx}`] ? " error" : ""}`}
                    placeholder="under_250 / 250_300 / over_300"
                    value={opt.value}
                    onChange={(e) => updateOption(idx, "value", e.target.value)}
                  />
                  {errors[`opt_value_${idx}`] && <span className="form-error">{errors[`opt_value_${idx}`]}</span>}
                </div>
              )}

              <OddsInput label="Odds" value={opt.odds}
                onChange={(v) => updateOption(idx, "odds", v)}
                min={PLATFORM_CONFIG.min_odds} max={PLATFORM_CONFIG.max_odds} />

              {!form.zero_cost_enabled && (
                <div className="option-reward-preview">
                  <div style={{ fontSize: 10, color: "var(--admin-text-secondary)", fontWeight: 600, marginBottom: 2 }}>REWARD</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fbbf24" }}>{Math.round(form.stake_cost * opt.odds)} pts</div>
                </div>
              )}

              <button className="admin-button admin-button-secondary"
                style={{ padding: "8px 10px", marginTop: 18, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                onClick={() => removeOption(idx)}>
                <Trash2 size={13} strokeWidth={2.5} />
              </button>
            </div>
          ))}

          <button className="admin-button admin-button-secondary"
            style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}
            onClick={addOption}>
            <Plus size={13} strokeWidth={2.5} /> Add Option
          </button>
        </div>

        {/* Footer */}
        <div className="prediction-form-footer">
          <button className="admin-button admin-button-secondary"
            onClick={() => { setForm(INITIAL_FORM); setOptions(getDefaultOptions("win_loss", "", "")); setErrors({}); }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <X size={13} strokeWidth={2.5} /> Reset
          </button>
          <button className="admin-button admin-button-primary" onClick={handleSave} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Save size={13} strokeWidth={2.5} />
            {saving ? "Creating..." : "Create Match"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}