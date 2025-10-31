import React, { useEffect, useState } from "react";
import api from '../services/api';
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CloudUpload, Download } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";

export default function ProjectFiles() {
  const { projectId } = useParams();          //  /:projectId/files
  const { user } = useAuth();                 // we need .role & maybe .id
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [forAdmin, setForAdmin] = useState(false); // checkbox

  const loadFiles = async () => {
    const res = await api.get(`/files/project/${projectId}`);
    setFiles(res.data);
  };
  useEffect(() => { loadFiles(); }, [projectId]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("project", projectId);
    fd.append("isForAdmin", forAdmin);
    setUploading(true);
    try {
      await api.post("/files/upload", fd);
      toast.success("Uploaded");
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
    setUploading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Files</h1>
      {/* Upload */}
      <div className="flex items-center space-x-4 mb-6">
        <label className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700">
          <CloudUpload size={18} className="mr-2" />
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            onChange={upload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* in-charge can flag for admin */}
        {user.role === "incharge" && (
          <label className="inline-flex items-center text-sm space-x-1">
            <input
              type="checkbox"
              checked={forAdmin}
              onChange={(e) => setForAdmin(e.target.checked)}
            />
            <span>Send to admin</span>
          </label>
        )}
      </div>

      {/* List */}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-indigo-50 text-left">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Uploader</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f._id} className="odd:bg-white even:bg-gray-50">
              <td className="px-3 py-2">{f.originalName}</td>
              <td className="px-3 py-2">{f.uploader.name}</td>
              <td className="px-3 py-2">
                {dayjs(f.createdAt).format("DD MMM YYYY")}
              </td>
              <td className="px-3 py-2">
                <a
                  href={`/api/files/${f._id}/download`}
                  className="text-indigo-600 hover:underline flex items-center text-xs"
                >
                  <Download size={14} className="mr-1" /> Download
                </a>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No files yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
