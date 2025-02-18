import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
const productsData = [
  { id: 1, name: "Apple", description: "Fresh and juicy apple" },
  { id: 2, name: "Banana", description: "Ripe and sweet banana" },
  { id: 3, name: "Orange", description: "Juicy citrus orange" },
  { id: 4, name: "Marshmallow", description: "Soft and fluffy marshmallow" },
];

const ExtendedEditor = dynamic(() => import("../src/editor"), {
  ssr: false,
});

export default function Page() {
  const methods = useForm({
    defaultValues: {
      selectedProduct: "",
      products: productsData,
    },
  });

  const { watch } = methods;
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  const ProductSelect = ({ setSelectedIndex }: any) => {
    const { watch, setValue } = useFormContext();
    const selectedProductId = watch("selectedProduct");

    return (
      <div className="space-y-4 flex flex-col p-4 border rounded-md mb-6">
        <strong className="">
          exmaple-new products/description from api or new from user{" "}
        </strong>
        <select
          className="border rounded-md p-2bg-white text-black text-right "
          value={selectedProductId}
          onChange={(e) => {
            setValue("selectedProduct", e.target.value);
            setSelectedIndex(
              productsData.findIndex((p) => p.id.toString() === e.target.value)
            );
          }}
        >
          <option value="" className="text-gray-700 bg-gray-100 self-end">
            🔽 Change The Product
          </option>
          {productsData.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  const description =
    watch(`products.${selectedProductIndex}.description`) || "";

  // const selectedProductId = watch("selectedProduct");
  return (
    <FormProvider {...methods}>
      <div className="flex items-center content-center flex-col bg-gray-400 justify-between min-h-[500px]  ">
        <ProductSelect setSelectedIndex={setSelectedProductIndex} />
        <div className="min-h-[260px] max-h-[360px]  bg-gray-500 flex items-center justify-center rounded-md ">
          <ExtendedEditor
            productData={
              watch(`products.${selectedProductIndex}.description`) || ""
            }
            productIndex={selectedProductIndex}
          />
        </div>
        <div className="p-4 border rounded-md  flex flex-col mt-6">
          <strong>
            Description / how generated html text looks on other side of page :
          </strong>{" "}
          <strong>
            {" "}
            Note: don't forget to add default styles to ul/ol/li el because next
            js nullifies these default html styles.See example in globals.css!
          </strong>
          {true &&
            (() => {
              const containsHTML = /<\/?[a-z][\s\S]*>/i.test(description);
              let cleanedHtml = description
                .replace(/^"(.*)"$/, "$1")
                .replace(/\\r\\n/g, "\n")
                .replace(/\\n/g, "\n")
                .trim();

              return containsHTML ? (
                <span dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
              ) : (
                <span>{description}</span>
              );
            })()}
        </div>
      </div>
    </FormProvider>
  );
}
