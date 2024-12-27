import { createCanvas } from "canvas";
import { uploadOnCloudinary } from "./cloudinary.js";
import fs from "fs/promises";

async function generateAvatar(name, size = 100) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const colors = ["#FF5733", "#33FF57", "#5733FF", "#33FFF5", "#F5FF33"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  ctx.font = `${size / 2}px Arial`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, size / 2, size / 2);

  const filePath = `./public/temp/${Date.now()} ${name}.png`;

  await fs.writeFile(filePath, canvas.toBuffer());

  const uploadedFile = await uploadOnCloudinary(filePath);

  return uploadedFile;
}

export default generateAvatar;
