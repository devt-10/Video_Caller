import { Routes, Route } from "react-router-dom";
import Lobby from "./screens/Lobby";
import Room from "./screens/Room";
import Demo from "./screens/Demo";
import GetStarted from "./screens/GetStarted";
import ExpertLobby from "./screens/ExpertLobby";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetStarted></GetStarted>}></Route>
        <Route path="/lobby" element={<Lobby></Lobby>}></Route>
        <Route path="/room/:id" element={<Room></Room>}></Route>
        <Route path="/demo" element={<Demo></Demo>}></Route>
        <Route path="/expert" element={<ExpertLobby></ExpertLobby>}></Route>
      </Routes>
    </>
  );
}

export default App;
