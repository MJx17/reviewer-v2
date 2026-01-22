import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor({ value, onChange }) {
  const [editorValue, setEditorValue] = useState(value || "");

  // Keep editorValue in sync if parent value changes (important for edit mode)
  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  // ✅ Cloudinary config from Vite env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
          undo redo | blocks fontfamily fontsize formatselect |
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
        advlist_bullet_styles: "disc,circle,square",
        advlist_number_styles: "default,lower-alpha,upper-alpha",
        content_style: `
          body { font-family: Georgia, serif; font-size: 16px; }
          ul, ol { margin-left: 1.5em; }
          li { margin-bottom: 0.3em; }
        `,
        automatic_uploads: true,
        images_upload_handler: async function (blobInfo, success, failure) {
          try {
            const formData = new FormData();
            formData.append("file", blobInfo.blob());
            formData.append("upload_preset", uploadPreset);

            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              { method: "POST", body: formData }
            );

            const data = await res.json();
            console.log("Cloudinary response:", data);

            if (!data.secure_url) return failure("No secure_url returned");

            // ✅ Must pass a string URL, never the object
            success(data.secure_url);

          } catch (err) {
            failure("Upload error: " + err.message);
          }
        }


      }}
      onEditorChange={(newValue) => {
        setEditorValue(newValue);
        if (onChange) onChange(newValue);
      }}
    />
  );
}
