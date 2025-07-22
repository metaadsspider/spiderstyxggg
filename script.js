const socket = io();
const video = document.getElementById("video");
let pc = new RTCPeerConnection();

socket.on("offer", async ({ sdp }) => {
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { sdp: pc.localDescription });
});

socket.on("answer", async ({ sdp }) => {
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
});

socket.on("candidate", ({ candidate }) => {
  pc.addIceCandidate(new RTCIceCandidate(candidate));
});

pc.onicecandidate = e => {
  if (e.candidate) socket.emit("candidate", { candidate: e.candidate });
};

pc.ontrack = e => {
  video.srcObject = e.streams[0];
};

async function startBroadcast() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("offer", { sdp: pc.localDescription });
}

function startViewer() {
  // Viewer waits for offer
}

function toggleTheme() {
  document.body.classList.toggle("light");
}