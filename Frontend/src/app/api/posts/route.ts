import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers'; 
import { verifyToken } from '@/lib/jwt'; 

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('3RVision');
    
    // Use "Community" collection instead of "posts"
    const posts = await db.collection('Community').find({}).sort({ timestamp: -1 }).toArray();
    
    // Ensure all posts have the required fields
    const formattedPosts = posts.map(post => ({
      ...post,
      postType: post.postType || "text",
      linkUrl: post.linkUrl || "",
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error); 
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    // Get user from JWT token in cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    // Get user data from token
    let user = null;
    if (token) {
      try {
        user = verifyToken(token);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    
    const userData = await request.json();
    
    // Ensure all required fields are present
    const postData = {
      title: userData.title || "",
      description: userData.description || "",
      image: userData.image || "",
      author: (user && typeof user === 'object' && 'name' in user ? user.name : undefined) || userData.author || "Anonymous",
      timestamp: userData.timestamp || new Date().toISOString(),
      likes: userData.likes || 0,
      comments: Array.isArray(userData.comments) ? userData.comments : [],
      tags: Array.isArray(userData.tags) ? userData.tags : [],
      postType: userData.postType || "text",
      linkUrl: userData.linkUrl || "",
    };
    
    const client = await clientPromise;
    const db = client.db('3RVision');
    
    // Insert post into Community collectionsss
    const result = await db.collection('Community').insertOne(postData);
    
    // Get the complete post document to return
    const insertedPost = await db.collection('Community').findOne({ _id: result.insertedId });
    
    if (!insertedPost) {
      throw new Error("Failed to retrieve inserted post");
    }
    
    // Ensure all fields are included in the response
    const responsePost = {
      ...insertedPost,
      postType: insertedPost.postType || postData.postType || "text",
      linkUrl: insertedPost.linkUrl || postData.linkUrl || "",
    };
    
    return NextResponse.json({
      success: true,
      post: responsePost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}