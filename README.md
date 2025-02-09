# Simple Version of Wysiwyg Rich Text Editor Library

Just use it without pain! ;-)Just install and copy the code

---

## How It Looks and How to Start

![Demo](./public/visualize.png)

---

## Description

A streamlined, Ready to use implementation of the Wysiwyg Rich Text Editor Library
that allow you to fast start ,fast customize buttons and use editor like simple input filed for dynamic text/description or products with them,for the latest version of Next.js.

This version prioritizes **stability** and **ease of use** over complex features, making it ideal for projects that need reliable rich text editing without the complexity of the full Wysiwyg ecosystem.

---

## Key Features and Improvements

1. **Customizable Buttons**:

   - Added functionality for clickable buttons that are easy to customize.
   - Simply import your image version of a button, and you're good to go!

2. **Serialization and Deserialization**:

   - Allow Dynamicly put input data (e.g., text or HTML or if you have dynamic description or products) into the editor and retrieve edited data.
   - Automatically convert values.

---

## Customization

- If you don’t need extra features or customization then you have a multiple ways:
- 1.copy the source code of this modyfied version: library and add some features then pack and install the new package loccaly(read the official documentation how to pack/unpack lib with use yarn/ or npm)
- 1.1 note:if you will be use library localy and you use a gitLab and Docker then DONT FORGET ADD this simple lines of code to the docker build files:
- 2.or visit to the original docs of lib :https://jpuri.github.io/react-draft-wysiwyg/#/ install and use standard version lib and use my code there like a example how to fast start (down bellow example how to use(but without clickable buttons feature(becauze my library have this feature)))

---

## Fast Start

1. **Install the library and all types**:

   ```bash
   yarn add wysiwyg-simple-editor-dynamic
   yarn add @types/react-draft-wysiwyg@^1.13.8 @types/draft-js@^0.11.18 draft-js@^0.11.7 draftjs-to-html@^0.9.1

   ```

2. **Copy images from folder**:

   - After installation library, locate the library in `node_modules`.
   - Path: `node_modules/wysiwyg-simple-editor-dynamic/public`.
   - Copy the `customIcons` folder to your public folder and use the default icons or add your own images.

3. **Add the Code Next.js Example(Parent & Children editor component)**:

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
                 productsData.findIndex(
                   (p) => p.id.toString() === e.target.value
                 )
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
           <div className="p-4 border rounded-md ">
             <strong>
               Description / how generated html text looks on other side of page
               :
             </strong>{" "}
             {selectedProductId &&
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
   ```

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
   ```

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
         icon: "/customIcons/white/b.svg",
         iconOnClick: ["/customIcons/green/b.svg"],
         className: css.iconB,
         title: undefined,
       },
       italic: {
         icon: "/customIcons/white/i.svg",
         iconOnClick: ["/customIcons/green/i.svg"],
         className: css.Iconi,
         title: undefined,
       },
       underline: {
         icon: "/customIcons/white/u.svg",
         iconOnClick: ["/customIcons/green/u.svg"],
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
           iconOnClick: undefined,
           label: "Normal",
         },
         H1: {
           icon: ["/customIcons/white/ho.png"],
           iconOnClick: ["/customIcons/green/ho.png"],
           label: "H1",
         },
         H2: {
           icon: "/customIcons/white/hs.png",
           iconOnClick: ["/customIcons/green/hs.png"],
           label: "H2",
         },
         H3: {
           icon: undefined,
           iconOnClick: undefined,
           label: "H3",
         },
         H4: {
           icon: undefined,
           iconOnClick: undefined,
           label: "H4",
         },
         H5: {
           icon: undefined,
           iconOnClick: undefined,
           label: "H5",
         },
         H6: {
           icon: undefined,
           iconOnClick: undefined,
           label: "H6",
         },
         Blockquote: {
           icon: undefined,
           iconOnClick: undefined,
           label: "Blockquote",
         },
         Code: { icon: undefined, iconOnClick: undefined, label: "Code" },
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
         icon: "/customIcons/white/dots.png",
         iconOnClick: ["/customIcons/green/dots.png"],
         className: css.iconDots,
         title: undefined,
       },
       ordered: {
         icon: "/customIcons/white/numbr.png",
         iconOnClick: ["/customIcons/green/numbr.png"],
         className: css.iconNumber,
         title: undefined,
       },
       indent: {
         icon: undefined,
         iconOnClick: undefined,
         className: undefined,
         title: undefined,
       },
       outdent: {
         icon: undefined,
         iconOnClick: undefined,
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
         icon: "/customIcons/white/left.png",
         iconOnClick: ["/customIcons/green/left.png"],
         className: css.textAlignLeft,
         title: undefined,
       },
       center: {
         icon: "/customIcons/white/center.png",
         iconOnClick: ["/customIcons/green/center.png"],
         className: css.textAlignCenter,
         title: undefined,
       },
       right: {
         icon: "/customIcons/white/right.png",
         iconOnClick: ["/customIcons/green/right.png"],
         className: css.textAlignRight,
         title: undefined,
       },
       justify: {
         icon: undefined,
         iconOnClick: undefined,
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

   ```jsx
    /* styeles for wrapper */
    .preWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    }
    .wrapper {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: auto;
    resize: none;
    font-size: 0.75rem;
    outline: none; /* focus:outline-none */
    align-self: center;
    }

    .wrapperToolbar {
    width: 100%;
    background-color: rgb(72 76 82 / var(--tw-bg-opacity));
    border: 1px solid #4b5563; /* border-gray-600 */
    border-radius: 0.475rem;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    }

    .wrapperEditor {
    padding: 0px 10px 0px 10px;
    height: 150px;
    margin-top: 2rem;
    background-color: rgb(72 76 82 / var(--tw-bg-opacity));
    border: 1px solid #4b5563;
    border-radius: 0.475rem;
    font-size: initial;
    font-weight: initial;
    }
    .wrapperEditor h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.67em 0;
    direction: ltr;
    display: inline;
    font-family: "Roboto", sans-serif;
    overflow-wrap: break-word;
    }
    .wrapperEditor h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.83em 0;
    direction: ltr;
    display: inline;
    font-family: "Roboto", sans-serif;
    overflow-wrap: break-word;
    }
    .wrapperEditor p {
    overflow-wrap: anywhere;
    }
    .wrapperEditor span {
    overflow-wrap: anywhere;
    }

    /* styles of elements */

    .iconB,
    .Iconi,
    .iconU,
    .iconDots,
    .iconNumber,
    .textAlignLeft,
    .textAlignCenter,
    .textAlignRight {
    background-color: transparent;
    box-shadow: none;
    width: 50px;
    height: 35px;
    border: 0px solid #4b5563;
    }

    .iconB:hover,
    .IconI:hover,
    .iconU:hover,
    .iconDots:hover,
    .iconNumber:hover,
    .textAlignLeft:hover,
    .textAlignCenter:hover,
    .textAlignRight:hover {
    box-shadow: none;
    }
    .iconB:active,
    .IconI:active,
    .iconU:active,
    .iconDots:active,
    .iconNumber:active,
    .textAlignLeft:active,
    .textAlignCenter:active,
    .textAlignRight:active {
    box-shadow: none;
    }

    /* special styles for h1 nad h2 elements becauze this elements wont be styled trough classic wrapper as you cenn se upper */
    .rdwlistwrapper {
    background: transparent;
    color: black;
    box-shadow: none;
    margin-right: 23px;
    margin-left: 10px;
    }
    .rdwlistwrapper * {
    color: inherit;
    font-size: 25px;
    color: white;
    font-weight: 500;
    background: inherit;
    box-shadow: none;
    border: 0px solid #4b5563;
    }
    /* .rdwlistwrapper:hover * {
    border: 1px solid #3bea3e;
    box-shadow: none;
    }

    .rdwlistwrapper:active * {
    border: 1px solid #3bea3e;
    color: #47cf73;
    } */

    /* end of spec style for both elements */
    /* ====================================== */

    @media screen and (min-width: 200px) and (max-width: 423px) {
    .wrapperToolbar {
        height: 7rem;
        width: 97%;
        margin-left: 0.3rem;
    }
    }
    @media screen and (min-width: 424px) and (max-width: 700px) {
    .wrapperToolbar {
        height: 7rem;
        width: 97%;
        margin-left: 0.3rem;
        justify-content: space-around;
    }
    }
   ```

4. **Enjoy!**
   - Input your data or put dynamic text(data) and retrieve already prepared HTML to send to the backend.

---
