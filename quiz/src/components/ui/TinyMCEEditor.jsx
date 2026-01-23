import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor({ value, onChange }) {
  const [editorValue, setEditorValue] = useState(value || "");

  // keep in sync for edit mode
  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const filePickerCallback = (callback, _value, meta) => {
    if (meta.filetype !== "image") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("No secure_url returned from Cloudinary");
        }

        // insert image into editor
        callback(data.secure_url, {
          title: file.name,
          alt: file.name,
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    };

    input.click();
  };

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={editorValue}
      init={{
        height: 500,
        plugins: [
          "lists",
          "advlist",
          "autolink",
          "link",
          "image",
          "media",
          "table",
          "code",
          "preview",
          "searchreplace",
          "insertdatetime",
          "visualblocks",
          "wordcount",
        ],
        toolbar: `
          undo redo | blocks fontfamily fontsize |
          bold italic underline strikethrough |
          forecolor backcolor |
          alignleft aligncenter alignright alignjustify |
          bullist numlist outdent indent |
          link image media table |
          removeformat | code preview fullscreen
        `,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        font_formats: `
          Arial=arial,helvetica,sans-serif;
          Courier New=courier new,courier,monospace;
          Georgia=georgia,palatino,serif;
          Times New Roman=times new roman,times,serif;
          Verdana=verdana,geneva,sans-serif
        `,
        content_style: `
          body { font-family: Georgia, serif; font-size: 16px; }
          ul, ol { margin-left: 1.5em; }
          li { margin-bottom: 0.3em; }
        `,
        file_picker_types: "image",
        file_picker_callback: filePickerCallback,
      }}
      onEditorChange={(newValue) => {
        setEditorValue(newValue);
        if (onChange) onChange(newValue);
      }}
    />
  );
}
