export default function Dashboard() {
  return (
    <main className="flex justify-center p-20">
      <div>
        <label className="sr-only">URL</label>
        <input
          type="url"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="enter a url"
        />
      </div>
    </main>
  );
}
