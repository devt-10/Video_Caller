import { Routes, Route } from "react-router-dom";
import Lobby from "./screens/Lobby";
import Room from "./screens/Room";
import Demo from "./screens/Demo";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Lobby></Lobby>}></Route>
        <Route path="/room/:id" element={<Room></Room>}></Route>
        <Route path="/demo" element={<Demo></Demo>}></Route>
      </Routes>
    </>
  );
}

export default App;
