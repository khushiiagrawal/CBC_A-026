import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

// MongoDB connection function
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI ;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  const client = await MongoClient.connect(uri);
  const db = client.db("3RVision");
  return { client, db };
}

// Define the Comment interface
interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export async function POST(
  request: Request,
  { params }: { params: any }
) {
  try {
    // Safely access params whether it's a Promise or not
    const id = params && (params instanceof Promise ? (await params).id : params.id);
    const { text } = await request.json();

    // Get user from JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    // Default author
    let author = "Anonymous";
    
    if (token) {
      try {
        const userData = verifyToken(token);
        if (typeof userData !== 'string' && userData && 'name' in userData) {
          author = userData.name as string;
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // Create comment
    const comment: Comment = {
      id: new ObjectId().toString(),
      text,
      author,
      timestamp: new Date().toISOString()
    };

    // Connect to database
    const { client, db } = await connectToDatabase();

    try {
      // Add comment to post in Community collection
      const result = await db.collection("Community").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { comments: comment as any } },
        { returnDocument: "after" }
      );

      if (!result) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        comment,
        post: result
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}