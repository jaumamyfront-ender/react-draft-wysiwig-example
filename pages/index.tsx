import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

const productsData = [
  { id: 1, name: "Яблоко", description: "Свежее и сочное яблоко" },
  { id: 2, name: "Банан", description: "Спелый и сладкий банан" },
  { id: 3, name: "Апельсин", description: "Сочный цитрусовый апельсин" },
];
const ExtendedEditor = dynamic(() => import("../src/editor"), {
  ssr: false,
});

export default function Page() {
  const methods = useForm({
    defaultValues: {
      products: productsData,
    },
  });

  const { watch } = methods;
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  const ProductSelect = ({ setSelectedIndex }: any) => {
    const { watch, setValue } = useFormContext();
    const selectedProductId = watch("selectedProduct");

    return (
      <div className="space-y-4">
        <select
          className="border rounded-md p-2"
          value={selectedProductId}
          onChange={(e) => {
            setValue("selectedProduct", e.target.value);
            setSelectedIndex(
              productsData.findIndex((p) => p.id.toString() === e.target.value)
            );
          }}
        >
          <option value="" className="text-black">
            Выберите продукт
          </option>
          {productsData.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        {selectedProductId && (
          <div className="p-4 border rounded-md">
            <strong>Description:</strong>{" "}
            {
              productsData.find((p) => p.id.toString() === selectedProductId)
                ?.description
            }
          </div>
        )}
      </div>
    );
  };
  const a = watch(`products.${selectedProductIndex}.description`) || "";
  console.log("in parent", a);
  return (
    <FormProvider {...methods}>
      <div className="flex items-center content-center flex-col bg-gray-400 h-[400px]">
        <h1 className="mt-4">Page With Client Componet</h1>
        <ProductSelect setSelectedIndex={setSelectedProductIndex} />
        <div className="min-h-[260px] max-h-[360px]  bg-gray-500 flex items-center justify-center rounded-md mt-4 ">
          <ExtendedEditor
            productData={
              watch(`products.${selectedProductIndex}.description`) || ""
            }
            productIndex={selectedProductIndex}
          />
        </div>
      </div>
    </FormProvider>
  );
}
