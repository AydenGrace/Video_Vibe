import { getVideos } from "../apis/videos";

export async function videoLoader() {
  return await getVideos();
}
