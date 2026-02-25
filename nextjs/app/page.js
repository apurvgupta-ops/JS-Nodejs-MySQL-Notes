import Profile from "@/Components/Profile";
import MuxPlayer from "@mux/mux-player-react";

export default function Home() {
  return (
    <div className="h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden flex-col">
      <h1 className="text-7xl">Technical Agency </h1>
      {/* <iframe
        src="https://player.mux.com/Xfh2orkXhgvy981Z00r7K1omTVuO29XI4lEyBh2n4Nbw"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      ></iframe> */}

      {/* <MuxPlayer
        playbackId="Xfh2orkXhgvy981Z00r7K1omTVuO29XI4lEyBh2n4Nbw"
        metadata={{
          video_title: "All about thumbnails",
          video_user_id: "user-1138",
        }}
      /> */}
      <Profile />
    </div>
  );
}
