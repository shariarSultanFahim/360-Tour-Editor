import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const jsonFilePath = path.join(process.cwd(), "public", "pannellum.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading tour config:", error);
    return NextResponse.json(
      { message: "Error reading configuration file." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newConfig = await request.json();
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(newConfig, null, 2),
      "utf8"
    );
    return NextResponse.json(
      { message: "Configuration saved successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error writing tour config:", error);
    return NextResponse.json(
      { message: "Error saving configuration file." },
      { status: 500 }
    );
  }
}
