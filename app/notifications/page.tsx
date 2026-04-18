"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/send-notification");
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "فشل الإرسال");

      setSuccess(`تم الإرسال بنجاح لـ ${data.recipients || 0} عميل`);
      setTitle("");
      setBody("");
      fetchHistory();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const templates = [
    { label: "عرض خاص", title: "🔥 عرض خاص!", body: "لا تفوّت عروضنا المميزة اليوم. تسوّق الآن!" },
    { label: "طلبك جاهز", title: "✅ طلبك جاهز", body: "طلبك تم تجهيزه وهو في الطريق إليك." },
    { label: "منتج جديد", title: "🥩 منتج جديد", body: "أضفنا منتجات طازجة جديدة. اطّلع عليها الآن!" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-slate-900">إرسال إشعارات</h2>
        <p className="text-slate-500 font-bold">أرسل إشعارات فورية لجميع عملاء التطبيق</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl font-bold text-center text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl font-bold text-center text-sm">
            {success}
          </div>
        )}

        {/* Templates */}
        <div className="space-y-3">
          <p className="text-sm font-black text-slate-500">قوالب سريعة</p>
          <div className="flex gap-3 flex-wrap">
            {templates.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => { setTitle(t.title); setBody(t.body); }}
                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">عنوان الإشعار</label>
            <input
              type="text"
              placeholder="مثال: عرض خاص اليوم فقط!"
              maxLength={65}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-red-500/10 font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p className="text-xs text-slate-400 text-left">{title.length}/65</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">نص الرسالة</label>
            <textarea
              placeholder="اكتب تفاصيل الإشعار هنا..."
              rows={4}
              maxLength={200}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-red-500/10 font-bold resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <p className="text-xs text-slate-400 text-left">{body.length}/200</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <p className="text-sm font-bold text-amber-700">
              ⚠️ سيتم إرسال هذا الإشعار لجميع العملاء المسجّلين في التطبيق
            </p>
          </div>

          <button
            type="submit"
            disabled={sending || !title.trim() || !body.trim()}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                جاري الإرسال...
              </span>
            ) : (
              "إرسال الإشعار 🔔"
            )}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-black text-lg text-slate-900">سجل الإشعارات</h3>
        </div>
        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-bold">لا توجد إشعارات مرسلة بعد</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {history.map((n: any) => (
              <div key={n.id} className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900">{n.title}</p>
                  <p className="text-sm text-slate-500 font-bold mt-1 line-clamp-1">{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleString("ar-SA")}
                  </p>
                </div>
                <span className="bg-green-50 text-green-600 border border-green-100 px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap">
                  {n.recipients} عميل
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
