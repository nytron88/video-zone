import { createCanvas } from "canvas";
import { uploadOnCloudinary } from "./cloudinary.js";

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

  const buffer = canvas.toBuffer();
  const uploadedFile = await uploadOnCloudinary(buffer);

  return uploadedFile;
}

async function generateCoverImage(width = 1200, height = 300) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#2b1055");
  gradient.addColorStop(0.5, "#6a0572");
  gradient.addColorStop(1, "#b33771");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer();
  const uploadedFile = await uploadOnCloudinary(buffer);

  console.log(uploadedFile);

  return uploadedFile;
}

export { generateAvatar, generateCoverImage };
