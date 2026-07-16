import { useState, useEffect } from "react";
import { Mail, Check, Users, Send, Upload, Eye } from "lucide-react";
import { useAuthStore } from "../store/auth-store";
import { API_CONFIG } from "../utils/api-config";
import axios from "axios";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

function parseMarkdownToHtml(text: string): string {
  if (!text) return "";
  
  const trimmed = text.trim();
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
    return text;
  }

  let html = text;

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:14px; font-weight:800; text-transform:uppercase; margin-top:16px; margin-bottom:8px; color:#000000; font-family:sans-serif;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:16px; font-weight:800; text-transform:uppercase; margin-top:18px; margin-bottom:8px; color:#000000; font-family:sans-serif;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:20px; font-weight:900; text-transform:uppercase; margin-top:20px; margin-bottom:8px; color:#000000; font-family:sans-serif;">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#b2533e; font-weight:bold; text-decoration:underline;">$1</a>');

  // Bullet Lists
  const lines = html.split("\n");
  let inList = false;
  const processedLines = lines.map((line) => {
    const listMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (listMatch) {
      let content = listMatch[1];
      let prefix = "";
      if (!inList) {
        inList = true;
        prefix = '<ul style="margin-top:8px; margin-bottom:8px; padding-left:20px; list-style-type:square; font-family:sans-serif;">';
      }
      return `${prefix}<li style="margin-bottom:4px; font-family:sans-serif;">${content}</li>`;
    } else {
      let suffix = "";
      if (inList) {
        inList = false;
        suffix = '</ul>';
      }
      return suffix + line;
    }
  });
  if (inList) {
    processedLines.push('</ul>');
  }
  html = processedLines.join("\n");

  // Line breaks & Paragraph structures
  html = html.split(/\n\s*\n/).map(p => {
    const t = p.trim();
    if (t.startsWith("<ul") || t.startsWith("<h") || t.startsWith("<li")) {
      return p;
    }
    return `<p style="margin-bottom:12px; line-height:1.6; font-family:sans-serif;">${p.replace(/\n/g, "<br />")}</p>`;
  }).join("\n");

  return html;
}

export function NewsletterCampaignPage() {
  const { token } = useAuthStore();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<"send" | "subscribers">("send");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [targetGroup, setTargetGroup] = useState<"subscribers" | "all">("subscribers");
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  // Preview Object URLs
  const [image1Preview, setImage1Preview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");

  useEffect(() => {
    if (!image1) {
      setImage1Preview("");
      return;
    }
    const url = URL.createObjectURL(image1);
    setImage1Preview(url);
    return () => URL.revokeObjectURL(url);
  }, [image1]);

  useEffect(() => {
    if (!image2) {
      setImage2Preview("");
      return;
    }
    const url = URL.createObjectURL(image2);
    setImage2Preview(url);
    return () => URL.revokeObjectURL(url);
  }, [image2]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadSubscribers = async () => {
    try {
      const res = await axios.get<Subscriber[]>(
        `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/newsletter/subscribers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscribers(res.data || []);
    } catch (err) {
      console.error("Failed to load newsletter subscribers", err);
    }
  };

  useEffect(() => {
    if (token) {
      loadSubscribers();
    }
  }, [token]);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      showToast("Subject and content are required");
      return;
    }

    setIsLoading(true);
    try {
      if (targetGroup === "all") {
        showToast("Synchronizing registered users list...");
        const custRes = await axios.get<any>(
          `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/customers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const customers = custRes.data?.data || [];
        
        const subscriberEmails = new Set(subscribers.map((s) => s.email.toLowerCase()));
        const missingEmails = customers
          .map((c: any) => c.email ? c.email.trim().toLowerCase() : "")
          .filter((email: string) => email && !subscriberEmails.has(email));

        if (missingEmails.length > 0) {
          showToast(`Subscribing ${missingEmails.length} new customer(s) to newsletter...`);
          await Promise.all(
            missingEmails.map((email: string) =>
              axios.post(`${API_CONFIG.BASE_URL}/dripdoggy/api/public/newsletter/subscribe`, {
                email
              }).catch((e) => console.error(`Failed to subscribe email: ${email}`, e))
            )
          );
          await loadSubscribers();
        }
      }

      const formData = new FormData();
      formData.append("subject", subject.trim());
      formData.append("content", content.trim());
      if (image1) {
        formData.append("image1", image1);
      }
      if (image2) {
        formData.append("image2", image2);
      }

      showToast("Dispatching campaign email drops...");
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}/dripdoggy/api/admin/newsletter/campaign`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      showToast(res.data?.message || "Campaign dispatched successfully!");
      setSubject("");
      setContent("");
      setImage1(null);
      setImage2(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to dispatch campaign";
      showToast(`Error: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#224870]" /> Marketing Campaigns
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Dispatch newsletters and manage marketing subscribers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("send")}
            className={`px-4.5 py-2.5 text-[9px] font-extrabold tracking-widest uppercase border transition-all cursor-pointer ${
              activeTab === "send"
                ? "bg-[#382d24] text-[#faf8f5] border-[#382d24]"
                : "bg-white text-[#382d24] border-neutral-250 hover:bg-neutral-50"
            }`}
          >
            Compose Campaign
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4.5 py-2.5 text-[9px] font-extrabold tracking-widest uppercase border transition-all cursor-pointer ${
              activeTab === "subscribers"
                ? "bg-[#382d24] text-[#faf8f5] border-[#382d24]"
                : "bg-white text-[#382d24] border-neutral-250 hover:bg-neutral-50"
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {/* Tabs panels */}
      {activeTab === "send" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column — Compose Form */}
          <form onSubmit={handleSendCampaign} className="bg-white border border-neutral-200/70 p-6 md:p-8 space-y-6">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block border-b border-neutral-200/60 pb-3">
              Compose Newsletter Drop
            </span>

            {/* Campaign Subject */}
            <div className="space-y-2">
              <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">
                Campaign Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ENTER EMAIL SUBJECT"
                className="w-full bg-white border border-neutral-250 px-4 py-3.5 text-xs text-neutral-900 focus:outline-none focus:border-[#382d24] transition-all uppercase tracking-wider font-bold"
              />
            </div>

            {/* Campaign Content */}
            <div className="space-y-2">
              <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">
                Email HTML / Markdown Body
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="WRITE CAMPAIGN EMAIL BODY OR NEWSLETTER TEMPLATE CONTENT"
                className="w-full bg-white border border-neutral-250 px-4 py-3.5 text-xs text-neutral-900 focus:outline-none focus:border-[#382d24] transition-all tracking-wide min-h-[160px]"
              />
            </div>

            {/* Audience Target Option */}
            <div className="space-y-3.5">
              <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">
                Target Audience Selection
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTargetGroup("subscribers")}
                  className={`p-4 border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    targetGroup === "subscribers"
                      ? "border-[#224870] bg-[#224870]/5"
                      : "border-neutral-200 bg-white hover:border-[#382d24]"
                  }`}
                >
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#382d24]">
                    Subscribers Only
                  </span>
                  <span className="text-[9px] text-neutral-500 leading-normal font-semibold normal-case">
                    Sends to newsletter subscribers ({subscribers.length} recipients)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup("all")}
                  className={`p-4 border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    targetGroup === "all"
                      ? "border-[#224870] bg-[#224870]/5"
                      : "border-neutral-200 bg-white hover:border-[#382d24]"
                  }`}
                >
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#382d24]">
                    All Registered Users
                  </span>
                  <span className="text-[9px] text-neutral-500 leading-normal font-semibold normal-case">
                    Syncs and sends to all registered customers
                  </span>
                </button>
              </div>
            </div>

            {/* Image Upload Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Image 1 File Input */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">
                  Campaign Inline Image 1
                </label>
                <div className="relative border border-dashed border-neutral-250 p-4 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage1(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-4 h-4 mx-auto text-neutral-450 mb-1" />
                  <span className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block truncate">
                    {image1 ? image1.name : "CHOOSE IMAGE FILE 1"}
                  </span>
                </div>
              </div>

              {/* Image 2 File Input */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">
                  Campaign Inline Image 2
                </label>
                <div className="relative border border-dashed border-neutral-250 p-4 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage2(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-4 h-4 mx-auto text-neutral-450 mb-1" />
                  <span className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block truncate">
                    {image2 ? image2.name : "CHOOSE IMAGE FILE 2"}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Dispatch Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#382d24] text-white py-4 text-[10px] font-black tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? "DISPATCHING DROPS..." : "SEND CAMPAIGN EMAILS"}</span>
            </button>
          </form>

          {/* Right Column — Email Live Preview Mockup */}
          <div className="bg-neutral-100 border border-neutral-200/80 p-6 md:p-8 space-y-4 rounded-md shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
              <Eye className="w-4 h-4 text-[#224870]" />
              <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block">
                Inbox Live Preview
              </span>
            </div>

            {/* Mock Email Headers */}
            <div className="text-[10.5px] text-neutral-500 space-y-1 bg-white p-4 border border-neutral-200 rounded-sm">
              <div>
                <span className="font-bold uppercase text-[9px] tracking-wide text-neutral-400 mr-2">From:</span>
                <span className="text-neutral-800 font-semibold">DripDoggy Syndicate &lt;newsletter@dripdoggy.com&gt;</span>
              </div>
              <div>
                <span className="font-bold uppercase text-[9px] tracking-wide text-neutral-400 mr-2">To:</span>
                <span className="text-neutral-800 font-semibold">
                  {targetGroup === "all" ? "all-registered-customers@dripdoggy.com" : "newsletter-subscribers@dripdoggy.com"}
                </span>
              </div>
              <div className="pt-1 border-t border-neutral-100 mt-1">
                <span className="font-bold uppercase text-[9px] tracking-wide text-neutral-400 mr-2">Subject:</span>
                <span className="text-neutral-900 font-bold tracking-wide uppercase">
                  {subject || "Exclusive Campaign Notice"}
                </span>
              </div>
            </div>

            {/* Rendered Template Body */}
            <div className="bg-white border border-neutral-200 p-6 rounded-sm shadow-inner max-h-[500px] overflow-y-auto">
              <div style={{ fontFamily: "Inter, sans-serif", maxWidth: "600px", margin: "auto", color: "#000000", lineHeight: "1.6" }}>
                {/* Header Mascot Branding */}
                <div style={{ textAlign: "center", marginBottom: "24px", borderBottom: "2px solid #000000", paddingBottom: "16px" }}>
                  <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", letterSpacing: "0.1em", color: "#000000", textTransform: "uppercase" }}>
                    DRIPDOGGY
                  </h1>
                  <p style={{ margin: "4px 0 0 0", fontSize: "10px", fontWeight: "800", color: "#b2533e", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                    Exclusive Campaign Notice
                  </p>
                </div>

                {/* Email Body Content */}
                <div 
                  style={{ fontSize: "13px", color: "#333333", marginBottom: "24px" }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(content) || "<p style='color:#a3a3a3;text-align:center;'>Your email content template will render here in real-time as you write...</p>" }}
                />

                {/* Inline Image Preview 1 */}
                {image1Preview && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <img src={image1Preview} alt="Campaign Attachment 1" style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                  </div>
                )}

                {/* Inline Image Preview 2 */}
                {image2Preview && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <img src={image2Preview} alt="Campaign Attachment 2" style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                  </div>
                )}

                {/* Email Footer Disclaimer */}
                <div style={{ textAlign: "center", marginTop: "32px", borderTop: "1px solid #e5e5e5", paddingTop: "16px", fontSize: "9px", color: "#737373" }}>
                  You received this email because you are registered at DripDoggy.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Subscribers Tab Panel */
        <div className="bg-white border border-neutral-200/70 p-6 md:p-8">
          <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block border-b border-neutral-200/60 pb-3 mb-6">
            Newsletter Subscriber List
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-450 uppercase text-[8.5px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="text-xs text-neutral-700 divide-y divide-neutral-100">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-10 text-center uppercase tracking-widest text-[9px] text-neutral-400 font-extrabold">
                      No active subscribers registered
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">{sub.email}</td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#382d24] text-[#faf8f5] text-[9px] font-bold tracking-widest px-4.5 py-3.5 uppercase z-50 border border-neutral-700 shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
