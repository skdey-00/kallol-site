import { NextRequest, NextResponse } from "next/server"
import { getPhotoById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ photoId: string }> }) {
  try {
    const { photoId } = await params

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const photo = await getPhotoById(photoId)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Return the photo data with appropriate content type.
    // Copy into a plain Uint8Array: Buffer<ArrayBufferLike> doesn't satisfy
    // BodyInit under newer @types/node, and this avoids sending the pool's
    // parent buffer along.
    return new NextResponse(new Uint8Array(photo.photo_data), {
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
