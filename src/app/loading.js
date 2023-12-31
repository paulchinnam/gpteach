// components/Loading.js
import Image from "next/image";
import loading from "public/loading.svg";
function Loading() {
  return (
    <div className="flex h-screen justify-center text-center">
      <Image src={loading} alt="loading animation" />
    </div>
  );
}

export default Loading;
