"use client";

function Error() {
  return (
    <div className="min-h-screen bg-berkeleyBlue">
      <main className="flex flex-col items-center justify-center min-h-screen font-mono">
        <div className="flex flex-col bg-white shadow-2xl rounded-lg m-8 p-12 text-center">
          An error occurred. Please try again later.
        </div>
      </main>
    </div>
  );
}

export default Error;
