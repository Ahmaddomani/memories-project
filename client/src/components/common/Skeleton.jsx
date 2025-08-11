import Skeleton from "react-loading-skeleton";
import Navbar from "../../pages/Navbar";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonPage = () => {
  return (
    <div className="bg-teal-700 h-screen">
      <div className="content px-4 grid  grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mt-5">
        {Array(6)
          .fill(0)
          .map((_, i) => {
            return (
              <div key={i} className="card bg-white space-y-2 p-8">
                <Skeleton height={20} width={"60%"} />
                <Skeleton count={3} />
                <Skeleton height={30} width={"30%"} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
