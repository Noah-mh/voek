import { Cloudinary } from "@cloudinary/url-gen";
//Noah's code
export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const defaultPreset = import.meta.env
  .VITE_CLOUDINARY_DEFAULT_PRESET;
export const chatPreset = import.meta.env.VITE_CLOUDINARY_CHAT_PRESET;

export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
});
