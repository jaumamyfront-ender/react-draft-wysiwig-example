import dynamic from "next/dynamic";

const ClientComponent = dynamic(() => import("../src/editor"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex items-center content-center flex-col bg-gray-400 h-[400px]">
      <h1 className="mt-4">Page With Client Componet</h1>
      <div className="min-h-[260px] max-h-[360px]  bg-gray-500 flex items-center justify-center rounded-md mt-4 ">
        <ClientComponent
          indexProduct={1}
          isStepOne={false}
          productDescriptioForStepOne="some description"
        />
      </div>
    </div>
  );
}
