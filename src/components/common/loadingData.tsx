import PacmanLoader from "react-spinners/PacmanLoader";

function LoadingData() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <PacmanLoader color="#f45b1a" size={20} />
    </div>
  );
}

export default LoadingData;
