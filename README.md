# Simple Version of Wysiwyg Rich Text Editor Library

Just use it without pain! :-)Just install and copy the code

## Description

Example how to use teditor when you have multiple products with description and you want not only create html stylized text but send him to the backend and show them on other sides and of course secondly put this sended early html to editor and edit him again

## Key Features and Improvements

1. **Serialization and Deserialization**:
   - Automatically convert values
   - Allow Dynamicly put input data (e.g., text or HTML or if you have dynamic description or products) into the editor and retrieve edited data.

## Customization

- 2.Visit to the original docs of lib :https://jpuri.github.io/react-draft-wysiwyg/#/

## Fast Start

1. **Install the library and all types**:

   ```bash
   yarn add react-draft-wysiwyg
   yarn add @types/react-draft-wysiwyg@^1.13.8 @types/draft-js@^0.11.18 draft-js@^0.11.7 draftjs-to-html@^0.9.1

   ```

2. **Add the Code, Next.js Example(Parent & Children editor component)**:

   ```jsx
   import dynamic from "next/dynamic";
   import React, { useState } from "react";
   import { useForm, FormProvider, useFormContext } from "react-hook-form";
   const productsData = [
     { id: 1, name: "Apple", description: "Fresh and juicy apple" },
     { id: 2, name: "Banana", description: "Ripe and sweet banana" },
     { id: 3, name: "Orange", description: "Juicy citrus orange" },
     { id: 4, name: "Marshmallow", description: "Soft and fluffy marshmallow" },
   ];
   ```

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
        <div className="space-y-4 flex flex-col p-4 border rounded-md">
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

    const selectedProductId = watch("selectedProduct");
    return (
      <FormProvider {...methods}>
        <div className="flex items-center content-center flex-col bg-gray-400 justify-between min-h-[500px] ">
          <ProductSelect setSelectedIndex={setSelectedProductIndex} />
          <div className="min-h-[260px] max-h-[360px]  bg-gray-500 flex items-center justify-center rounded-md ">
            <ExtendedEditor
              productData={
                watch(`products.${selectedProductIndex}.description`) || ""
              }
              productIndex={selectedProductIndex}
            />
          </div>
          <div className="p-4 border rounded-md  flex flex-col ">
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

````

```jsx
"use client";
import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import css from "../src/extendedArea.module.css";
import { toolbarOptions } from "../src/settings";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useFormContext } from "react-hook-form";

interface ExtendedEditorProps {
 productData: string;
 productIndex: number;
}
interface FormValues {
 selectedProduct: "";

 products: { name: string; description: string }[];
}
const ExtendedEditor: React.FC<ExtendedEditorProps> = ({
 productData,
 productIndex,
}) => {
 const { setValue } = useFormContext<FormValues>();
 const [editorState, setEditorState] = useState(EditorState.createEmpty());

 //SET ALL TO STATE
 const onEditorStateChange = (newState: EditorState) => {
   setEditorState(newState);
 };
 //WHEN ADD
 const pushHtmlContent = () => {
   const rawContentState = convertToRaw(editorState.getCurrentContent());
   const htmlContent = draftToHtml(rawContentState);
   const convertedToStringAllData = JSON.stringify(htmlContent);
   setValue(`products.${productIndex}.description`, convertedToStringAllData);
   return convertedToStringAllData;
 };

 //check simple text or it is new html text
 const isJsonString = (str: string) => {
   try {
     JSON.parse(str);
     return true;
   } catch (e) {
     return false;
   }
 };
 let descriptionParsed: string | object = "";
 const GetAndConvertValues = async () => {
   if (typeof productData === "string" && isJsonString(productData)) {
     descriptionParsed = JSON.parse(productData);
   } else {
     descriptionParsed = productData;
   }
   return descriptionParsed;
 };

 console.log(GetAndConvertValues());

 useEffect(() => {
   GetAndConvertValues();
   const contentBlock = htmlToDraft(descriptionParsed);
   if (contentBlock) {
     const contentState = ContentState.createFromBlockArray(
       contentBlock.contentBlocks
     );
     const editorStateFromServer = EditorState.createWithContent(contentState);
     setEditorState(editorStateFromServer);
   }
 }, [productData]);
 //note:how it work when generate html=>state editor(specified)=>  (convert to)raw format=>  (convert raw to html)html from raw =>  string from html=>send
 //note:how it work when get simple text or old generated html:string=>html=>raw=>content state
 //test note
 //removeBrokenStyles
 function addHoverStyles(className: any) {
   const style = document.createElement("style");
   style.innerHTML = `
       .${className}:hover {
           box-shadow: none;
           background-color: transparent;
           border: none;
       }
   `;
   document.head.appendChild(style);
 }
 function removeWeirdStyle(className: any) {
   const style = document.createElement("style");
   style.innerHTML = `
       .${className} {
margin: 3px 0;
       }
   `;
   document.head.appendChild(style);
 }

 addHoverStyles("rdw-option-wrapper");
 removeWeirdStyle("public-DraftStyleDefault-block");
 removeWeirdStyle("public-DraftStyleDefault-ul");
 removeWeirdStyle("public-DraftStyleDefault-ol");
 return (
   <div className={css.wrapper}>
     <Editor
       editorState={editorState}
       wrapperClassName={css.wrapper}
       toolbarClassName={css.wrapperToolbar}
       editorClassName={css.wrapperEditor}
       onEditorStateChange={onEditorStateChange}
       onBlur={pushHtmlContent}
       toolbar={toolbarOptions}
     />
   </div>
 );
};

export default ExtendedEditor;
````

```jsx
import css from "../src/extendedArea.module.css";
const a = "../public/globe.svg";

// /**
//  * This is default toolbar configuration,
//  * whatever user passes in toolbar property is deeply merged with this to over-ride defaults.
//  */
//**************
// // iconOnClick: [""],=======================================how to import images localy with using classic path
// // iconOnClick: [`${bold}`],================================how to use import with using $imported image

export const toolbarOptions = {
  options: ["inline", "blockType", "list", "textAlign"],
  // options: [=============================================/default options
  //   "inline",
  //   "blockType",
  //   "fontSize",
  //   "fontFamily",
  //   "list",
  //   "textAlign",
  //   "colorPicker",
  //   "link",
  //   "embedded",
  //   "emoji",
  //   "image",
  //   "remove",
  //   "history",
  // ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: [
      "bold",
      "italic",
      "underline",
      // "strikethrough",
      // "monospace",
      // "superscript",
      // "subscript",
    ],
    bold: {
      icon: "/customIcons/white/bold.svg",

      className: css.iconB,
      title: undefined,
    },
    italic: {
      icon: "/customIcons/white/italic.svg",

      className: css.IconI,
      title: undefined,
    },
    underline: {
      icon: "/customIcons/white/underline.svg",

      className: css.iconU,
      title: undefined,
    },
    strikethrough: {
      icon: undefined,
      className: undefined,
      title: undefined,
      iconOnClick: undefined,
    },
    monospace: { icon: undefined, className: undefined, title: undefined },
    superscript: { icon: undefined, className: undefined, title: undefined },
    subscript: { icon: undefined, className: undefined, title: undefined },
  },
  blockType: {
    inDropdown: false, //if true then just delete some strings if you need ti use it//
    // options: [
    //   "Normal",
    //   "H1",
    //   "H2",
    //   "H3",
    //   "H4",
    //   "H5",
    //   "H6",
    //   "Blockquote",
    //   "Code",
    // ],
    options: ["H1", "H2"],
    styleImagesWhenDropDownIsFalse: {
      Normal: {
        icon: undefined,

        label: "Normal",
      },
      H1: {
        icon: ["/customIcons/white/ho.png"],

        label: "H1",
      },
      H2: {
        icon: "/customIcons/white/hs.png",

        label: "H2",
      },
      H3: {
        icon: undefined,

        label: "H3",
      },
      H4: {
        icon: undefined,

        label: "H4",
      },
      H5: {
        icon: undefined,

        label: "H5",
      },
      H6: {
        icon: undefined,

        label: "H6",
      },
      Blockquote: {
        icon: undefined,

        label: "Blockquote",
      },
      Code: { icon: undefined, label: "Code" },
    },

    BlockQuote: { icon: undefined, className: undefined, title: undefined },
    Code: { icon: undefined, className: undefined, title: undefined },
    className: css.rdwlistwrapper,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined,
  },
  fontSize: {
    icon: undefined,
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined,
  },
  fontFamily: {
    options: [
      "Arial",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana",
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered"],
    // options: ["unordered", "ordered", "indent", "outdent"],
    unordered: {
      icon: "/customIcons/white/dots.svg",

      className: css.iconDots,
      title: undefined,
    },
    ordered: {
      icon: "/customIcons/white/numbers.svg",

      className: css.iconNumber,
      title: undefined,
    },
    indent: {
      icon: undefined,

      className: undefined,
      title: undefined,
    },
    outdent: {
      icon: undefined,

      className: undefined,
      title: undefined,
    },
    title: undefined,
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["left", "center", "right"],
    // options: ["left", "center", "right", "justify"],
    left: {
      icon: "/customIcons/white/left.svg",

      className: css.textAlignLeft,
      title: undefined,
    },
    center: {
      icon: "/customIcons/white/center.svg",

      className: css.textAlignCenter,
      title: undefined,
    },
    right: {
      icon: "/customIcons/white/right.svg",

      className: css.textAlignRight,
      title: undefined,
    },
    justify: {
      icon: undefined,

      className: undefined,
      title: undefined,
    },
    title: undefined,
  },
  colorPicker: {
    icon: undefined,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    colors: [
      "rgb(97,189,109)",
      "rgb(26,188,156)",
      "rgb(84,172,210)",
      "rgb(44,130,201)",
      "rgb(147,101,184)",
      "rgb(71,85,119)",
      "rgb(204,204,204)",
      "rgb(65,168,95)",
      "rgb(0,168,133)",
      "rgb(61,142,185)",
      "rgb(41,105,176)",
      "rgb(85,57,130)",
      "rgb(40,50,78)",
      "rgb(0,0,0)",
      "rgb(247,218,100)",
      "rgb(251,160,38)",
      "rgb(235,107,86)",
      "rgb(226,80,65)",
      "rgb(163,143,132)",
      "rgb(239,239,239)",
      "rgb(255,255,255)",
      "rgb(250,197,28)",
      "rgb(243,121,52)",
      "rgb(209,72,65)",
      "rgb(184,49,47)",
      "rgb(124,112,107)",
      "rgb(209,213,216)",
    ],
    title: undefined,
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link", "unlink"],
    link: { icon: undefined, className: undefined, title: undefined },
    unlink: { icon: undefined, className: undefined, title: undefined },
    linkCallback: undefined,
  },
  emoji: {
    icon: undefined,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    emojis: [
      "😀",
      "😁",
      "😂",
      "😃",
      "😉",
      "😋",
      "😎",
      "😍",
      "😗",
      "🤗",
      "🤔",
      "😣",
      "😫",
      "😴",
      "😌",
      "🤓",
      "😛",
      "😜",
      "😠",
      "😇",
      "😷",
      "😈",
      "👻",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "🙈",
      "🙉",
      "🙊",
      "👼",
      "👮",
      "🕵",
      "💂",
      "👳",
      "🎅",
      "👸",
      "👰",
      "👲",
      "🙍",
      "🙇",
      "🚶",
      "🏃",
      "💃",
      "⛷",
      "🏂",
      "🏌",
      "🏄",
      "🚣",
      "🏊",
      "⛹",
      "🏋",
      "🚴",
      "👫",
      "💪",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "🖖",
      "🤘",
      "🖐",
      "👌",
      "👍",
      "👎",
      "✊",
      "👊",
      "👏",
      "🙌",
      "🙏",
      "🐵",
      "🐶",
      "🐇",
      "🐥",
      "🐸",
      "🐌",
      "🐛",
      "🐜",
      "🐝",
      "🍉",
      "🍄",
      "🍔",
      "🍤",
      "🍨",
      "🍪",
      "🎂",
      "🍰",
      "🍾",
      "🍷",
      "🍸",
      "🍺",
      "🌍",
      "🚑",
      "⏰",
      "🌙",
      "🌝",
      "🌞",
      "⭐",
      "🌟",
      "🌠",
      "🌨",
      "🌩",
      "⛄",
      "🔥",
      "🎄",
      "🎈",
      "🎉",
      "🎊",
      "🎁",
      "🎗",
      "🏀",
      "🏈",
      "🎲",
      "🔇",
      "🔈",
      "📣",
      "🔔",
      "🎵",
      "🎷",
      "💰",
      "🖊",
      "📅",
      "✅",
      "❎",
      "💯",
    ],
    title: undefined,
  },
  embedded: {
    icon: undefined,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    embedCallback: undefined,
    defaultSize: {
      height: "auto",
      width: "auto",
    },
    title: undefined,
  },
  image: {
    icon: undefined,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: true,
    previewImage: false,
    alignmentEnabled: true,
    uploadCallback: undefined,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "auto",
      width: "auto",
    },
    title: undefined,
  },
  remove: {
    icon: undefined,
    className: undefined,
    component: undefined,
    title: undefined,
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["undo", "redo"],
    undo: { icon: undefined, className: undefined, title: undefined },
    redo: { icon: undefined, className: undefined, title: undefined },
    title: undefined,
  },
};
```

3. **Enjoy!**
   - Input your data or put dynamic text(data) and retrieve already prepared HTML to send to the backend.

---
