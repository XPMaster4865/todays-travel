"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { roles: Role[] };

const MEDIA_ROLES = ["Owner", "Media Team", "Head of Media"];

export default function GalleryUpload() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    try {
      const session: Session = JSON.parse(stored);
      if (!session.roles.some((r) => MEDIA_ROLES.includes(r.label))) {
        router.replace("/portal");
        return;
      }
    } catch { router.replace("/portal"); return; }
    setAuthorized(true);
    setLoading(false);
  }, [router]);

  const onFilesChange = (list: FileList | null) => {
    const arr = list ? Array.from(list) : [];
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const submit = async () => {
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      files.forEach((f) => form.append("images", f));

      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      const data = await res.json() as { uploaded?: string[]; error?: string; detail?: string };
      if (data.uploaded) {
        setMessage(`Uploaded ${data.uploaded.length} image${data.uploaded.length === 1 ? "" : "s"} to the gallery.`);
        setFiles([]);
        setPreviews([]);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setError(`${data.error ?? "Failed to upload."}${data.detail ? ` (${data.detail})` : ""}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Gallery <span className="text-[#2dd4bf]">Upload</span>
      </h1>

      <PortalTabs />

      <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
        <h2 className="font-bold text-lg mb-1 text-[#c084fc]">Upload Photos</h2>
        <p className="text-xs text-[#f0eaff]/40 mb-4">
          Photos uploaded here appear on the public Gallery page immediately.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => onFilesChange(e.target.files)}
          className="block w-full text-sm text-[#f0eaff]/70 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-[#8b3cf7] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#7c3aed]"
        />

        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded-lg border border-purple-900/40" />
            ))}
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
        >
          {submitting ? "Uploading..." : "Upload to Gallery"}
        </button>

        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <a
          href="/gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-6 text-center text-sm text-[#2dd4bf] hover:underline"
        >
          View public Gallery page →
        </a>
      </div>
    </div>
  );
}
