import { NextResponse } from "next/server";
import { getCourses } from "@/lib/site";

export async function GET() {
  return NextResponse.json({ courses: await getCourses() });
}
