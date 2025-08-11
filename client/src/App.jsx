import { Route, Routes } from "react-router";
import { Login } from "./pages/login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { CreateNote } from "./pages/CreateNote";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createNote" element={<CreateNote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
