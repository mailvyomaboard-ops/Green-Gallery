import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Allow images and multimedia architecture videos up to 50MB
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "File exceeds 50MB limit." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".jpg";
      const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov", ".ogg", ".pdf"];
      const safeExt = allowedExts.includes(ext.toLowerCase()) ? ext.toLowerCase() : ".jpg";
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
      const fileName = `${baseName}_${Date.now()}${safeExt}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
    } else {
      // JSON with base64 data URL
      const body = await req.json();
      if (!body.base64) {
        return NextResponse.json({ error: "No base64 image provided" }, { status: 400 });
      }

      const matches = body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: "Invalid base64 string" }, { status: 400 });
      }

      const mimeType = matches[1];
      const dataBuffer = Buffer.from(matches[2], "base64");

      let ext = ".jpg";
      if (mimeType === "image/png") ext = ".png";
      else if (mimeType === "image/webp") ext = ".webp";
      else if (mimeType === "image/gif") ext = ".gif";

      const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, dataBuffer);
      return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
