import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("file", file);

    // Use o upload_preset(projects images) configurado no Cloudinary
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!); 
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
