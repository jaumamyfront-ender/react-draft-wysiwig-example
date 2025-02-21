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
