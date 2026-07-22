import { NextRequest, NextResponse } from "next/server"
import { getPhotoById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { photoId: string } }) {
  try {
    const { photoId } = params

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const photo = await getPhotoById(photoId)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Return the photo data with appropriate content type
    return new NextResponse(photo.photo_data, {
      headers: {
        "Content-Type": photo.mime_type,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    })
  } catch (error) {
    console.error("Error fetching photo:", error)
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 })
  }
}
