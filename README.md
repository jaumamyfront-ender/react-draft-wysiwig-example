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

    // import { useFormContext } from "react-hook-form";
    // import { FormValues } from "pages/creator/video/components/videoAddEdit/videoAddEditForm";
    interface ExtendedEditorProps {
    isStepOne?: boolean;
    productDescriptioForStepOne: string;
    indexProduct: number;
    }
    const ExtendedEditor: React.FC<ExtendedEditorProps> = ({
    isStepOne,
    productDescriptioForStepOne,
    indexProduct,
    }) => {
    console.log(css);
    // const { setValue, watch } = useFormContext<FormValues>();
    // const isDataINWatch = watch("description");
    const isDataINWatch = "some data";
    // const productDescriptioForStepOne = watch(`products.${indexProduct}.description`)
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [ReadyToSendPreparedHtml, setReadyToSendPreparedHtml] = useState<any>();
    console.log("ReadyToSendPreparedHtml", ReadyToSendPreparedHtml);
    //SET ALL TO STATE
    const onEditorStateChange = (newState: EditorState) => {
        setEditorState(newState);
    };
    //WHEN ADD
    const pushHtmlContent = () => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = draftToHtml(rawContentState);
        console.log("editor state", editorState);
        console.log("state to raw", rawContentState);
        console.log("UNPACK RAW TO HTML", htmlContent);
        const convertedToStringAllData = JSON.stringify(htmlContent);
        setReadyToSendPreparedHtml(convertedToStringAllData);
        if (isStepOne !== false) {
        setReadyToSendPreparedHtml(convertedToStringAllData);
        //this is commented section if you will use react-hook-forms
        // setValue(
        //   `products.${indexProduct}.description`,
        //   convertedToStringAllData
        // );
        // const productDescriptioForStepOne = watch(`products.${indexProduct}.description`)
        } else {
        // setValue("description", convertedToStringAllData);
        }
        return convertedToStringAllData;
    };

    //WHEN EDIT
    let descriptionParsed: string | object = isDataINWatch;
    // Function to check if a string is valid JSON
    const isJsonString = (str: string) => {
        try {
        JSON.parse(str);
        return true;
        } catch (e) {
        return false;
        }
    };

    // Check if the string is valid JSON
    //check which step
    const GetAndConvertValues = async () => {
        if (isStepOne !== false) {
        if (
            typeof productDescriptioForStepOne === "string" &&
            isJsonString(productDescriptioForStepOne)
        ) {
            descriptionParsed = JSON.parse(productDescriptioForStepOne);
        } else {
            descriptionParsed = productDescriptioForStepOne;
        }
        } else {
        if (typeof isDataINWatch === "string" && isJsonString(isDataINWatch)) {
            descriptionParsed = JSON.parse(isDataINWatch);
        } else {
            descriptionParsed = isDataINWatch;
        }
        }
        return descriptionParsed;
    };

    // if (typeof isDataINWatch === 'string' && isJsonString(isDataINWatch)) {
    //   descriptionParsed = JSON.parse(isDataINWatch)
    // } else {
    //   descriptionParsed = isDataINWatch
    // }
    //create html data for editor
    useEffect(() => {
        GetAndConvertValues();
        const contentBlock = htmlToDraft(descriptionParsed);
        if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
        );
        console.log(contentState);
        const editorStateFromServer = EditorState.createWithContent(contentState);
        console.log(editorStateFromServer);
        setEditorState(editorStateFromServer);
        }
    }, [productDescriptioForStepOne, isDataINWatch]);
    //note:how it work when generate html=>state editor(specified)=>  (convert to)raw format=>  (convert raw to html)html from raw =>  string from html=>send
    //note:how it work when get simple text or old generated html:string=>html=>raw=>content state
    // console.log("descriptionParsed", descriptionParsed);
    // console.log("productDescriptioForStepOne", productDescriptioForStepOne);
    // console.log(isJsonString(isDataINWatch));
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
            // defaultEditorState={}
        />
        </div>
    );
    };

    export default ExtendedEditor;
   ```

4. **Enjoy!**
   - Input your data or put dynamic text(data) and retrieve already prepared HTML to send to the backend.

---
