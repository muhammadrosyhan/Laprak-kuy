"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clipboard,
  Cloud,
  Copy,
  Download,
  FileCheck,
  FilePlus2,
  FileText,
  FolderOpen,
  ImagePlus,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  Settings,
  Trash2,
  UploadCloud,
  X,
  GripVertical,
  PencilLine,
  Eye,
  Save,
  Monitor,
  ListChecks,
  Image as ImageIcon,
} from "lucide-react";
import {
  freshPractical,
  initialProfile,
  sampleReport,
  uid,
  type ImageItem,
  type Practical,
  type Profile,
  type Report,
} from "../lib/types";

type Tab =
  | "cover"
  | "pretest"
  | "tools"
  | "steps"
  | "implementation"
  | "analysis"
  | "posttest";
const tabs: { key: Tab; label: string; small: string }[] = [
  { key: "cover", label: "Cover & Identitas", small: "Informasi dasar" },
  { key: "pretest", label: "I. Pre Test", small: "Soal dan jawaban" },
  { key: "tools", label: "II. Alat & Bahan", small: "Perlengkapan" },
  { key: "steps", label: "Langkah Kerja", small: "Urutan praktikum" },
  {
    key: "implementation",
    label: "Implementasi",
    small: "Screenshot & penjelasan",
  },
  { key: "analysis", label: "Analisis Hasil", small: "Pembahasan" },
  { key: "posttest", label: "III. Post Test", small: "Evaluasi akhir" },
];
const dateLabel = (s: string) => {
  if (!s) return "—";
  const a = new Date(`${s}T12:00:00`);
  return isNaN(a.getTime())
    ? s
    : new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(a);
};
const humanUpdated = (s: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(s));
const newReport = (): Report => ({
  ...sampleReport(),
  id: uid(),
  course: "",
  topic: "",
  meeting: "1",
  date: new Date().toISOString().slice(0, 10),
  session: "",
  objective: "",
  pretest: "",
  pretestImages: [],
  tools: [""],
  practicals: [freshPractical(1)],
  analysis: "",
  posttest: "",
  posttestImages: [],
  posttestExplanation: "",
});
function ImageUploader({
  images,
  onChange,
  captionPrefix = "Gambar",
  numberStart = 1,
}: {
  images: ImageItem[];
  onChange: (v: ImageItem[]) => void;
  captionPrefix?: string;
  numberStart?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const addFiles = async (files: FileList | File[] | null) => {
    if (!files?.length) return;
    const next: ImageItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 4 * 1024 * 1024) {
        alert(
          `Ukuran ${file.name} lebih dari 4 MB. Gunakan gambar yang lebih kecil untuk penyimpanan lokal.`,
        );
        continue;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      next.push({
        id: uid(),
        name: file.name,
        dataUrl,
        caption: file.name.replace(/\.[^.]+$/, "").replaceAll("_", " "),
      });
    }
    onChange([...images, ...next]);
  };
  return (
    <div className="space-y-3">
      <input
        ref={input}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") input.current?.click();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void addFiles(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          if (e.clipboardData.files.length)
            void addFiles(e.clipboardData.files);
        }}
        onClick={() => input.current?.click()}
        className={"upload-box " + (drag ? "upload-drag" : "")}
      >
        <UploadCloud size={24} />
        <strong>Klik atau tarik screenshot ke sini</strong>
        <span>PNG, JPG, WEBP — maks. 4 MB per gambar</span>
        <span>Bisa juga paste Ctrl+V di area ini</span>
      </div>
      {images.map((im, i) => (
        <div className="image-row" key={im.id}>
          <img src={im.dataUrl} alt={im.caption} />
          <div className="flex-1 min-w-0">
            <label className="field-label">
              Keterangan gambar {numberStart + i}
            </label>
            <input
              className="field-input"
              value={im.caption}
              onChange={(e) =>
                onChange(
                  images.map((x) =>
                    x.id === im.id ? { ...x, caption: e.target.value } : x,
                  ),
                )
              }
            />
            <p className="muted text-xs mt-2 truncate">{im.name}</p>
          </div>
          <button
            className="icon-btn danger"
            title="Hapus gambar"
            onClick={() => onChange(images.filter((x) => x.id !== im.id))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
function DocumentPreview({
  report,
  profile,
}: {
  report: Report;
  profile: Profile;
}) {
  let number = 0;
  const image = (im: ImageItem) => {
    number++;
    return (
      <figure key={im.id} className="doc-figure">
        <img src={im.dataUrl} alt={im.caption} />
        <figcaption>
          Gambar {report.meeting || "1"}.{number} {im.caption}
        </figcaption>
      </figure>
    );
  };
  return (
    <div className="document" id="print-document">
      <section className="doc-page doc-cover">
        <div className="cover-top">
          <strong>LAPORAN PRAKTIKUM</strong>
          <h1>{report.course || "Nama Mata Kuliah"}</h1>
          <h2>{report.topic || "Materi Praktikum"}</h2>
          <p>{dateLabel(report.date)}</p>
          <p>Sesi {report.session || "—"}</p>
        </div>
        <div className="cover-logo" aria-hidden="true" />
        <div className="cover-bottom">
          <p>Disusun Oleh:</p>
          <strong>{profile.name || "Nama Mahasiswa"}</strong>
          <p>{profile.nim || "NIM"}</p>
        </div>
        <div className="cover-school">
          <strong>PROGRAM STUDI {profile.study.toUpperCase()}</strong>
          <strong>{profile.faculty.toUpperCase()}</strong>
          <strong>{profile.university.toUpperCase()}</strong>
          <strong>{profile.year}</strong>
        </div>
      </section>
      <section className="doc-page doc-content">
        <h2>I. &nbsp; Pre Test</h2>
        <p className="preserve">{report.pretest || "Belum diisi."}</p>
        {report.pretestImages.map(image)}
        <h2>II. &nbsp; Hasil Praktikum</h2>
        {report.objective && (
          <>
            <h3>Tujuan Praktikum</h3>
            <p className="preserve">{report.objective}</p>
          </>
        )}
        <h3>A. Alat dan Bahan:</h3>
        <ol>
          {report.tools.filter(Boolean).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
        <h3>B. Langkah Kerja</h3>
        {report.practicals.map((p, i) => (
          <div key={p.id}>
            <h4>
              {String.fromCharCode(65 + i)}. Langkah Kerja {p.title}
            </h4>
            <ol>
              {p.steps.filter(Boolean).map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
        <h3>C. Implementasi/Screenshot</h3>
        {report.practicals.map((p) => (
          <div key={p.id} className="doc-practical">
            {p.images.length ? (
              p.images.map(image)
            ) : (
              <p className="placeholder-print">Belum ada screenshot.</p>
            )}
            {p.explanation && (
              <p className="preserve">
                <strong>Penjelasan:</strong> {p.explanation}
              </p>
            )}
          </div>
        ))}
        <h3>D. Analisis Hasil</h3>
        <p className="preserve">{report.analysis || "Belum diisi."}</p>
        <h2>III. &nbsp; Post Test</h2>
        <p className="preserve">{report.posttest || "Belum diisi."}</p>
        {report.posttestImages.map(image)}
        {report.posttestExplanation && (
          <p className="preserve">
            <strong>Penjelasan :</strong> {report.posttestExplanation}
          </p>
        )}
      </section>
    </div>
  );
}
export default function Home() {
  const [reports, setReports] = useState<Report[]>([]),
    [profile, setProfile] = useState<Profile>(initialProfile),
    [ready, setReady] = useState(false),
    [activeId, setActiveId] = useState<string | null>(null),
    [tab, setTab] = useState<Tab>("cover"),
    [panel, setPanel] = useState<"edit" | "preview">("edit"),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [showSettings, setShowSettings] = useState(false),
    [sidebar, setSidebar] = useState(false),
    [saveError, setSaveError] = useState("");
  useEffect(() => {
    try {
      const r = localStorage.getItem("praktinote:reports");
      const p = localStorage.getItem("praktinote:profile");
      if (r) setReports(JSON.parse(r));
      if (p) setProfile({ ...initialProfile, ...JSON.parse(p) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("praktinote:reports", JSON.stringify(reports));
      localStorage.setItem("praktinote:profile", JSON.stringify(profile));
      setSaveError("");
    } catch {
      setSaveError(
        "Penyimpanan browser penuh. Hapus gambar besar atau export cadangan JSON.",
      );
    }
  }, [reports, profile, ready]);
  const active = reports.find((r) => r.id === activeId);
  const update = (fn: (r: Report) => Report) =>
    setReports((prev) =>
      prev.map((r) =>
        r.id === activeId
          ? { ...fn(r), updatedAt: new Date().toISOString() }
          : r,
      ),
    );
  const patch = (p: Partial<Report>) => update((r) => ({ ...r, ...p }));
  const patchPractical = (id: string, p: Partial<Practical>) =>
    update((r) => ({
      ...r,
      practicals: r.practicals.map((x) => (x.id === id ? { ...x, ...p } : x)),
    }));
  const addReport = () => {
    const r = newReport();
    setReports((p) => [r, ...p]);
    setActiveId(r.id);
    setTab("cover");
    setPanel("edit");
    setSidebar(false);
  };
  const duplicates = (r: Report) => {
    const v = {
      ...r,
      id: uid(),
      topic: r.topic + " (Salinan)",
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReports((x) => [v, ...x]);
    setActiveId(v.id);
  };
  const filtered = useMemo(
    () =>
      reports.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          `${r.course} ${r.topic}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [reports, search, filter],
  );
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ profile, reports }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "PraktiNote-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const restoreBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.reports) || !data.profile)
        throw Error("Format tidak sesuai");
      if (
        confirm(
          "Impor backup akan mengganti seluruh data laporan saat ini. Lanjutkan?",
        )
      ) {
        setReports(data.reports);
        setProfile({ ...initialProfile, ...data.profile });
        setActiveId(null);
      }
    } catch {
      alert("File backup tidak valid.");
    }
  };
  const print = () => {
    if (!active) return;
    setPanel("preview");
    setTimeout(() => window.print(), 200);
  };
  if (!ready) return <div className="loading">Memuat PraktiNote…</div>;
  return (
    <div className="app-shell">
      <aside className={"sidebar " + (sidebar ? "sidebar-visible" : "")}>
        <div className="brand">
          <div className="brand-symbol">
            <BookOpen size={23} />
          </div>
          <div>
            <strong>PraktiNote</strong>
            <span>Personal workspace</span>
          </div>
          <button
            className="mobile-close icon-btn"
            onClick={() => setSidebar(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="side-group">
          <p className="side-caption">WORKSPACE</p>
          <button
            className={"side-link " + (!activeId ? "selected" : "")}
            onClick={() => {
              setActiveId(null);
              setSidebar(false);
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="side-link" onClick={addReport}>
            <FilePlus2 size={18} /> Laporan baru
          </button>
        </div>
        <div className="side-group">
          <p className="side-caption">AKSES CEPAT</p>
          {reports.slice(0, 5).map((r) => (
            <button
              key={r.id}
              className={
                "side-link side-report " + (r.id === activeId ? "selected" : "")
              }
              onClick={() => {
                setActiveId(r.id);
                setTab("cover");
                setPanel("edit");
                setSidebar(false);
              }}
            >
              <FileText size={17} />
              <span>{r.course || "Tanpa mata kuliah"}</span>
            </button>
          ))}
          {reports.length === 0 && (
            <p className="side-note">Belum ada laporan.</p>
          )}
        </div>
        <div className="sidebar-bottom">
          <button
            className="side-link"
            onClick={() => {
              setShowSettings(true);
              setSidebar(false);
            }}
          >
            <Settings size={18} /> Pengaturan & Identitas
          </button>
          <div className="identity-box">
            <div className="avatar">
              {(profile.name || "P").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{profile.name || "Mahasiswa"}</strong>
              <small>{profile.nim || "Lengkapi identitas"}</small>
            </div>
          </div>
        </div>
      </aside>
      {sidebar && (
        <div className="mobile-overlay" onClick={() => setSidebar(false)} />
      )}
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button
              className="mobile-menu icon-btn"
              onClick={() => setSidebar(true)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumbs">
              Workspace <span>/</span>{" "}
              {active ? active.course || "Laporan baru" : "Dashboard"}
            </span>
          </div>
          <div className="top-actions">
            <span
              className={"save-indicator " + (saveError ? "save-error" : "")}
            >
              <Cloud size={15} />{" "}
              {saveError ? "Gagal menyimpan" : "Tersimpan di browser"}
            </span>
            <button
              className="icon-btn"
              title="Pengaturan"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={18} />
            </button>
          </div>
        </header>
        {saveError && <div className="error-banner">{saveError}</div>}
        {!active ? (
          <div className="dashboard content-wrap">
            <div className="welcome">
              <div>
                <p className="eyebrow">WORKSPACE / OVERVIEW</p>
                <h1>
                  Workspace Praktikum<span className="accent-dot">.</span>
                </h1>
                <p>
                  Semua laporan, screenshot, dan penjelasan praktikum dalam satu
                  tempat.
                </p>
              </div>
              <button className="primary-btn" onClick={addReport}>
                <Plus size={18} /> Buat laporan baru
              </button>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-icon purple">
                  <FileText size={19} />
                </div>
                <span>Total laporan</span>
                <strong>{reports.length}</strong>
                <small>Semua mata kuliah</small>
              </div>
              <div className="stat">
                <div className="stat-icon orange">
                  <PencilLine size={19} />
                </div>
                <span>Dalam proses</span>
                <strong>
                  {reports.filter((r) => r.status === "draft").length}
                </strong>
                <small>Masih bisa diedit</small>
              </div>
              <div className="stat">
                <div className="stat-icon green">
                  <FileCheck size={19} />
                </div>
                <span>Selesai</span>
                <strong>
                  {reports.filter((r) => r.status === "done").length}
                </strong>
                <small>Siap dikumpulkan</small>
              </div>
            </div>
            <div className="section-heading">
              <div>
                <h2>Laporan praktikum</h2>
                <p>Kelola pekerjaanmu berdasarkan mata kuliah dan materi.</p>
              </div>
            </div>
            <div className="tool-row">
              <div className="search-box">
                <Search size={17} />
                <input
                  placeholder="Cari mata kuliah atau materi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="select-filter"
              >
                <option value="all">Semua status</option>
                <option value="draft">Draft</option>
                <option value="done">Selesai</option>
              </select>
            </div>
            {filtered.length ? (
              <div className="reports-grid">
                {filtered.map((r) => (
                  <div className="report-card" key={r.id}>
                    <div className="report-top">
                      <div className="report-icon">
                        <FileText size={21} />
                      </div>
                      <span className={"status " + r.status}>
                        {r.status === "done" ? "Selesai" : "Draft"}
                      </span>
                    </div>
                    <small className="eyebrow">
                      PERTEMUAN {r.meeting || "—"}
                    </small>
                    <h3>{r.course || "Mata kuliah belum diisi"}</h3>
                    <p>{r.topic || "Materi belum diisi"}</p>
                    <div className="report-foot">
                      <span>
                        <CalendarDays size={13} />
                        {humanUpdated(r.updatedAt)}
                      </span>
                      <button
                        onClick={() => {
                          setActiveId(r.id);
                          setTab("cover");
                          setPanel("edit");
                        }}
                      >
                        Buka <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <div className="empty-icon">
                  <FolderOpen size={29} />
                </div>
                <h3>
                  {reports.length
                    ? "Laporan tidak ditemukan"
                    : "Belum ada laporan"}
                </h3>
                <p>
                  {reports.length
                    ? "Coba ubah kata pencarian atau filter."
                    : "Buat laporan pertamamu. Template akan mengikuti format praktikum yang kamu kirim."}
                </p>
                <button className="primary-btn" onClick={addReport}>
                  <Plus size={17} /> Buat laporan
                </button>
              </div>
            )}
            <div className="tip">
              <div className="tip-symbol">
                <Clipboard size={20} />
              </div>
              <div>
                <strong>Tips: tempel screenshot dengan Ctrl + V</strong>
                <p>
                  Di dalam editor implementasi, gunakan area unggah untuk
                  menyisipkan kode atau output program.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="editor-shell">
            <div className="editor-toolbar">
              <div>
                <button className="back-link" onClick={() => setActiveId(null)}>
                  <ArrowLeft size={15} /> Kembali ke dashboard
                </button>
                <h1>
                  {active.course || "Laporan baru"}{" "}
                  <span>/ {active.topic || "Tanpa judul"}</span>
                </h1>
                <p>
                  Pertemuan {active.meeting || "—"} · {dateLabel(active.date)}
                </p>
              </div>
              <div className="editor-buttons">
                <button
                  className="secondary-btn"
                  onClick={() => duplicates(active)}
                >
                  <Copy size={16} /> <span>Duplikat</span>
                </button>
                <button
                  className="secondary-btn"
                  onClick={() =>
                    setPanel(panel === "preview" ? "edit" : "preview")
                  }
                >
                  {panel === "preview" ? (
                    <PencilLine size={16} />
                  ) : (
                    <Eye size={16} />
                  )}{" "}
                  {panel === "preview" ? "Edit" : "Preview A4"}
                </button>
                <button className="primary-btn" onClick={print}>
                  <Printer size={16} /> Export PDF
                </button>
              </div>
            </div>
            <div className="editor-columns">
              <nav className="outline">
                <span className="outline-title">STRUKTUR LAPORAN</span>
                {tabs.map((t, i) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTab(t.key);
                      setPanel("edit");
                    }}
                    className={
                      "outline-link " +
                      (tab === t.key && panel === "edit" ? "current" : "")
                    }
                  >
                    <span className="outline-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{t.label}</strong>
                      <small>{t.small}</small>
                    </span>
                  </button>
                ))}
                <div className="outline-footer">
                  <span>
                    <Save size={15} /> Autosave aktif
                  </span>
                  <p>Data sementara tersimpan di perangkat ini.</p>
                </div>
              </nav>
              <div
                className={
                  "editing-area " + (panel === "preview" ? "preview-area" : "")
                }
              >
                {panel === "preview" ? (
                  <>
                    <div className="pane-head">
                      <div>
                        <span className="eyebrow">PREVIEW DOKUMEN</span>
                        <h2>Pratinjau Laporan A4</h2>
                        <p>
                          Gunakan Export PDF dan pilih “Save as PDF” saat dialog
                          cetak terbuka.
                        </p>
                      </div>
                    </div>
                    <DocumentPreview report={active} profile={profile} />
                  </>
                ) : (
                  <>
                    <div className="pane-head">
                      <div>
                        <span className="eyebrow">
                          EDITOR /{" "}
                          {tabs.find((t) => t.key === tab)?.small.toUpperCase()}
                        </span>
                        <h2>{tabs.find((t) => t.key === tab)?.label}</h2>
                        <p>
                          Perubahan pada bagian ini akan tersimpan otomatis.
                        </p>
                      </div>
                      <span className="draft-pill">Draft aktif</span>
                    </div>
                    {tab === "cover" && (
                      <div className="form-section">
                        <div className="form-alert">
                          <BookOpen size={20} />
                          <div>
                            <strong>Cover dibuat otomatis</strong>
                            <p>
                              Isi detail praktikum di bawah. Nama dan NIM
                              diambil dari menu Pengaturan & Identitas.
                            </p>
                          </div>
                        </div>
                        <div className="form-grid">
                          <div className="field span-2">
                            <label>Mata kuliah</label>
                            <input
                              value={active.course}
                              placeholder="Contoh: Algoritma Pemrograman"
                              onChange={(e) =>
                                patch({ course: e.target.value })
                              }
                            />
                          </div>
                          <div className="field span-2">
                            <label>Judul / materi praktikum</label>
                            <input
                              value={active.topic}
                              placeholder="Contoh: Perulangan"
                              onChange={(e) => patch({ topic: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Pertemuan ke-</label>
                            <input
                              value={active.meeting}
                              onChange={(e) =>
                                patch({ meeting: e.target.value })
                              }
                            />
                          </div>
                          <div className="field">
                            <label>Tanggal</label>
                            <input
                              type="date"
                              value={active.date}
                              onChange={(e) => patch({ date: e.target.value })}
                            />
                          </div>
                          <div className="field span-2">
                            <label>Sesi praktikum</label>
                            <input
                              value={active.session}
                              placeholder="Contoh: Kamis, 07.00–10.00 WIB"
                              onChange={(e) =>
                                patch({ session: e.target.value })
                              }
                            />
                          </div>
                          <div className="field span-2">
                            <label>Tujuan praktikum (opsional)</label>
                            <textarea
                              rows={4}
                              value={active.objective}
                              placeholder="Tuliskan tujuan pelaksanaan praktikum..."
                              onChange={(e) =>
                                patch({ objective: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="info-panel">
                          <strong>Identitas cover</strong>
                          <p>
                            {profile.name || "Nama belum diisi"} ·{" "}
                            {profile.nim || "NIM belum diisi"}
                          </p>
                          <button
                            className="text-action"
                            onClick={() => setShowSettings(true)}
                          >
                            Ubah identitas <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                    {tab === "pretest" && (
                      <div className="form-section">
                        <div className="field">
                          <label>Soal dan jawaban Pre Test</label>
                          <textarea
                            rows={8}
                            placeholder="Tuliskan pertanyaan, algoritma, atau jawaban Pre Test..."
                            value={active.pretest}
                            onChange={(e) => patch({ pretest: e.target.value })}
                          />
                        </div>
                        <div className="sub-heading">
                          <h3>Dokumentasi Pre Test</h3>
                          <p>Foto jawaban tulis tangan atau screenshot kode.</p>
                        </div>
                        <ImageUploader
                          images={active.pretestImages}
                          onChange={(v) => patch({ pretestImages: v })}
                        />
                      </div>
                    )}
                    {tab === "tools" && (
                      <div className="form-section">
                        <div className="sub-heading">
                          <h3>Alat dan Bahan</h3>
                          <p>Tambah perlengkapan praktikum sesuai kebutuhan.</p>
                        </div>
                        {active.tools.map((tool, i) => (
                          <div className="inline-field" key={i}>
                            <span>{i + 1}.</span>
                            <input
                              value={tool}
                              placeholder="Contoh: Laptop / PC"
                              onChange={(e) =>
                                patch({
                                  tools: active.tools.map((x, j) =>
                                    i === j ? e.target.value : x,
                                  ),
                                })
                              }
                            />
                            <button
                              className="icon-btn danger"
                              onClick={() =>
                                patch({
                                  tools: active.tools.filter((_, j) => j !== i),
                                })
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          className="dashed-btn"
                          onClick={() =>
                            patch({ tools: [...active.tools, ""] })
                          }
                        >
                          <Plus size={17} /> Tambah alat / bahan
                        </button>
                      </div>
                    )}
                    {tab === "steps" && (
                      <div className="form-section">
                        <div className="form-alert">
                          <ListChecks size={20} />
                          <div>
                            <strong>Langkah kerja setiap praktikum</strong>
                            <p>
                              Setiap program punya daftar langkah tersendiri.
                              Penomoran dan urutan tampil otomatis.
                            </p>
                          </div>
                        </div>
                        {active.practicals.map((pr, i) => (
                          <div className="practical-card" key={pr.id}>
                            <div className="practical-head">
                              <span className="practical-count">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className="flex-1">
                                <label>Nama praktikum</label>
                                <input
                                  value={pr.title}
                                  onChange={(e) =>
                                    patchPractical(pr.id, {
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <button
                                className="icon-btn danger"
                                title="Hapus praktikum"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Hapus praktikum dan semua screenshot di dalamnya?",
                                    )
                                  )
                                    patch({
                                      practicals: active.practicals.filter(
                                        (p) => p.id !== pr.id,
                                      ),
                                    });
                                }}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                            {pr.steps.map((s, j) => (
                              <div className="inline-field" key={j}>
                                <span>{j + 1}.</span>
                                <textarea
                                  rows={2}
                                  value={s}
                                  placeholder="Tuliskan langkah kerja..."
                                  onChange={(e) =>
                                    patchPractical(pr.id, {
                                      steps: pr.steps.map((x, k) =>
                                        k === j ? e.target.value : x,
                                      ),
                                    })
                                  }
                                />
                                <button
                                  className="icon-btn danger"
                                  onClick={() =>
                                    patchPractical(pr.id, {
                                      steps: pr.steps.filter((_, k) => k !== j),
                                    })
                                  }
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                            <button
                              className="text-action"
                              onClick={() =>
                                patchPractical(pr.id, {
                                  steps: [...pr.steps, ""],
                                })
                              }
                            >
                              <Plus size={16} /> Tambah langkah
                            </button>
                            <div className="order-actions">
                              <button
                                disabled={i === 0}
                                onClick={() => {
                                  const items = [...active.practicals];
                                  [items[i], items[i - 1]] = [
                                    items[i - 1],
                                    items[i],
                                  ];
                                  patch({ practicals: items });
                                }}
                              >
                                ↑ Naik
                              </button>
                              <button
                                disabled={i === active.practicals.length - 1}
                                onClick={() => {
                                  const items = [...active.practicals];
                                  [items[i], items[i + 1]] = [
                                    items[i + 1],
                                    items[i],
                                  ];
                                  patch({ practicals: items });
                                }}
                              >
                                ↓ Turun
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          className="dashed-btn"
                          onClick={() =>
                            patch({
                              practicals: [
                                ...active.practicals,
                                freshPractical(active.practicals.length + 1),
                              ],
                            })
                          }
                        >
                          <Plus size={17} /> Tambah praktikum baru
                        </button>
                      </div>
                    )}
                    {tab === "implementation" && (
                      <div className="form-section">
                        <div className="form-alert">
                          <ImagePlus size={20} />
                          <div>
                            <strong>
                              Screenshot & penjelasan per praktikum
                            </strong>
                            <p>
                              Tambahkan beberapa screenshot kode maupun output,
                              kemudian tulis penjelasannya.
                            </p>
                          </div>
                        </div>
                        {active.practicals.map((pr, i) => (
                          <div key={pr.id} className="practical-card">
                            <div className="sub-heading">
                              <h3>{pr.title}</h3>
                              <p>
                                {pr.images.length} screenshot • Praktikum{" "}
                                {i + 1}
                              </p>
                            </div>
                            <ImageUploader
                              images={pr.images}
                              onChange={(v) =>
                                patchPractical(pr.id, { images: v })
                              }
                              numberStart={
                                1 +
                                active.pretestImages.length +
                                active.practicals
                                  .slice(0, i)
                                  .reduce((n, x) => n + x.images.length, 0)
                              }
                            />
                            <div className="field">
                              <label>Penjelasan program</label>
                              <textarea
                                rows={5}
                                value={pr.explanation}
                                placeholder="Jelaskan kode, output, dan hasil pengujian..."
                                onChange={(e) =>
                                  patchPractical(pr.id, {
                                    explanation: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                        {!active.practicals.length && (
                          <div className="empty-inner">
                            Belum ada praktikum. Tambahkan dari menu Langkah
                            Kerja.
                          </div>
                        )}
                      </div>
                    )}
                    {tab === "analysis" && (
                      <div className="form-section">
                        <div className="field">
                          <label>Analisis hasil praktikum</label>
                          <textarea
                            rows={13}
                            value={active.analysis}
                            placeholder="Jelaskan hubungan antara tujuan, implementasi program, dan hasil yang diperoleh..."
                            onChange={(e) =>
                              patch({ analysis: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-alert">
                          <Clipboard size={20} />
                          <div>
                            <strong>Catatan</strong>
                            <p>
                              Analisis menjelaskan hasil keseluruhan, bukan
                              sekadar mengulang keterangan setiap screenshot.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {tab === "posttest" && (
                      <div className="form-section">
                        <div className="field">
                          <label>Soal, jawaban, dan penjelasan Post Test</label>
                          <textarea
                            rows={8}
                            value={active.posttest}
                            placeholder="Tuliskan soal, jawaban, dan penjelasan program Post Test..."
                            onChange={(e) =>
                              patch({ posttest: e.target.value })
                            }
                          />
                        </div>
                        <div className="sub-heading">
                          <h3>Screenshot Post Test</h3>
                          <p>Upload kode dan output program.</p>
                        </div>
                        <ImageUploader
                          images={active.posttestImages}
                          onChange={(v) => patch({ posttestImages: v })}
                          numberStart={
                            1 +
                            active.pretestImages.length +
                            active.practicals.reduce(
                              (n, p) => n + p.images.length,
                              0,
                            )
                          }
                        />
                        <div className="field">
                          <label>
                            Penjelasan di bawah screenshot Post Test
                          </label>
                          <textarea
                            rows={5}
                            value={active.posttestExplanation || ""}
                            placeholder="Jelaskan fungsi program dan hasil output..."
                            onChange={(e) =>
                              patch({ posttestExplanation: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="editor-bottom">
                      <button
                        className="secondary-btn"
                        disabled={tabs.findIndex((t) => t.key === tab) === 0}
                        onClick={() =>
                          setTab(
                            tabs[
                              Math.max(
                                0,
                                tabs.findIndex((t) => t.key === tab) - 1,
                              )
                            ].key,
                          )
                        }
                      >
                        <ArrowLeft size={16} /> Sebelumnya
                      </button>
                      <div className="bottom-right">
                        <select
                          value={active.status}
                          onChange={(e) =>
                            patch({
                              status: e.target.value as "draft" | "done",
                            })
                          }
                        >
                          <option value="draft">Draft</option>
                          <option value="done">Selesai</option>
                        </select>
                        <button
                          className="primary-btn"
                          onClick={() => {
                            const next =
                              tabs.findIndex((t) => t.key === tab) + 1;
                            if (next < tabs.length) setTab(tabs[next].key);
                            else setPanel("preview");
                          }}
                        >
                          {tab === "posttest" ? "Lihat preview" : "Berikutnya"}{" "}
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      {showSettings && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowSettings(false);
          }}
        >
          <div className="modal">
            <div className="modal-title">
              <div>
                <span className="eyebrow">PERSONALISASI</span>
                <h2>Identitas & Pengaturan</h2>
                <p>Data ini otomatis digunakan untuk cover seluruh laporan.</p>
              </div>
              <button
                className="icon-btn"
                onClick={() => setShowSettings(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                {(
                  [
                    { key: "name", label: "Nama lengkap" },
                    { key: "nim", label: "NIM" },
                    { key: "study", label: "Program studi" },
                    { key: "faculty", label: "Fakultas" },
                    { key: "university", label: "Universitas" },
                    { key: "year", label: "Tahun akademik" },
                  ] as { key: keyof Profile; label: string }[]
                ).map((item) => (
                  <div
                    className={
                      "field " +
                      (item.key === "name" || item.key === "university"
                        ? "span-2"
                        : "")
                    }
                    key={item.key}
                  >
                    <label>{item.label}</label>
                    <input
                      value={profile[item.key]}
                      onChange={(e) =>
                        setProfile({ ...profile, [item.key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="backup-actions">
                <h3>Cadangkan data</h3>
                <p>
                  Data hanya tersimpan di browser ini. Export JSON secara
                  berkala agar tidak hilang.
                </p>
                <button className="secondary-btn" onClick={exportBackup}>
                  <Download size={16} /> Export backup JSON
                </button>
                <label className="secondary-btn file-label">
                  <UploadCloud size={16} /> Import backup JSON
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={(e) => void restoreBackup(e.target.files?.[0])}
                    hidden
                  />
                </label>
              </div>
              {active && (
                <button
                  className="danger-btn"
                  onClick={() => {
                    if (confirm("Hapus laporan ini secara permanen?")) {
                      setReports(reports.filter((r) => r.id !== active.id));
                      setActiveId(null);
                      setShowSettings(false);
                    }
                  }}
                >
                  <Trash2 size={16} /> Hapus laporan yang sedang dibuka
                </button>
              )}
            </div>
            <div className="modal-bottom">
              <button
                className="primary-btn"
                onClick={() => setShowSettings(false)}
              >
                <Check size={16} /> Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
