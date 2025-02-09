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
