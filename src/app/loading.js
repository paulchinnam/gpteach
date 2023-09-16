import Image from "next/image";
import loading from "public/loading.svg";
export default function Loading() {
  return (
    <>
      <main className="flex justify-center h-screen items-center">
        <Image src={loading} />
      </main>
    </>
  );
}
