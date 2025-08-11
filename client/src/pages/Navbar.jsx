import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="nav flex justify-between py-3 px-5 bg-slate-900 items-center">
      <h1 className="text-teal-600 text-3xl">ThinkBoard</h1>
      <Link to="/createNote" className="btn btn-outline btn-accent ">
        <div className="flex items-center w-[90px] justify-between">
          <span className="text-2xl block mb-[5px]">+</span>
          <h2>New Note</h2>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
