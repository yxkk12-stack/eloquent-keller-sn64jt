import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  User,
  Calendar,
  Briefcase,
  Building2,
  CreditCard,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Save,
  Eraser,
  Settings,
  WifiOff,
  AlertTriangle,
  HelpCircle,
  X,
  ShieldCheck,
  FileSpreadsheet,
  Search,
  Sparkles,
  ArrowDownCircle,
  Cake,
  Database,
  RefreshCw,
  History,
  Edit3,
  PenTool,
  LayoutDashboard,
  FileText,
  PieChart,
  Users,
  TrendingUp,
  Lightbulb,
  Bot,
  Hash,
  Printer,
  Filter,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square,
  Download,
  Trash2,
  Disc,
  CloudUpload,
  Link as LinkIcon,
  FileCheck,
  SortAsc,
  SortDesc,
  ListFilter,
  Image as ImageIcon,
  ClipboardList,
  Trophy,
  Activity,
  ArrowRightCircle,
  ThumbsDown,
  XCircle,
  Loader2,
} from "lucide-react";

const App = () => {
  // --- Global State ---
  const [googleScriptUrl, setGoogleScriptUrl] = useState("");
  const [currentView, setCurrentView] = useState("registration"); // 'registration' | 'dashboard' | 'screening' | 'results'
  const [showConfig, setShowConfig] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Load Libraries
  useEffect(() => {
    const scriptH2C = document.createElement("script");
    scriptH2C.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    scriptH2C.async = true;
    document.body.appendChild(scriptH2C);

    const scriptXLSX = document.createElement("script");
    scriptXLSX.src =
      "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    scriptXLSX.async = true;
    document.body.appendChild(scriptXLSX);

    return () => {
      if (document.body.contains(scriptH2C))
        document.body.removeChild(scriptH2C);
      if (document.body.contains(scriptXLSX))
        document.body.removeChild(scriptXLSX);
    };
  }, []);

  // --- Helpers ---
  const getCleanUrl = (url) => {
    if (!url) return "";
    let clean = url.trim();
    if (clean.startsWith("http://"))
      clean = clean.replace("http://", "https://");
    return clean;
  };

  const validateUrl = (url) => {
    if (!url) return { valid: false, msg: "กรุณาระบุ URL" };
    if (!url.includes("script.google.com"))
      return { valid: false, msg: "URL ไม่ใช่ Google Apps Script" };
    if (!url.endsWith("/exec"))
      return { valid: false, msg: "URL ต้องลงท้ายด้วย /exec" };
    return { valid: true };
  };

  const padZero = (num) => {
    if (!num && num !== 0) return "";
    // ลบ Space ออกก่อน แล้วเติม 0
    const cleanNum = num.toString().trim();
    if (cleanNum === "") return "";
    // ถ้าเป็นตัวเลข ให้เติม 0 จนครบ 3 หลัก
    return cleanNum.padStart(3, "0");
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "-";
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDateToTH = (dateString) => {
    if (!dateString) return "";
    let dateObj = dateString;
    if (typeof dateString === "string") {
      if (dateString.includes("/") && dateString.split("/")[2].length === 4)
        return dateString;
      dateObj = new Date(dateString);
    }
    if (isNaN(dateObj.getTime())) return dateString;
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${d}/${m}/${y}`;
  };

  const checkConnection = useCallback(async () => {
    const cleanUrl = getCleanUrl(googleScriptUrl);
    if (!cleanUrl) {
      setConnectionStatus("disconnected");
      return;
    }
    setConnectionStatus("checking");
    try {
      const response = await fetch(cleanUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "testConnection" }),
        redirect: "follow",
      });
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(
          data.status === "success" ? "connected" : "disconnected"
        );
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
    }
  }, [googleScriptUrl]);

  useEffect(() => {
    if (googleScriptUrl) checkConnection();
  }, [googleScriptUrl, checkConnection]);

  const StatusIndicator = () => (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
        connectionStatus === "connected"
          ? "bg-green-100 text-green-700 border-green-300"
          : connectionStatus === "checking"
          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === "connected"
            ? "bg-green-500 animate-pulse"
            : connectionStatus === "checking"
            ? "bg-yellow-500 animate-bounce"
            : "bg-red-500"
        }`}
      />
      {connectionStatus === "connected"
        ? "Connected"
        : connectionStatus === "checking"
        ? "Connecting..."
        : "Disconnected"}
    </div>
  );

  // ==========================================
  // VIEW: REGISTRATION FORM
  // ==========================================
  const RegistrationView = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [regMode, setRegMode] = useState("register");
    const [formData, setFormData] = useState({
      examDate: new Date().toISOString().split("T")[0],
      testNo: "",
      regNo: "",
      fullName: "",
      dob: "",
      employer: "",
      position: "",
      jobLine: "",
      gender: "Male",
      passport: "",
    });

    const [editTarget, setEditTarget] = useState(null);
    const [optionLists, setOptionLists] = useState({
      employers: [],
      positions: [],
      jobLines: [],
    });
    const [status, setStatus] = useState({
      type: "",
      message: "",
      details: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [foundData, setFoundData] = useState([]);
    const [searchMessage, setSearchMessage] = useState("");
    const searchRequestId = useRef(0);

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "fullName" || name === "passport" || name === "employer") {
        setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      if (name === "passport") {
        setSearchMessage("");
        setEditTarget(null);
        if (value.length < 4) setFoundData([]);
      }
    };

    // Handler for Auto-Formatting numbers on Blur
    const handleNumberBlur = (e) => {
      const { name, value } = e.target;
      const paddedValue = padZero(value);
      setFormData((prev) => ({ ...prev, [name]: paddedValue }));
    };

    const fetchOptions = async () => {
      const cleanUrl = getCleanUrl(googleScriptUrl);
      if (!cleanUrl || !cleanUrl.startsWith("http")) {
        setOptionLists({
          employers: ["DEMO CO A"],
          positions: ["Worker"],
          jobLines: ["Const"],
        });
        return;
      }
      try {
        const response = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "getOptions" }),
          redirect: "follow",
        });
        const data = await response.json();
        if (data.status === "success") setOptionLists(data.data);
      } catch (error) {
        console.warn("Fetch options error", error);
      }
    };

    useEffect(() => {
      const t = setTimeout(fetchOptions, 800);
      return () => clearTimeout(t);
    }, [googleScriptUrl]);

    const performSearch = useCallback(
      async (passportInput, isAuto = false) => {
        const passport = passportInput.trim();
        const cleanUrl = getCleanUrl(googleScriptUrl);
        if (passport.length < 4) {
          setSearchMessage("");
          setFoundData([]);
          setIsSearching(false);
          return;
        }

        const currentRequestId = ++searchRequestId.current;
        setIsSearching(true);
        if (!isAuto) setFoundData([]);
        setSearchMessage("");

        if (!cleanUrl || !cleanUrl.startsWith("http")) {
          setTimeout(() => {
            if (currentRequestId !== searchRequestId.current) return;
            setFoundData([
              {
                examDate: "2025-01-01",
                regNo: "001",
                testNo: "",
                fullName: "TEST USER",
                gender: "Male",
                dob: "1990-01-01",
                employer: "TEST CO",
                position: "Worker",
                jobLine: "General",
                sourceSheet: "Sheet1",
                rowIndex: 5,
              },
            ]);
            setIsSearching(false);
          }, 500);
          return;
        }

        try {
          const response = await fetch(cleanUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ action: "search", passport }),
            redirect: "follow",
          });
          if (currentRequestId === searchRequestId.current) {
            const data = await response.json();
            if (data.status === "found") {
              setFoundData(Array.isArray(data.data) ? data.data : [data.data]);
            } else {
              setFoundData([]);
              setSearchMessage("ไม่พบประวัติเดิม (New User)");
            }
          }
        } catch (error) {
          if (currentRequestId === searchRequestId.current) setFoundData([]);
        } finally {
          setIsSearching(false);
        }
      },
      [googleScriptUrl]
    );

    useEffect(() => {
      const timer = setTimeout(() => {
        if (formData.passport.length >= 4)
          performSearch(formData.passport, true);
      }, 400);
      return () => clearTimeout(timer);
    }, [formData.passport, performSearch]);

    const handleUseData = (record, mode = "personal") => {
      setFormData((prev) => ({
        ...prev,
        fullName: record.fullName || prev.fullName,
        gender: record.gender || "Male",
        dob: record.dob || "",
        employer: mode === "full" ? record.employer || "" : "",
        position: mode === "full" ? record.position || "" : "",
        jobLine: mode === "full" ? record.jobLine || "" : "",
        testNo: mode === "full" ? record.testNo || "" : "",
        regNo: mode === "full" ? record.regNo || "" : "",
      }));
      if (mode === "full") {
        setEditTarget({
          sourceSheet: record.sourceSheet,
          rowIndex: record.rowIndex,
        });
        setStatus({
          type: "warning",
          message: `แก้ไขข้อมูลเดิม: ${formatDateToTH(record.examDate)}`,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setEditTarget(null);
        setStatus({ type: "success", message: `ดึงข้อมูลส่วนตัวแล้ว` });
      }
    };

    const handlePreSubmit = async (e) => {
      e.preventDefault();
      if (editTarget) {
        await executeSubmit(false);
        return;
      }
      const isDuplicate = foundData.some(
        (record) => record.examDate === formData.examDate
      );
      if (isDuplicate) {
        setShowConfirmModal(true);
      } else {
        await executeSubmit(false);
      }
    };

    const executeSubmit = async (allowDuplicate = false) => {
      setShowConfirmModal(false);
      setIsSubmitting(true);
      setStatus({ type: "", message: "", details: "" });
      const cleanUrl = getCleanUrl(googleScriptUrl);

      let payload = { ...formData };
      if (editTarget) {
        payload.action = "update";
        payload.sourceSheet = editTarget.sourceSheet;
        payload.rowIndex = editTarget.rowIndex;
      } else {
        payload.action = "submit";
        payload.allowDuplicate = allowDuplicate;
      }

      if (!cleanUrl.startsWith("http")) {
        setTimeout(() => {
          setStatus({ type: "success", message: "[DEMO] บันทึกสำเร็จ" });
          setIsSubmitting(false);
          if (!editTarget)
            setFormData((prev) => ({
              ...prev,
              fullName: "",
              passport: "",
              regNo: "",
              testNo: "",
            }));
        }, 1000);
        return;
      }

      try {
        const response = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
          redirect: "follow",
        });
        const data = await response.json();
        if (data.status === "success") {
          setStatus({ type: "success", message: data.message });
          setFormData((prev) => ({
            ...prev,
            fullName: "",
            dob: "",
            passport: "",
            employer: "",
            position: "",
            jobLine: "",
            testNo: "",
            regNo: "",
          }));
          setFoundData([]);
          setEditTarget(null);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      } catch (error) {
        setStatus({ type: "error", message: "Connection Failed" });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in relative">
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
              <h3 className="text-xl font-bold mb-2">ยืนยันการลงทะเบียนซ้ำ?</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Passport นี้ลงทะเบียนในวันที่{" "}
                <strong>{formatDateToTH(formData.examDate)}</strong> แล้ว
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 bg-slate-200 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => executeSubmit(true)}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`p-6 text-white flex justify-between items-center ${
            editTarget ? "bg-orange-600" : "bg-blue-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/30">
              <img
                src="https://img5.pic.in.th/file/secure-sv1/-7b8104c674c6e9304.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {editTarget ? "แก้ไขข้อมูลเดิม" : "ลงทะเบียน / ลงสอบ"}
              </h1>
              <p className="text-white/80 text-xs mt-1">SHEBAH Exam System</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-white/70 hover:text-white"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setRegMode("register")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${
              regMode === "register"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <FileText size={16} /> โหมดลงทะเบียน (Reg No.)
          </button>
          <button
            type="button"
            onClick={() => setRegMode("exam")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${
              regMode === "exam"
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <PenTool size={16} /> โหมดลงสอบ (Test No.)
          </button>
        </div>

        <form
          onSubmit={handlePreSubmit}
          className="p-6 space-y-5 bg-slate-50/50"
        >
          {status.message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-sm border ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <b>{status.message}</b>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                วันที่สอบ
              </label>
              <input
                type="date"
                name="examDate"
                required
                value={formData.examDate}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            {regMode === "register" ? (
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-1">
                  Reg No. (เลขลงทะเบียน)
                </label>
                <input
                  type="number" // Use number to allow keypad but handle padding visually
                  name="regNo"
                  placeholder="ระบุ Reg No."
                  value={formData.regNo}
                  onChange={handleChange}
                  onBlur={handleNumberBlur} // Auto format on blur
                  className="w-full p-2.5 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-purple-600 mb-1">
                  Test No. (เลขที่สอบ)
                </label>
                <input
                  type="number"
                  name="testNo"
                  placeholder="ระบุ Test No."
                  value={formData.testNo}
                  onChange={handleChange}
                  onBlur={handleNumberBlur} // Auto format on blur
                  className="w-full p-2.5 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
              <span>
                Passport <span className="text-red-500">*</span>
              </span>
              {searchMessage && (
                <span className="text-xs text-orange-500">{searchMessage}</span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="passport"
                required
                placeholder="Passport No."
                value={formData.passport}
                onChange={handleChange}
                className="flex-1 p-2.5 border border-slate-300 rounded-lg uppercase font-mono"
              />
              <button
                type="button"
                onClick={() => performSearch(formData.passport)}
                disabled={isSearching}
                className="bg-slate-700 text-white px-3 rounded-lg flex items-center justify-center min-w-[50px]"
              >
                {isSearching ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>

            {foundData.length > 0 && (
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {foundData.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-sm"
                  >
                    <div className="font-bold text-blue-800">{r.fullName}</div>
                    <div className="text-xs text-slate-500">
                      Date: {formatDateToTH(r.examDate)} | Reg: {r.regNo || "-"}{" "}
                      | Test: {r.testNo || "-"}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleUseData(r, "personal")}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 py-1 rounded text-xs font-bold"
                      >
                        ดึงประวัติ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseData(r, "full")}
                        className="flex-1 bg-orange-100 hover:bg-orange-200 py-1 rounded text-xs font-bold text-orange-700"
                      >
                        แก้ไขงาน
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">
                ชื่อ-สกุล (ENG)
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="NAME SURNAME"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                วันเกิด
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                เพศ
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              >
                <option value="Male">ชาย (Male)</option>
                <option value="Female">หญิง (Female)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">
                ตำแหน่ง
              </label>
              <input
                type="text"
                name="position"
                list="positions"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
              <datalist id="positions">
                {optionLists.positions.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">
                ชื่อนายจ้าง
              </label>
              <input
                type="text"
                name="employer"
                required
                list="employers"
                value={formData.employer}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg uppercase"
              />
              <datalist id="employers">
                {optionLists.employers.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">
                สายงาน
              </label>
              <input
                type="text"
                name="jobLine"
                list="jobLines"
                value={formData.jobLine}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
              <datalist id="jobLines">
                {optionLists.jobLines.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                editTarget
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:bg-slate-400`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> กำลังบันทึก...
                </>
              ) : editTarget ? (
                "บันทึกการแก้ไข"
              ) : (
                "ยืนยันการบันทึก"
              )}
            </button>
            {editTarget && (
              <button
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  handleReset();
                }}
                className="w-full mt-2 py-2 text-slate-500 text-sm hover:underline"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  // ==========================================
  // VIEW: DASHBOARD
  // ==========================================
  const DashboardView = () => {
    const today = new Date().toISOString().split("T")[0];
    const [dateRange, setDateRange] = useState({ start: today, end: today });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const loadReport = useCallback(
      async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        const cleanUrl = getCleanUrl(googleScriptUrl);
        if (!cleanUrl || !cleanUrl.startsWith("http")) {
          setTimeout(() => {
            const mockStats = {
              males: 45,
              females: 15,
              ageGroups: {
                "20-25": 15,
                "26-30": 20,
                "31-35": 10,
                "36-40": 5,
                "41-45": 3,
              },
              positions: { Worker: 30, Driver: 10, Engineer: 5, Foreman: 15 },
            };
            processData(mockStats, true);
            setLoading(false);
          }, 800);
          return;
        }
        try {
          const response = await fetch(cleanUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
              action: "getReport",
              startDate: dateRange.start,
              endDate: dateRange.end,
            }),
            redirect: "follow",
          });
          const result = await response.json();
          if (result.status === "success") {
            processData(result.data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (!isBackground) setLoading(false);
        }
      },
      [googleScriptUrl, dateRange]
    );

    const processData = (data, isMock = false) => {
      let males = 0;
      let females = 0;
      let finalAgeGroups = {
        "20-25": 0,
        "26-30": 0,
        "31-35": 0,
        "36-40": 0,
        "41-45": 0,
      };
      let finalPositions = {};

      if (data && typeof data === "object") {
        males = data.males || 0;
        females = data.females || 0;
        if (data.ageGroups) finalAgeGroups = data.ageGroups;
        if (data.positions) finalPositions = data.positions;
      }

      const totalGender = males + females;
      const malePercent =
        totalGender > 0 ? Math.round((males / totalGender) * 100) : 0;
      const femalePercent =
        totalGender > 0 ? Math.round((females / totalGender) * 100) : 0;

      const sortedPositions = Object.entries(finalPositions)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

      setReportData({
        males,
        females,
        malePercent,
        femalePercent,
        ageGroups: finalAgeGroups,
        positions: sortedPositions,
        total: totalGender,
      });
    };

    useEffect(() => {
      loadReport();
      const intervalId = setInterval(() => {
        loadReport(true);
      }, 60000);
      return () => clearInterval(intervalId);
    }, [loadReport]);

    return (
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-100 animate-in fade-in space-y-6 pb-6">
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 drop-shadow-md">
                <LayoutDashboard size={32} /> Dashboard สรุปข้อมูล
              </h1>
              <p className="text-white/80 font-medium">
                ข้อมูลวันที่ {formatDateToTH(dateRange.start)} -{" "}
                {formatDateToTH(dateRange.end)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                จากวันที่
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="p-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                ถึงวันที่
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="p-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
              />
            </div>
            <button
              onClick={() => loadReport(false)}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> กำลังโหลด...
                </>
              ) : (
                <>
                  <Search size={18} /> แสดงข้อมูล
                </>
              )}
            </button>
          </div>

          {reportData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Stats */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <Users size={22} className="text-blue-500" /> อัตราส่วนเพศ
                    (Gender Ratio)
                  </h3>
                  <div className="flex gap-6 mb-6">
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 p-5 rounded-xl text-center shadow-sm">
                      <div className="text-4xl font-extrabold text-blue-600 mb-1">
                        {reportData.males}
                      </div>
                      <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                        ชาย (Male)
                      </div>
                      <div className="text-sm font-semibold text-blue-500 mt-1">
                        {reportData.malePercent}%
                      </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-100 p-5 rounded-xl text-center shadow-sm">
                      <div className="text-4xl font-extrabold text-pink-600 mb-1">
                        {reportData.females}
                      </div>
                      <div className="text-xs text-pink-400 font-bold uppercase tracking-wider">
                        หญิง (Female)
                      </div>
                      <div className="text-sm font-semibold text-pink-500 mt-1">
                        {reportData.femalePercent}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${reportData.malePercent}%` }}
                    ></div>
                    <div
                      className="bg-pink-500 h-full"
                      style={{ width: `${reportData.femalePercent}%` }}
                    ></div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <span className="text-slate-500 text-sm font-medium">
                      จำนวนผู้สมัครรวมทั้งหมด (Total)
                    </span>
                    <div className="text-3xl font-bold text-slate-800 mt-1">
                      {reportData.total}{" "}
                      <span className="text-sm text-slate-400 font-normal">
                        คน
                      </span>
                    </div>
                  </div>
                </div>

                {/* Age Groups */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <PieChart size={22} className="text-green-500" /> ช่วงอายุ
                    (Age Groups)
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(reportData.ageGroups).map(
                      ([range, count]) => {
                        const total =
                          Object.values(reportData.ageGroups).reduce(
                            (a, b) => a + b,
                            0
                          ) || 1;
                        const percent =
                          total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                          <div key={range}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-semibold text-slate-600">
                                {range} ปี
                              </span>
                              <span className="text-slate-500 font-medium">
                                {count} คน ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Positions */}
                <div className="col-span-1 md:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <TrendingUp size={22} className="text-orange-500" />{" "}
                    ตำแหน่งที่สมัครมากที่สุด (Top Positions)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(reportData.positions).map(
                      ([pos, count], i) => (
                        <div
                          key={pos}
                          className="border border-slate-200 bg-slate-50/50 p-4 rounded-xl flex justify-between items-center group hover:border-orange-200 hover:bg-orange-50 transition-colors"
                        >
                          <div
                            className="text-sm font-bold text-slate-600 truncate mr-2"
                            title={pos}
                          >
                            {pos}
                          </div>
                          <div className="bg-white px-2.5 py-1 rounded-lg text-sm font-bold text-orange-600 shadow-sm border border-slate-100">
                            {count}
                          </div>
                        </div>
                      )
                    )}
                    {Object.keys(reportData.positions).length === 0 && (
                      <p className="text-sm text-slate-400 col-span-4 text-center py-4">
                        ไม่มีข้อมูลตำแหน่ง
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Database className="mx-auto text-slate-300 mb-4" size={56} />
              <p className="text-slate-400 font-medium">
                กรุณาเลือกวันที่และกด "แสดงข้อมูล"
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: SCREENING (Revised)
  // ==========================================
  const ScreeningView = () => {
    const today = new Date().toISOString().split("T")[0];
    const [dateRange, setDateRange] = useState({ start: today, end: today });
    const [mode, setMode] = useState("score");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
      show: false,
      newDate: today,
    });
    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "asc",
    });

    const loadData = useCallback(async () => {
      setLoading(true);
      const cleanUrl = getCleanUrl(googleScriptUrl);

      if (!cleanUrl || !cleanUrl.startsWith("http")) {
        setTimeout(() => {
          // Mock Data
          setData([
            {
              rowIndex: 2,
              regNo: "001",
              testNo: "",
              fullName: "JOHN DOE",
              gender: "MALE",
              passport: "A111",
              scoreEng: "",
              scorePers: "",
              scoreExp: "",
              scoreTotal: "",
              remark: "",
            },
            {
              rowIndex: 3,
              regNo: "002",
              testNo: "",
              fullName: "JANE SMITH",
              gender: "FEMALE",
              passport: "B222",
              scoreEng: "",
              scorePers: "",
              scoreExp: "",
              scoreTotal: "",
              remark: "",
            },
          ]);
          setLoading(false);
        }, 800);
        return;
      }
      try {
        const res = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "getScreeningData",
            startDate: dateRange.start,
            endDate: dateRange.end,
          }),
          redirect: "follow",
        });
        const json = await res.json();
        if (json.status === "success") setData(json.data);
        else alert("Error: " + json.message);
      } catch (e) {
        console.error(e);
        alert("Connection Error");
      } finally {
        setLoading(false);
      }
    }, [googleScriptUrl, dateRange]);

    useEffect(() => {
      if (googleScriptUrl) loadData();
    }, [loadData]);

    const handleUpdateItem = (rowIndex, field, value) => {
      setData((prev) =>
        prev.map((item) => {
          if (item.rowIndex === rowIndex) {
            const updated = { ...item, [field]: value };
            if (["scoreEng", "scorePers", "scoreExp"].includes(field)) {
              const eng = parseFloat(updated.scoreEng) || 0;
              const pers = parseFloat(updated.scorePers) || 0;
              const exp = parseFloat(updated.scoreExp) || 0;
              updated.scoreTotal = eng + pers + exp;
            }
            return updated;
          }
          return item;
        })
      );
    };

    const handleSort = (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
      let sortableItems = [...data];
      if (sortConfig.key !== null) {
        sortableItems.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];

          if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
          } else {
            aValue = (aValue || "").toString();
            bValue = (bValue || "").toString();
          }

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }
      return sortableItems;
    }, [data, sortConfig]);

    const processRanking = () => {
      // แยกกลุ่ม ชาย / หญิง
      const males = data.filter(
        (item) =>
          (item.gender || "").toUpperCase() === "MALE" ||
          (item.gender || "").toUpperCase() === "ชาย"
      );
      const females = data.filter(
        (item) =>
          (item.gender || "").toUpperCase() === "FEMALE" ||
          (item.gender || "").toUpperCase() === "หญิง"
      );
      const others = data.filter(
        (item) => !males.includes(item) && !females.includes(item)
      );

      // ฟังก์ชันเรียงคะแนนและรันเลข
      const rankGroup = (group) => {
        // เรียงคะแนนมากไปน้อย -> ถ้าเท่ากันเรียงตาม Reg No.
        const sorted = group.sort((a, b) => {
          const totA = parseFloat(a.scoreTotal) || 0;
          const totB = parseFloat(b.scoreTotal) || 0;
          if (totB !== totA) return totB - totA;
          return String(a.regNo || "").localeCompare(String(b.regNo || ""));
        });
        // รันเลขใหม่ 001, 002, ...
        return sorted.map((item, idx) => ({
          ...item,
          testNo: padZero(idx + 1), // แปลงเป็น 3 หลัก
        }));
      };

      const rankedMales = rankGroup(males);
      const rankedFemales = rankGroup(females);

      // รวมข้อมูลกลับ (รวม Others ที่อาจไม่ระบุเพศด้วย)
      const allRanked = [...rankedMales, ...rankedFemales, ...others];

      // เรียงกลับตามลำดับเดิมหรือตาม Test No ก็ได้ (ในที่นี้เรียงตาม Test No เพื่อดูง่าย แต่จะแยกเพศยากหน่อยตอนแสดงรวม)
      // หรือจะเรียงตามเพศก่อนก็ได้
      allRanked.sort((a, b) => {
        const genderA = (a.gender || "").toUpperCase();
        const genderB = (b.gender || "").toUpperCase();
        if (genderA < genderB) return 1; // Male มาก่อน (M < F ? ไม่ใช่ F มาก่อน M) เอาเป็นว่า Grouping
        if (genderA > genderB) return -1;
        // ถ้าเพศเดียวกัน เรียงตาม Test No
        return parseInt(a.testNo || 999) - parseInt(b.testNo || 999);
      });

      setData(allRanked);
      setConfirmModal({ show: true, newDate: dateRange.start });
    };

    const saveScoreMode = async () => {
      setLoading(true);
      setConfirmModal({ show: false });
      const cleanUrl = getCleanUrl(googleScriptUrl);
      const updates = data.map((r) => ({
        rowIndex: r.rowIndex,
        eng: r.scoreEng,
        personal: r.scorePers,
        exp: r.scoreExp,
        total: r.scoreTotal,
        testNo: r.testNo,
      }));

      if (cleanUrl.startsWith("http")) {
        await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "saveScreeningScore",
            updates,
            examDate: confirmModal.newDate,
          }),
        });
        alert("บันทึกคะแนนและลำดับสำเร็จ");
        loadData();
      } else {
        alert("[DEMO] บันทึกสำเร็จ");
        setLoading(false);
      }
    };

    const saveKnockoutMode = async () => {
      setLoading(true);
      const cleanUrl = getCleanUrl(googleScriptUrl);
      const updates = data.map((r) => ({
        rowIndex: r.rowIndex,
        remark: r.remark,
      }));

      if (cleanUrl.startsWith("http")) {
        await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "saveScreeningKnockout", updates }),
        });
        alert("บันทึกผลการคัดกรองสำเร็จ");
        loadData();
      } else {
        alert("[DEMO] บันทึกสำเร็จ");
        setLoading(false);
      }
    };

    const SortIcon = ({ col }) => {
      if (sortConfig.key !== col)
        return <ArrowDownCircle size={14} className="opacity-20 inline ml-1" />;
      return sortConfig.direction === "asc" ? (
        <SortAsc size={14} className="inline ml-1" />
      ) : (
        <SortDesc size={14} className="inline ml-1" />
      );
    };

    return (
      <div className="w-full max-w-6xl animate-in fade-in pb-20">
        {confirmModal.show && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-lg mb-2">
                ยืนยันการบันทึก & จัดลำดับ?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                ระบบจะรันเลข Test No. ใหม่แยกตามเพศ (ชาย/หญิง)
                โดยเรียงจากคะแนนสูงสุด
              </p>
              <div className="mb-4">
                <label className="block text-xs font-bold mb-1">
                  ระบุวันที่สอบสำหรับชุดนี้:
                </label>
                <input
                  type="date"
                  value={confirmModal.newDate}
                  onChange={(e) =>
                    setConfirmModal({
                      ...confirmModal,
                      newDate: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmModal({ show: false })}
                  className="flex-1 bg-slate-200 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={saveScoreMode}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Filter size={28} /> คัดกรอง (Screening)
            </h1>
            <div className="flex gap-2 bg-white/20 p-1 rounded-lg">
              <button
                onClick={() => setMode("score")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold ${
                  mode === "score"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-white/10"
                }`}
              >
                1. Score Mode
              </button>
              <button
                onClick={() => setMode("knockout")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold ${
                  mode === "knockout"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-white/10"
                }`}
              >
                2. Knock Out
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-b flex items-center gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="font-bold text-sm text-slate-600">
                  จากวันที่:
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="p-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-sm text-slate-600">
                  ถึงวันที่:
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="p-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> ดึงข้อมูล (Load Data)
                </>
              )}
            </button>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 uppercase text-xs font-bold text-slate-600">
                <tr>
                  <th
                    onClick={() => handleSort("testNo")}
                    className="p-3 border cursor-pointer hover:bg-slate-200"
                  >
                    Test No. <SortIcon col="testNo" />
                  </th>
                  <th
                    onClick={() => handleSort("regNo")}
                    className="p-3 border cursor-pointer hover:bg-slate-200"
                  >
                    Reg No. <SortIcon col="regNo" />
                  </th>
                  <th
                    onClick={() => handleSort("fullName")}
                    className="p-3 border cursor-pointer hover:bg-slate-200"
                  >
                    Name <SortIcon col="fullName" />
                  </th>
                  <th
                    onClick={() => handleSort("gender")}
                    className="p-3 border text-center cursor-pointer hover:bg-slate-200"
                  >
                    Sex <SortIcon col="gender" />
                  </th>
                  <th
                    onClick={() => handleSort("passport")}
                    className="p-3 border cursor-pointer hover:bg-slate-200"
                  >
                    Passport <SortIcon col="passport" />
                  </th>
                  {mode === "score" ? (
                    <>
                      <th
                        onClick={() => handleSort("scoreEng")}
                        className="p-3 border w-24 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
                      >
                        Eng (P) <SortIcon col="scoreEng" />
                      </th>
                      <th
                        onClick={() => handleSort("scorePers")}
                        className="p-3 border w-24 bg-purple-50 text-purple-700 cursor-pointer hover:bg-purple-100"
                      >
                        Pers (Q) <SortIcon col="scorePers" />
                      </th>
                      <th
                        onClick={() => handleSort("scoreExp")}
                        className="p-3 border w-24 bg-pink-50 text-pink-700 cursor-pointer hover:bg-pink-100"
                      >
                        EXP (R) <SortIcon col="scoreExp" />
                      </th>
                      <th
                        onClick={() => handleSort("scoreTotal")}
                        className="p-3 border w-28 bg-green-50 text-green-700 cursor-pointer hover:bg-green-100"
                      >
                        Total (S) <SortIcon col="scoreTotal" />
                      </th>
                    </>
                  ) : (
                    <th className="p-3 border w-48 bg-red-50 text-red-700">
                      Remark (Knockout)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedData.map((r, i) => (
                  <tr key={r.rowIndex} className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-center bg-slate-50">
                      {r.testNo || "-"}
                    </td>
                    <td className="p-3 border text-center text-slate-500">
                      {r.regNo || "-"}
                    </td>
                    <td className="p-3 border">{r.fullName}</td>
                    <td
                      className={`p-3 border text-center font-bold ${
                        ["Male", "MALE", "ชาย"].includes(r.gender)
                          ? "text-blue-600"
                          : "text-pink-600"
                      }`}
                    >
                      {r.gender === "Male"
                        ? "M"
                        : r.gender === "Female"
                        ? "F"
                        : r.gender}
                    </td>
                    <td className="p-3 border font-mono">{r.passport}</td>
                    {mode === "score" ? (
                      <>
                        <td className="p-2 border">
                          <input
                            type="number"
                            className="w-full p-1 border rounded text-center"
                            value={r.scoreEng}
                            onChange={(e) =>
                              handleUpdateItem(
                                r.rowIndex,
                                "scoreEng",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            className="w-full p-1 border rounded text-center"
                            value={r.scorePers}
                            onChange={(e) =>
                              handleUpdateItem(
                                r.rowIndex,
                                "scorePers",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            className="w-full p-1 border rounded text-center"
                            value={r.scoreExp}
                            onChange={(e) =>
                              handleUpdateItem(
                                r.rowIndex,
                                "scoreExp",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border bg-green-50">
                          <input
                            type="number"
                            className="w-full p-1 border border-green-300 rounded text-center font-bold text-green-700"
                            value={r.scoreTotal}
                            onChange={(e) =>
                              handleUpdateItem(
                                r.rowIndex,
                                "scoreTotal",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </>
                    ) : (
                      <td className="p-2 border text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateItem(r.rowIndex, "remark", "FAIL")
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              r.remark === "FAIL"
                                ? "bg-red-600 text-white shadow-md"
                                : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <ThumbsDown size={14} /> ไม่ผ่าน
                          </button>
                          {r.remark && (
                            <button
                              onClick={() =>
                                handleUpdateItem(r.rowIndex, "remark", "")
                              }
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="ลบข้อมูล (Clear)"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-400">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
            {mode === "score" ? (
              <button
                onClick={processRanking}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:bg-slate-400"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Trophy size={20} />
                )}
                คำนวณลำดับ & บันทึก (Rank & Save)
              </button>
            ) : (
              <button
                onClick={saveKnockoutMode}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:bg-slate-400"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                บันทึกผลคัดกรอง (Save Knockout)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: EXAM RESULTS
  // ==========================================
  const ExamResultsView = () => {
    const today = new Date().toISOString().split("T")[0];
    const [dateRange, setDateRange] = useState({ start: today, end: today });
    const [filter, setFilter] = useState({
      testNo: "",
      position: "",
      jobLine: "",
      remark: "ALL",
      gender: "ALL",
    });
    const [sortConfig, setSortConfig] = useState({
      key: "testNo",
      direction: "asc",
    });
    const [rawResults, setRawResults] = useState([]);
    const [processedResults, setProcessedResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isBulkSaving, setIsBulkSaving] = useState(false);
    const [modifiedRows, setModifiedRows] = useState(new Set());
    const [customEmployerHeader, setCustomEmployerHeader] = useState("");

    const handleSearch = async () => {
      setLoading(true);
      setHasSearched(true);
      setModifiedRows(new Set());
      setRawResults([]);
      const cleanUrl = getCleanUrl(googleScriptUrl);

      if (!cleanUrl || !cleanUrl.startsWith("http")) {
        setTimeout(() => {
          setRawResults([
            {
              rowIndex: 2,
              testNo: "101",
              fullName: "JOHN DOE",
              gender: "MALE",
              position: "ENGINEER",
              jobLine: "CONSTRUCTION",
              remark: "PASS",
              dob: "1990-01-01",
              passport: "A1234567",
              examDate: "2025-01-01",
            },
          ]);
          setLoading(false);
        }, 1000);
        return;
      }

      try {
        const response = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "getExamResults",
            startDate: dateRange.start,
            endDate: dateRange.end,
          }),
          redirect: "follow",
        });
        const data = await response.json();
        if (data.status === "success") {
          setRawResults(data.data);
          if (data.data.length === 0) alert("ไม่พบข้อมูล");
        }
      } catch (e) {
        alert(`Error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      let data = [...rawResults];
      data = data.filter((r) => {
        const fT = filter.testNo.toLowerCase(),
          fP = filter.position.toLowerCase(),
          fJ = filter.jobLine.toLowerCase();
        if (!(r.testNo || "").toString().toLowerCase().includes(fT))
          return false;
        if (!(r.position || "").toString().toLowerCase().includes(fP))
          return false;
        if (!(r.jobLine || "").toString().toLowerCase().includes(fJ))
          return false;
        if (
          filter.remark !== "ALL" &&
          (filter.remark === "EMPTY"
            ? r.remark !== ""
            : r.remark !== filter.remark)
        )
          return false;
        if (
          filter.gender !== "ALL" &&
          (r.gender || "").toString().toUpperCase() !== filter.gender
        )
          return false;
        return true;
      });
      data.sort((a, b) => {
        let valA = a[sortConfig.key] || "",
          valB = b[sortConfig.key] || "";
        if (sortConfig.key === "testNo") {
          const numA = parseFloat(valA),
            numB = parseFloat(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
            valA = numA;
            valB = numB;
          }
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
      setProcessedResults(data);
    }, [rawResults, filter, sortConfig]);

    const handleLocalUpdate = (record, resultValue) => {
      const updateFn = (list) =>
        list.map((r) =>
          r.rowIndex === record.rowIndex
            ? { ...r, remark: resultValue, isDirty: true }
            : r
        );
      setRawResults((prev) => updateFn(prev));
      setModifiedRows((prev) => new Set(prev).add(record.rowIndex));
    };

    const handleBulkSave = async () => {
      const cleanUrl = getCleanUrl(googleScriptUrl);
      const rowsToSave = rawResults.filter(
        (r) => r.isDirty || modifiedRows.has(r.rowIndex)
      );
      if (rowsToSave.length === 0) {
        alert("ไม่พบรายการแก้ไข");
        return;
      }
      setIsBulkSaving(true);

      if (!cleanUrl.startsWith("http")) {
        setTimeout(() => {
          alert(`[DEMO] Saved ${rowsToSave.length} items`);
          setRawResults((prev) => prev.map((r) => ({ ...r, isDirty: false })));
          setModifiedRows(new Set());
          setIsBulkSaving(false);
        }, 1500);
        return;
      }

      try {
        const updatesPayload = rowsToSave.map((r) => ({
          rowIndex: parseInt(r.rowIndex),
          result: r.remark || "",
        }));
        const response = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "bulkUpdateResult",
            updates: updatesPayload,
          }),
          redirect: "follow",
        });
        const res = await response.json();
        if (res.status === "success") {
          alert(`Saved ${rowsToSave.length} items`);
          setRawResults((prev) => prev.map((r) => ({ ...r, isDirty: false })));
          setModifiedRows(new Set());
        } else alert(`Error: ${res.message}`);
      } catch (e) {
        alert(`Error: ${e.message}`);
      } finally {
        setIsBulkSaving(false);
      }
    };

    const handleSaveImage = () => {
      const element = document.getElementById("results-table-container");
      if (element && window.html2canvas) {
        window
          .html2canvas(element, { scale: 2, backgroundColor: "#ffffff" })
          .then((canvas) => {
            const link = document.createElement("a");
            link.download = `ExamResults_${dateRange.start}.png`;
            link.href = canvas.toDataURL();
            link.click();
          });
      }
    };

    const handleSaveNameList = () => {
      if (window.XLSX) {
        const header = [
          "Test No.",
          "FULLNAME",
          "Age",
          "DOB",
          "Passport No.",
          "Remark",
        ];
        const data = processedResults.map((r) => [
          r.testNo || "-",
          r.fullName,
          calculateAge(r.dob),
          formatDateToTH(r.dob),
          r.passport,
          r.remark,
        ]);
        const worksheetData = [];
        if (customEmployerHeader) worksheetData.push([customEmployerHeader]);
        worksheetData.push([`Date: ${formatDateToTH(dateRange.start)}`]);
        worksheetData.push([]);
        worksheetData.push(header);
        data.forEach((row) => worksheetData.push(row));
        const wb = window.XLSX.utils.book_new();
        const ws = window.XLSX.utils.aoa_to_sheet(worksheetData);
        window.XLSX.utils.book_append_sheet(wb, ws, "Name List");
        window.XLSX.writeFile(wb, `NameList_${dateRange.start}.xlsx`);
      }
    };

    return (
      <div className="w-full max-w-5xl animate-in fade-in pb-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Printer size={28} /> พิมพ์ผลสอบ (Exam Results)
            </h1>
          </div>

          <div className="p-6 bg-slate-50 border-b border-slate-200 flex gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-slate-500">
                จากวันที่
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="p-2 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">
                ถึงวันที่
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="p-2 border rounded-lg text-sm bg-white"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> กำลังโหลด...
                </>
              ) : (
                <>
                  <Search size={18} /> ดึงข้อมูล
                </>
              )}
            </button>
          </div>

          {(hasSearched || rawResults.length > 0) && (
            <div className="p-4 bg-white border-b border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Test No..."
                value={filter.testNo}
                onChange={(e) =>
                  setFilter({ ...filter, testNo: e.target.value })
                }
                className="p-2 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Position..."
                value={filter.position}
                onChange={(e) =>
                  setFilter({ ...filter, position: e.target.value })
                }
                className="p-2 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Job Line..."
                value={filter.jobLine}
                onChange={(e) =>
                  setFilter({ ...filter, jobLine: e.target.value })
                }
                className="p-2 border rounded text-sm"
              />
              <select
                value={filter.gender}
                onChange={(e) =>
                  setFilter({ ...filter, gender: e.target.value })
                }
                className="p-2 border rounded text-sm"
              >
                <option value="ALL">Sex: All</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              <select
                value={filter.remark}
                onChange={(e) =>
                  setFilter({ ...filter, remark: e.target.value })
                }
                className="p-2 border rounded text-sm"
              >
                <option value="ALL">Remark: All</option>
                <option value="PASS">PASS</option>
                <option value="WAITING CF">WAITING CF</option>
                <option value="EMPTY">(Empty)</option>
              </select>
            </div>
          )}

          {(hasSearched || rawResults.length > 0) && (
            <div className="p-4 bg-slate-50 flex items-center gap-4 border-b">
              <div className="flex items-center gap-2 text-sm font-bold">
                <SortAsc size={16} /> Sort:
              </div>
              <select
                value={sortConfig.key}
                onChange={(e) =>
                  setSortConfig({ ...sortConfig, key: e.target.value })
                }
                className="p-2 border rounded text-sm"
              >
                <option value="testNo">Test No.</option>
                <option value="fullName">Name</option>
                <option value="position">Position</option>
                <option value="remark">Remark</option>
              </select>
              <button
                onClick={() =>
                  setSortConfig((prev) => ({
                    ...prev,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                  }))
                }
                className="px-3 py-2 bg-white border rounded text-sm font-medium hover:bg-slate-100"
              >
                {sortConfig.direction === "asc" ? "A-Z" : "Z-A"}
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                  <Edit3 size={16} /> Edit Mode
                </span>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isEditMode ? "bg-indigo-600 text-white" : "bg-slate-200"
                  }`}
                >
                  {isEditMode ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          )}
        </div>

        {(hasSearched || rawResults.length > 0) && (
          <div className="bg-white rounded-xl shadow-xl border p-8 min-h-[500px]">
            <div className="mb-6 max-w-sm ml-auto">
              <input
                type="text"
                placeholder="ชื่อนายจ้าง (หัวกระดาษ)..."
                value={customEmployerHeader}
                onChange={(e) => setCustomEmployerHeader(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div id="results-table-container" className="bg-white p-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-1">
                  รายชื่อผู้เข้าสอบ (Exam Results)
                </h2>
                {customEmployerHeader && (
                  <h3 className="text-xl font-bold text-teal-700">
                    {customEmployerHeader}
                  </h3>
                )}
                <p className="text-sm text-slate-500">
                  ประจำวันที่ {formatDateToTH(dateRange.start)} -{" "}
                  {formatDateToTH(dateRange.end)}
                </p>
              </div>
              <div className="overflow-x-auto border rounded-xl shadow-lg">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                    <tr>
                      <th className="p-4 text-center border-r">TEST No.</th>
                      <th className="p-4 border-r">Name - Surname</th>
                      <th className="p-4 text-center border-r">Sex</th>
                      <th className="p-4 text-center border-r">Position</th>
                      <th className="p-4 text-center border-r">Agencies</th>
                      <th className="p-4 text-center">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {processedResults.map((r, i) => (
                      <tr
                        key={i}
                        className={r.isDirty ? "bg-indigo-50/60" : ""}
                      >
                        <td className="p-3 text-center font-bold">
                          {r.testNo || "-"}
                        </td>
                        <td className="p-3 font-bold">{r.fullName}</td>
                        <td className="p-3 text-center">{r.gender}</td>
                        <td className="p-3 text-center">{r.position}</td>
                        <td className="p-3 text-center">{r.jobLine}</td>
                        <td className="p-3 text-center">
                          {isEditMode ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleLocalUpdate(r, "PASS")}
                                className={`px-2 py-1 text-xs rounded ${
                                  r.remark === "PASS"
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-100"
                                }`}
                              >
                                PASS
                              </button>
                              <button
                                onClick={() =>
                                  handleLocalUpdate(r, "WAITING CF")
                                }
                                className={`px-2 py-1 text-xs rounded ${
                                  r.remark === "WAITING CF"
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-100"
                                }`}
                              >
                                WAIT
                              </button>
                              <button
                                onClick={() => handleLocalUpdate(r, "")}
                                className="text-red-500"
                              >
                                <Eraser size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="font-bold">{r.remark}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 flex justify-between gap-4">
              {isEditMode ? (
                <button
                  onClick={handleBulkSave}
                  disabled={isBulkSaving}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold disabled:bg-slate-400"
                >
                  {isBulkSaving ? (
                    <>
                      <Loader2 size={20} className="animate-spin inline mr-2" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              ) : (
                <div className="flex-1"></div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNameList}
                  className="bg-teal-700 text-white px-5 py-3 rounded-lg font-bold flex gap-2"
                >
                  <FileCheck /> Excel
                </button>
                <button
                  onClick={handleSaveImage}
                  className="bg-slate-800 text-white px-5 py-3 rounded-lg font-bold flex gap-2"
                >
                  <Download /> Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 font-sans text-slate-800 relative">
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 px-2">
        <h2 className="text-slate-400 text-xs font-bold tracking-widest uppercase">
          SHEBAH SYSTEM v2.0
        </h2>
        <StatusIndicator />
      </div>

      <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 mb-6 flex gap-1 overflow-x-auto max-w-full">
        <button
          onClick={() => setCurrentView("registration")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
            currentView === "registration"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FileText size={16} /> ลงทะเบียน
        </button>
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
            currentView === "dashboard"
              ? "bg-purple-600 text-white shadow"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </button>
        <button
          onClick={() => setCurrentView("screening")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
            currentView === "screening"
              ? "bg-amber-500 text-white shadow"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Filter size={16} /> คัดกรอง (Screening)
        </button>
        <button
          onClick={() => setCurrentView("results")}
          className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
            currentView === "results"
              ? "bg-teal-600 text-white shadow"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Printer size={16} /> พิมพ์ผลสอบ
        </button>
      </div>

      {showConfig && (
        <div className="bg-slate-800 p-4 rounded-xl mb-6 w-full max-w-lg animate-in slide-in-from-top-2">
          <h3 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
            <Settings size={14} /> ตั้งค่าระบบ
          </h3>
          <input
            type="text"
            placeholder="Google Apps Script URL..."
            value={googleScriptUrl}
            onChange={(e) => setGoogleScriptUrl(e.target.value)}
            className="w-full text-sm bg-slate-900 text-white p-2 rounded border border-slate-600 mb-2"
          />
        </div>
      )}

      {currentView === "registration" && <RegistrationView />}
      {currentView === "dashboard" && <DashboardView />}
      {currentView === "screening" && <ScreeningView />}
      {currentView === "results" && <ExamResultsView />}
    </div>
  );
};

export default App;
